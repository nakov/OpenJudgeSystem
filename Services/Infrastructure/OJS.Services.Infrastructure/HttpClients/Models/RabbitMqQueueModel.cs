namespace OJS.Services.Infrastructure.HttpClients.Models;

using System.Text.Json.Serialization;

public class RabbitMqQueueModel
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("messages_unacknowledged")]
    public int MessagesUnacknowledged { get; set; }

    [JsonPropertyName("messages_ready")]
    public int MessagesReady { get; set; }

    [JsonPropertyName("messages")]
    public int Messages { get; set; }

    [JsonPropertyName("vhost")]
    public string? VHost { get; set; }
}