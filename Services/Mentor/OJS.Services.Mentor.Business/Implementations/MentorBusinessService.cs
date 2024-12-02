namespace OJS.Services.Mentor.Business.Implementations;

using System.Globalization;
using System.Net;
using System.Text;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Build.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models;
using OJS.Data.Models.Mentor;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Cache;
using OJS.Services.Infrastructure.Constants;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Mentor.Business;
using OJS.Services.Mentor.Models;
using OJS.Services.Ui.Data;
using OpenAI;
using OpenAI.Chat;
using TiktokenSharp;
using Table = DocumentFormat.OpenXml.Wordprocessing.Table;
using static OJS.Common.GlobalConstants.Settings;

public class MentorBusinessService : IMentorBusinessService
{
    private const string SvnHttpClientName = "Svn";
    private const string DefaultHttpClientName = "Default";
    private const string Docx = "docx";
    private const string DocumentNotFoundOrEmpty = "Judge was unable to find the problem's description. Please contact an administrator and report the problem.";

    private readonly IDataService<UserMentor> userMentorData;
    private readonly IDataService<MentorPromptTemplate> mentorPromptTemplateData;
    private readonly IHttpClientFactory httpClientFactory;
    private readonly IDataService<Setting> settingData;
    private readonly IContestsDataService contestsData;
    private readonly ICacheService cache;
    private readonly ILogger<MentorBusinessService> logger;
    private readonly IConfiguration configuration;
    private readonly OpenAIClient openAiClient;

    public MentorBusinessService(
        IDataService<UserMentor> userMentorData,
        IDataService<MentorPromptTemplate> mentorPromptTemplateData,
        IHttpClientFactory httpClientFactory,
        IDataService<Setting> settingData,
        IContestsDataService contestsData,
        ICacheService cache,
        ILogger<MentorBusinessService> logger,
        OpenAIClient openAiClient)
    {
        this.userMentorData = userMentorData;
        this.mentorPromptTemplateData = mentorPromptTemplateData;
        this.httpClientFactory = httpClientFactory;
        this.settingData = settingData;
        this.contestsData = contestsData;
        this.cache = cache;
        this.logger = logger;
        this.openAiClient = openAiClient;
    }

