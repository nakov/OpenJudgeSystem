namespace OJS.Services.Mentor.Business.Implementations;

using System.Globalization;
using System.Text;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Build.Exceptions;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models;
using OJS.Data.Models.Mentor;
using OJS.Services.Common.Data;
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
    private const string Docx = "docx";
    private const string DocumentNotFoundOrEmpty = "Judge was unable to find the problem's description. Please contact an administrator and report the problem.";
    private const string ProblemDescriptionNotFound = "Не успях да намеря описанието на задачата. Можете ли да го предоставите, за да мога да Ви помогна?";


    private readonly IDataService<UserMentor> userMentorData;
    private readonly IDataService<MentorPromptTemplate> mentorPromptTemplateData;
    private readonly OpenAIClient openAiClient;
    private readonly IHttpClientFactory httpClientFactory;
    private readonly IDataService<Setting> settingData;
    private readonly IContestsDataService contestsData;

    public MentorBusinessService(
        IDataService<UserMentor> userMentorData,
        IDataService<MentorPromptTemplate> mentorPromptTemplateData,
        IHttpClientFactory httpClientFactory,
        IDataService<Setting> settingData,
        IContestsDataService contestsData,
        OpenAIClient openAiClient)
    {
        this.userMentorData = userMentorData;
        this.mentorPromptTemplateData = mentorPromptTemplateData;
        this.httpClientFactory = httpClientFactory;
        this.settingData = settingData;
        this.contestsData = contestsData;
        this.openAiClient = openAiClient;
    }

    public async Task<ConversationResponseModel> StartConversation(ConversationRequestModel model)
    {
        var settings = await this.settingData
            .GetQuery(s => s.Name.StartsWith(Mentor))
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

        if (userMentor.RequestsMade > (userMentor.QuotaLimit ?? GetNumericValue(settings, nameof(MentorQuotaLimit))))
        {
            model.ConversationMessages.Add(new ConversationMessageModel
            {
                Content = $"Достигнахте лимита на съобщенията си, моля опитайте отново след {GetTimeUntilNextMessage(userMentor.QuotaResetTime)}.",
                Role = MentorMessageRole.Information,
                SequenceNumber = model.ConversationMessages.Max(cm => cm.SequenceNumber) + 1,
            });

            return model.Map<ConversationResponseModel>();
        }

        /*
         *  If the system message is not present, we should add it.
         *  The system message contains how the model should act
         *  and the problem's description.
         */
        if (model.ConversationMessages.All(cm => cm.Role != MentorMessageRole.System))
        {
            /*
             *  In the first version of the mentor, there will be only a single
             *  template in the database. This is why we can be sure that
             *  .FirstOrDefaultAsync() will always return a template. This
             *  will be changed in the future.
             */
            var template = await this.mentorPromptTemplateData
                .GetQuery()
                .FirstOrDefaultAsync();

            var problemsResources = await this.contestsData.GetByIdQuery(model.ContestId)
                .Include(c => c.ProblemGroups)
                .ThenInclude(pg => pg.Problems)
                .ThenInclude(p => p.Resources)
                .SelectMany(c => c.ProblemGroups.SelectMany(pg => pg.Problems).SelectMany(p => p.Resources))
                .ToListAsync();

            // AllProblemResources + type is problem desc
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
                ? await this.DownloadDocument(problemsDescription.Link)
                : []);

            var number = GetProblemNumber(model.ProblemName);
            var text = ExtractSectionFromDocument(file, model.ProblemName, number);

            if (string.IsNullOrWhiteSpace(text))
            {
                // If we could not extract the message, prompt the user to send it himself.
                model.ConversationMessages.Add(new ConversationMessageModel
                {
                    Content = ProblemDescriptionNotFound,
                    Role = MentorMessageRole.Information,
                    SequenceNumber = model.ConversationMessages.Max(cm => cm.SequenceNumber) + 1,
                });

                return model.Map<ConversationResponseModel>();
            }
            else
            {
                model.ConversationMessages.Add(new ConversationMessageModel
                {
                    Content = string.Format(CultureInfo.InvariantCulture, template!.Template, model.ProblemName, text),
                    Role = MentorMessageRole.System,
                    // The system message should always be first ( in ascending order )
                    SequenceNumber = int.MinValue,
                });
            }
        }

        var messagesToSend = new List<ChatMessage>();

        var systemMessage = model.ConversationMessages.First(cm => cm.Role == MentorMessageRole.System);
        systemMessage.Content = RemoveRedundantWhitespace(systemMessage.Content);
        messagesToSend.Add(CreateChatMessage(systemMessage.Role, systemMessage.Content));

        var recentMessages = model.ConversationMessages
            .Where(cm => cm.Role != MentorMessageRole.System && cm.Role != MentorMessageRole.Information)
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

        model.ConversationMessages.Add(new ConversationMessageModel
        {
            Content = assistantContent,
            Role = MentorMessageRole.Assistant,
            SequenceNumber = model.ConversationMessages.Max(cm => cm.SequenceNumber) + 1
        });

        userMentor.RequestsMade++;
        await this.userMentorData.SaveChanges();

        return model.Map<ConversationResponseModel>();
    }

    // If the problem is not found by name - instruct the model to ask the user for its description
    // Handle case 2 with .StartsWith and trimming
    private static string ExtractSectionFromDocument(byte[] bytes, string problemName, int problemNumber)
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

    private async Task<byte[]> DownloadDocument(string link)
    {
        var client = this.httpClientFactory.CreateClient();

        var response = await client.GetAsync(link);

        if (response is null || !response.IsSuccessStatusCode)
        {
            throw new BusinessServiceException(DocumentNotFoundOrEmpty);
        }

        var fileBytes = await response.Content.ReadAsByteArrayAsync();

        if (fileBytes.Length == 0)
        {
            throw new BusinessServiceException(DocumentNotFoundOrEmpty);
        }

        return fileBytes;
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
            timeComponents.Add($"{timeUntilReset.Days} day{(timeUntilReset.Days > 1 ? "s" : "")}");
        }

        if (timeUntilReset.Hours > 0)
        {
            timeComponents.Add($"{timeUntilReset.Hours} hour{(timeUntilReset.Hours > 1 ? "s" : "")}");
        }

        if (timeUntilReset.Minutes > 0)
        {
            timeComponents.Add($"{timeUntilReset.Minutes} minute{(timeUntilReset.Minutes > 1 ? "s" : "")}");
        }

        if (timeUntilReset.Seconds > 0)
        {
            timeComponents.Add($"{timeUntilReset.Seconds} second{(timeUntilReset.Seconds > 1 ? "s" : "")}");
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
}
