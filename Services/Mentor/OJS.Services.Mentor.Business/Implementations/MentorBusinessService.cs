namespace OJS.Services.Mentor.Business.Implementations;

using System.Globalization;
using System.Text;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Build.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OJS.Common.Enumerations;
using OJS.Common.Extensions;
using OJS.Data.Models;
using OJS.Data.Models.Mentor;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Common.Data;
using OJS.Services.Infrastructure.Configurations;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using OJS.Services.Mentor.Business;
using OJS.Services.Mentor.Models;
using OpenAI;
using OpenAI.Chat;
using TiktokenSharp;
using Table = DocumentFormat.OpenXml.Wordprocessing.Table;
using static OJS.Common.GlobalConstants.Settings;

public class MentorBusinessService : IMentorBusinessService
{
    private const string Docx = "docx";
    private const string DocumentNotFoundOrEmpty = "Judge was unable to find the problem's description. Please copy and paste the problem description directly into the chat for the mentor to assist you.";

    private readonly IDataService<UserMentor> userMentorData;
    private readonly IDataService<MentorPromptTemplate> mentorPromptTemplateData;
    private readonly OpenAIClient openAiClient;
    private readonly IHttpClientFactory httpClientFactory;
    private readonly IDataService<Setting> settingData;

    public MentorBusinessService(
        IDataService<UserMentor> userMentorData,
        IDataService<MentorPromptTemplate> mentorPromptTemplateData,
        IHttpClientFactory httpClientFactory,
        IDataService<Setting> settingData,
        IConfiguration configuration)
    {
        this.userMentorData = userMentorData;
        this.mentorPromptTemplateData = mentorPromptTemplateData;
        this.openAiClient = new OpenAIClient(configuration.GetSectionWithValidation<MentorConfig>().ApiKey);
        this.httpClientFactory = httpClientFactory;
        this.settingData = settingData;
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
            throw new BusinessServiceException($"You have reached your message limit, please try again after {GetTimeUntilNextMessage(userMentor.QuotaResetTime)}.");
        }

        if (model.ConversationMessages.All(cm => cm.Role != ChatMessageRole.System))
        {
            var template = await this.mentorPromptTemplateData
                .GetQuery()
                .FirstOrDefaultAsync();

            var wordFiles = model.ProblemResources
                .Where(pr =>
                       pr is { File: not null, FileExtension: Docx } ||
                       pr.Link is not null && pr.Link.Split('.').Last().Equals(Docx, StringComparison.Ordinal))
                .ToList();

            var problemResource = wordFiles
                                    .FirstOrDefault(pr => pr.ProblemId == model.ProblemId) ??
                                wordFiles.FirstOrDefault();

            if (problemResource is null)
            {
                throw new BusinessServiceException(DocumentNotFoundOrEmpty);
            }

            var file = problemResource.File ??
                (problemResource.Link is not null ?
                await this.DownloadDocument(problemResource.Link) :
                []);

            var number = GetProblemNumber(model.ProblemName);
            var text = ExtractSectionFromDocument(file, model.ProblemName, number);

            model.ConversationMessages.Add(new ConversationMessageModel
            {
                Content = string.Format(CultureInfo.InvariantCulture, template!.Template, model.ProblemName, text),
                Role = ChatMessageRole.System,
                SequenceNumber = int.MinValue,
            });
        }

        var messagesToSend = new List<ChatMessage>();

        var systemMessage = model.ConversationMessages.First(cm => cm.Role == ChatMessageRole.System);
        systemMessage.Content = RemoveRedundantWhitespace(systemMessage.Content);
        messagesToSend.Add(CreateChatMessage(systemMessage.Role, systemMessage.Content));

        var recentMessages = model.ConversationMessages
            .Where(cm => cm.Role != ChatMessageRole.System)
            .OrderByDescending(cm => cm.SequenceNumber)
            .Take(GetNumericValue(settings, nameof(MentorMessagesSentCount)))
            .ToList();

        foreach (var message in recentMessages)
        {
            message.Content = RemoveRedundantWhitespace(message.Content);
        }

        var mentorModel = Enum.Parse<OpenAIModels>(settings[MentorModel]).ToModelString() ?? OpenAIModels.Gpt4o.ToModelString();