    public async Task<ConversationResponseModel> StartConversation(ConversationRequestModel model)
    {
        var settings = await this.settingData
            .GetQuery(s => s.Name.StartsWith(Mentor))
            .AsNoTracking()
            .ToDictionaryAsync(k => k.Name, v => v.Value);

        var userMentor = await this.userMentorData
            .GetQuery(um => um.Id == model.UserId)
            .FirstOrDefaultAsync();

        if (userMentor is null)
        {
            userMentor = new UserMentor
            {
                Id = model.UserId,
                CreatedOn = DateTime.UtcNow,
                ModifiedOn = DateTime.UtcNow,
                RequestsMade = 0,
                QuotaLimit = null,
                QuotaResetTime = DateTime.UtcNow.AddMinutes(GetNumericValue(settings, nameof(MentorQuotaResetTimeInMinutes))),
            };

            await this.userMentorData.Add(userMentor);
            await this.userMentorData.SaveChanges();
        }

        if (DateTime.UtcNow >= userMentor.QuotaResetTime)
        {
            userMentor.RequestsMade = 0;
            userMentor.QuotaResetTime = DateTime.UtcNow.AddMinutes(GetNumericValue(settings, nameof(MentorQuotaResetTimeInMinutes)));
        }

        if (userMentor.RequestsMade >= (userMentor.QuotaLimit ?? GetNumericValue(settings, nameof(MentorQuotaLimit))))
        {
            model.Messages.Add(new ConversationMessageModel
            {
                Content = $"Достигнахте лимита на съобщенията си, моля опитайте отново след {GetTimeUntilNextMessage(userMentor.QuotaResetTime)}.",
                Role = MentorMessageRole.Information,
                SequenceNumber = model.Messages.Max(cm => cm.SequenceNumber) + 1,
                ProblemId = model.ProblemId,
            });

            return model.Map<ConversationResponseModel>();
        }

        var currentProblemMessages = model.Messages
            .Where(m => m.ProblemId == model.ProblemId && m.Role != MentorMessageRole.Information)
            .ToList();

        var messagesToSend = new List<ChatMessage>();

        var systemMessage = await this.cache.Get(
            string.Format(CacheConstants.MentorSystemMessage, model.UserId, model.ProblemId),
            async () => await this.GetSystemMessage(model),
            CacheConstants.OneHourInSeconds);
        systemMessage.Content = RemoveRedundantWhitespace(systemMessage.Content);
        messagesToSend.Add(CreateChatMessage(systemMessage.Role, systemMessage.Content));

        var recentMessages = currentProblemMessages
            .Where(cm => cm.Role is not MentorMessageRole.System and not MentorMessageRole.Information)
            .OrderByDescending(cm => cm.SequenceNumber)
            .Take(GetNumericValue(settings, nameof(MentorMessagesSentCount)))
            .ToList();

        foreach (var message in recentMessages)
        {
            message.Content = RemoveRedundantWhitespace(message.Content);
        }

        if (!Enum.TryParse<OpenAIModels>(settings[MentorModel], out var openAiModel))
        {
            throw new BusinessServiceException($"The provided mentor model \"{settings[MentorModel]}\" is invalid.");
        }

        var mentorModel = openAiModel.ToModelString();

        var encoding = await TikToken.EncodingForModelAsync(mentorModel);
        var allContent = systemMessage.Content + string.Join("", recentMessages.Select(m => m.Content));
        var tokenCount = encoding.Encode(allContent).Count;

        var maxInputTokens = GetNumericValue(settings, nameof(MentorMaxInputTokenCount));
        if (tokenCount > maxInputTokens)
        {
            TrimMessages(recentMessages, encoding, tokenCount - maxInputTokens);
        }

        messagesToSend.AddRange(recentMessages.Select(cm => CreateChatMessage(cm.Role, cm.Content)));

        var chat = this.openAiClient.GetChatClient(mentorModel);
        var response = await chat.CompleteChatAsync(messagesToSend, new ChatCompletionOptions
        {
            MaxOutputTokenCount = GetNumericValue(settings, nameof(MentorMaxOutputTokenCount)),
        });

        if (response is null)
        {
            throw new BusinessServiceException("Unable to process your request at this time. Please try again in a few moments.");
        }

        var assistantContent = string.Join(Environment.NewLine, response.Value.Content.Select(part => part.Text).Where(text => !string.IsNullOrEmpty(text)));

        model.Messages.Add(new ConversationMessageModel
        {
            Content = assistantContent,
            Role = MentorMessageRole.Assistant,
            SequenceNumber = model.Messages.Max(cm => cm.SequenceNumber) + 1,
            ProblemId = model.ProblemId,
        });

        userMentor.RequestsMade++;
        await this.userMentorData.SaveChanges();

        return model.Map<ConversationResponseModel>();
    }

