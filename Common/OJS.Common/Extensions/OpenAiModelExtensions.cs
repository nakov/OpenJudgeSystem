namespace OJS.Common.Extensions;

using OJS.Common.Enumerations;

public static class OpenAiModelExtensions
{
    public static string? ToModelString(this OpenAIModels model) => model switch
    {
        OpenAIModels.Gpt4o => "gpt-4o",
        OpenAIModels.Gpt4oMini => "gpt-4o-mini",
        OpenAIModels.O1Preview => "o1-preview",
        OpenAIModels.O1Mini => "o1-mini",
        OpenAIModels.Gpt35Turbo => "gpt-3.5-turbo",
        OpenAIModels.TextEmbedding3Small => "text-embedding-3-small",
        OpenAIModels.TextEmbedding3Large => "text-embedding-3-large",
        OpenAIModels.DallE3 => "dall-e-3",
        OpenAIModels.Whisper => "whisper",
        _ => null,
    };
}