        var encoding = await TikToken.EncodingForModelAsync(mentorModel!);
        var allContent = systemMessage.Content + string.Join("", recentMessages.Select(m => m.Content));
        var tokenCount = encoding.Encode(allContent).Count;

        var maxInputTokens = GetNumericValue(settings, nameof(MentorQuotaResetTimeInMinutes));
        if (tokenCount > maxInputTokens)
        {
            TrimMessages(recentMessages, encoding, tokenCount - maxInputTokens);
        }

        messagesToSend.AddRange(recentMessages.Select(cm => CreateChatMessage(cm.Role, cm.Content)));

        var chat = this.openAiClient.GetChatClient(mentorModel!);
        var response = await chat.CompleteChatAsync(messagesToSend, new ChatCompletionOptions
        {
            MaxOutputTokenCount = GetNumericValue(settings, nameof(MentorMaxOutputTokenCount)),
        });

        if (response is null)
        {
            throw new BusinessServiceException("Unable to process your request at this time. Please try again in a few moments.");
        }

        var assistantContent = string.Join("\n", response.Value.Content.Select(part => part.Text).Where(text => !string.IsNullOrEmpty(text)));

        model.ConversationMessages.Add(new ConversationMessageModel
        {
            Content = assistantContent,
            Role = ChatMessageRole.Assistant,
            SequenceNumber = model.ConversationMessages.Max(cm => cm.SequenceNumber) + 1
        });

        userMentor.RequestsMade++;
        await this.userMentorData.SaveChanges();

        return model.Map<ConversationResponseModel>();
    }

    private static string ExtractSectionFromDocument(byte[] bytes, string problemName, int problemNumber)
    {
        using var memoryStream = new MemoryStream(bytes);
        using var wordDocument = WordprocessingDocument.Open(memoryStream, false);

        var body = wordDocument.MainDocumentPart?.Document.Body;
        if (body is null)
        {
            throw new BusinessServiceException(DocumentNotFoundOrEmpty);
        }

        var sectionCount = 0;
        string? currentHeading = null;
        var resultContent = new StringBuilder();
        var shouldCollectContent = false;
        /*
         *  Cases for extracting the document's data:
         *      1. The heading's name matches the problem's name
         *      2. The heading's name does not match the problem's name, but the number of sections matches the problem's number
         *      3. No matching section has been found, return the document's whole data
         */
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

                var isHeading = !string.IsNullOrEmpty(styleId) && (styleId.StartsWith("Heading1", StringComparison.Ordinal) || styleId.StartsWith("Heading2", StringComparison.Ordinal));

                if (isHeading)
                {
                    // Case 1: Check if this heading matches the problem name
                    if (problemName.Contains(text, StringComparison.OrdinalIgnoreCase))
                    {
                        currentHeading = text;
                        shouldCollectContent = true;
                        resultContent.Clear(); // Clear any previous content
                        continue;
                    }

                    // If we were collecting content for a matching heading, we're done
                    if (shouldCollectContent && currentHeading != null && sectionCount < problemNumber)
                    {
                        return resultContent.ToString().Trim();
                    }

                    sectionCount++;

                    // Case 2: Check if we should start collecting from this section based on problem number
                    if (sectionCount == problemNumber)
                    {
                        shouldCollectContent = true;
                        resultContent.AppendLine($"## {text}");
                    }
                    else if (sectionCount > problemNumber)
                    {
                        resultContent.AppendLine($"## {text}");
                    }

                    currentHeading = text;
                }
                else
                {
                    // For Case 3, collect everything
                    if (problemNumber > sectionCount)
                    {
                        resultContent.AppendLine(text);
                    }
                    // For other cases, collect only when flagged
                    else if (shouldCollectContent)
                    {
                        resultContent.AppendLine(text);
                    }
                }
            }
            else if (element is Table table)
            {
                // For Case 3, collect all tables
                if (problemNumber > sectionCount)
                {
                    ProcessTable(table, resultContent);
                }
                // For other cases, collect only when flagged
                else if (shouldCollectContent)
                {
                    ProcessTable(table, resultContent);
                }
            }
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

    private static ChatMessage CreateChatMessage(ChatMessageRole role, string content)
        => role switch
        {
            ChatMessageRole.System => ChatMessage.CreateSystemMessage(content),
            ChatMessageRole.User => ChatMessage.CreateUserMessage(content),
            ChatMessageRole.Assistant => ChatMessage.CreateAssistantMessage(content),
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