    private string ExtractSectionFromDocument(
        byte[] bytes,
        string problemName,
        int problemNumber,
        int problemId,
        int contestId)
    {
        try
        {
            using var memoryStream = new MemoryStream(bytes);
            using var wordDocument = WordprocessingDocument.Open(memoryStream, false);

            var body = wordDocument.MainDocumentPart?.Document.Body;
            if (body is null)
            {
                throw new BusinessServiceException(DocumentNotFoundOrEmpty);
            }

            var sections = new Dictionary<string, (int Index, List<string> Data, OpenXmlElement Element)>();
            string? currentHeading = null;
            var sectionCount = 0;

            // First pass: Extract all sections into the dictionary
            foreach (var element in body.Elements())
            {
                if (element is Paragraph paragraph)
                {
                    var styleId = paragraph.ParagraphProperties?.ParagraphStyleId?.Val?.Value;
                    var text = paragraph.InnerText.Trim();

                    if (string.IsNullOrEmpty(text))
                    {
                        continue;
                    }

                    var isHeading = !string.IsNullOrEmpty(styleId) && (styleId.StartsWith("Heading2", StringComparison.Ordinal) || styleId == "2");

                    if (isHeading)
                    {
                        sectionCount++;
                        currentHeading = text;
                        if (!sections.ContainsKey(currentHeading))
                        {
                            sections[currentHeading] = (sectionCount, new List<string>(), paragraph);
                        }
                    }
                    else if (currentHeading != null)
                    {
                        sections[currentHeading].Data.Add(text);
                    }
                }
            }

            // Second pass: Find the matching section and process it fully
            foreach (var section in sections)
            {
                // Case 1: Match by name
                if (problemName.Contains(section.Key, StringComparison.OrdinalIgnoreCase))
                {
                    return ProcessMatchedSection(section.Value.Element, section.Key);
                }
                // Case 2: Match by section number
                else if (section.Value.Index == problemNumber)
                {
                    return ProcessMatchedSection(section.Value.Element, section.Key);
                }
            }

            return string.Empty;
        }
        catch (Exception)
        {
            this.logger.LogFileParsingFailure(problemId, contestId);
            throw new BusinessServiceException(DocumentNotFoundOrEmpty);
        }
    }

    private static string ProcessMatchedSection(OpenXmlElement sectionElement, string sectionHeading)
    {
        var resultContent = new StringBuilder();
        resultContent.AppendLine($"## {sectionHeading}");

        // Process all content until the next heading of same or higher level
        var currentElement = sectionElement.NextSibling();
        while (currentElement != null)
        {
            if (currentElement is Paragraph paragraph)
            {
                var styleId = paragraph.ParagraphProperties?.ParagraphStyleId?.Val?.Value;
                var isHeading = !string.IsNullOrEmpty(styleId) && (styleId.StartsWith("Heading2", StringComparison.Ordinal) || styleId == "2");

                if (isHeading)
                {
                    break;
                }

                var text = paragraph.InnerText.Trim();
                if (!string.IsNullOrEmpty(text))
                {
                    resultContent.AppendLine(text);
                }
            }
            else if (currentElement is Table table)
            {
                ProcessTable(table, resultContent);
            }

            currentElement = currentElement.NextSibling();
        }

        return resultContent.ToString().Trim();
    }

    private static void ProcessTable(Table table, StringBuilder matchingSectionContent)
    {
        var rows = table.Elements<TableRow>().ToList();
        if (rows.Count == 0)
        {
            return;
        }

        /*
         * Currently, this implementation accepts that the first row will be of headers,
         * this might need to be generalized after testing.
         */
        var headerRow = rows.First();
        var headers = headerRow.Elements<TableCell>()
            .Select(cell => cell.InnerText.Trim())
            .ToList();

        foreach (var row in rows.Skip(1))
        {
            var cells = row.Elements<TableCell>().ToList();
            var rowValues = cells.Select(cell =>
            {
                var runs = cell.Descendants<Text>();
                return string.Join(" ", runs.Select(r => r.Text.Trim()));
            }).ToList();

            if (rowValues.All(string.IsNullOrEmpty))
            {
                continue;
            }

            var rowData = new StringBuilder();
            for (var i = 0; i < Math.Min(headers.Count, rowValues.Count); i++)
            {
                if (!string.IsNullOrEmpty(rowValues[i]))
                {
                    if (rowData.Length > 0)
                    {
                        rowData.Append(" ⦚ ");
                    }

                    rowData.Append(CultureInfo.InvariantCulture, $"{headers[i]}: {rowValues[i]}");
                }
            }

            matchingSectionContent.AppendLine(rowData.ToString());
        }
    }

    private static void TrimMessages(
        ICollection<ConversationMessageModel> messages,
        TikToken encoding,
        int tokensToRemove)
    {
        if (tokensToRemove <= 0 || messages.Count == 0)
        {
            return;
        }

        var oldestMessage = messages
            .OrderBy(m => m.SequenceNumber)
            .First();

        var tokenCount = encoding.Encode(oldestMessage.Content).Count;
        messages.Remove(oldestMessage);

        TrimMessages(messages, encoding, tokensToRemove - tokenCount);
    }

