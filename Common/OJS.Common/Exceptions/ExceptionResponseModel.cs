namespace OJS.Common.Exceptions;

using System.Text.Json.Serialization;

public class ExceptionResponseModel
{
    public ExceptionResponseModel()
    {
    }

    public ExceptionResponseModel(string name, string message)
    {
        this.Name = name;
        this.Message = message;
    }

    [JsonPropertyName("name")]
    public string? Name { get; set; } = null;

    [JsonPropertyName("message")]
    public string? Message { get; set; } = null;
}