    private static ChatMessage CreateChatMessage(MentorMessageRole role, string content)
        => role switch
        {
            MentorMessageRole.System => ChatMessage.CreateSystemMessage(content),
            MentorMessageRole.User => ChatMessage.CreateUserMessage(content),
            MentorMessageRole.Assistant => ChatMessage.CreateAssistantMessage(content),
            _ => throw new BuildAbortedException("The provided message role is not supported."),
        };

    private static string GetTimeUntilNextMessage(DateTimeOffset quotaResetTime)
    {
        var timeUntilReset = quotaResetTime.UtcDateTime - DateTime.UtcNow;

        var timeComponents = new List<string>();

        if (timeUntilReset.Days > 0)
        {
            timeComponents.Add($"{timeUntilReset.Days} {(timeUntilReset.Days > 1 ? "дни" : "ден")}");
        }

        if (timeUntilReset.Hours > 0)
        {
            timeComponents.Add($"{timeUntilReset.Hours} {(timeUntilReset.Hours > 1 ? "часа" : "час")}");
        }

        if (timeUntilReset.Minutes > 0)
        {
            timeComponents.Add($"{timeUntilReset.Minutes} {(timeUntilReset.Minutes > 1 ? "минути" : "минута")}");
        }

        if (timeUntilReset.Seconds > 0)
        {
            timeComponents.Add($"{timeUntilReset.Seconds} {(timeUntilReset.Seconds > 1 ? "секунди" : "секунда")}");
        }

        return string.Join(", ", timeComponents);
    }

    private static string RemoveRedundantWhitespace(string content)
    {
        if (string.IsNullOrEmpty(content))
        {
            return content;
        }

        var sb = new StringBuilder(content.Length);
        var previousWasSpace = false;

        foreach (var c in content)
        {
            if (char.IsWhiteSpace(c))
            {
                if (!previousWasSpace)
                {
                    sb.Append(' ');
                    previousWasSpace = true;
                }
            }
            else
            {
                sb.Append(c);
                previousWasSpace = false;
            }
        }

        return sb.ToString().Trim();
    }

    private static int GetProblemNumber(string problemName)
    {
        if (string.IsNullOrWhiteSpace(problemName))
        {
            return int.MaxValue;
        }

        var firstWord = problemName.Split(' ').First();
        var numericPart = new string(firstWord.TakeWhile(c => char.IsDigit(c) || c == '.').ToArray());

        if (!string.IsNullOrEmpty(numericPart))
        {
            numericPart = numericPart.TrimEnd('.');
            if (int.TryParse(numericPart, NumberStyles.Any, CultureInfo.InvariantCulture, out var number))
            {
                return number;
            }
        }

        return int.MaxValue;
    }

    private static int GetNumericValue(Dictionary<string, string> settings, string key)
        => int.Parse(settings[key], CultureInfo.InvariantCulture);

    private async Task<ConversationMessageModel> GetSystemMessage(ConversationRequestModel model)
    {
        /*
         *  In the first version of the mentor, there will be only a single
         *  template in the database. This is why we can be sure that
         *  .FirstOrDefaultAsync() will always return a template. This
         *  will be changed in the future.
         */
        var template = await this.mentorPromptTemplateData
            .GetQuery()
            .AsNoTracking()
            .FirstOrDefaultAsync();

        var problemsResources = await this.contestsData
            .GetByIdQuery(model.ContestId)
            .AsNoTracking()
            .Select(c => c.ProblemGroups
                .SelectMany(pg => pg.Problems
                    .SelectMany(p => p.Resources
                        .Where(r => r.Type == ProblemResourceType.ProblemDescription))))
            .SelectMany(resources => resources)
            .ToListAsync();

        var wordFiles = problemsResources
            .Where(pr =>
                   pr is { File: not null, FileExtension: Docx } ||
                   pr.Link is not null && pr.Link.Split('.').Last().Equals(Docx, StringComparison.Ordinal))
            .ToList();

        /*
         *  There are 2 cases when it comes to document retrieval:
         *  1. The problem has its own problem resource ( Word file ) ( e.g. online / onsite exam ).
         *  2. All the problems' descriptions are in a single Word file ( e.g. Lab / Exercise ).
         */
        var problemsDescription = wordFiles.FirstOrDefault(pr => pr.ProblemId == model.ProblemId) ?? wordFiles.FirstOrDefault();

        if (problemsDescription is null)
        {
            throw new BusinessServiceException(DocumentNotFoundOrEmpty);
        }

        var file = problemsDescription.File ??
            (problemsDescription.Link is not null
            ? await this.DownloadDocument(problemsDescription.Link, model.ProblemId, model.ContestId)
            : []);

        var number = GetProblemNumber(model.ProblemName);
        var text = this.ExtractSectionFromDocument(file, model.ProblemName, number, model.ProblemId, model.ContestId);

        return new ConversationMessageModel
        {
            Content = string.Format(
                CultureInfo.InvariantCulture,
                template!.Template,
                model.ProblemName,
                text,
                model.ContestName,
                model.CategoryName),
            Role = MentorMessageRole.System,
            // The system message should always be first ( in ascending order )
            SequenceNumber = int.MinValue,
            ProblemId = model.ProblemId,
        };
    }

    private async Task<byte[]> DownloadDocument(string link, int problemId, int contestId)
    {
        var fileBytes = link.Contains("/svn", StringComparison.OrdinalIgnoreCase)
            ? await this.DownloadSvnResource(link, problemId, contestId)
            : await this.DownloadResource(link, problemId, contestId);

        if (!IsExpectedFormat(fileBytes))
        {
            this.logger.LogInvalidDocumentFormat(problemId, contestId, link);
            throw new BusinessServiceException(DocumentNotFoundOrEmpty);
        }

        return fileBytes;
    }

    private async Task<byte[]> DownloadResource(string url, int problemId, int contestId)
    {
        var client = this.httpClientFactory.CreateClient(DefaultHttpClientName);
        return await this.FetchResource(url, client, problemId, contestId);
    }

    private async Task<byte[]> DownloadSvnResource(string path, int problemId, int contestId)
    {
        var index = path.IndexOf("svn", StringComparison.OrdinalIgnoreCase);
        var resourcePath = path[(index + "svn".Length)..].TrimStart('/');

        using var client = this.httpClientFactory.CreateClient(SvnHttpClientName);

        return await this.FetchResource(resourcePath, client, problemId, contestId);
    }

    private async Task<byte[]> FetchResource(string link, HttpClient client, int problemId, int contestId)
    {
        try
        {
            var response = await client.GetAsync(link, HttpCompletionOption.ResponseHeadersRead);

            if (response is not { IsSuccessStatusCode: true })
            {
                this.logger.LogHttpRequestFailure(problemId, contestId, response?.StatusCode ?? HttpStatusCode.ServiceUnavailable, link);
                throw new BusinessServiceException(DocumentNotFoundOrEmpty);
            }

            var fileBytes = await response.Content.ReadAsByteArrayAsync();

            if (fileBytes.Length == 0)
            {
                this.logger.LogFileNotFoundOrEmpty(problemId, contestId, link);
                throw new BusinessServiceException(DocumentNotFoundOrEmpty);
            }

            return fileBytes;
        }
        catch (Exception)
        {
            this.logger.LogResourceDownloadFailure(problemId, contestId, link);
            throw new BusinessServiceException(DocumentNotFoundOrEmpty);
        }
    }

    private static bool IsExpectedFormat(byte[] fileBytes)
    {
        // .docx files are ZIP archives, so they start with the ZIP file signature: "PK"
        const byte p = 0x50; // ASCII for 'P'
        const byte k = 0x4B; // ASCII for 'K'

        return fileBytes.Length >= 2 && fileBytes[0] == p && fileBytes[1] == k;
    }
}
