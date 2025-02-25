namespace OJS.Services.Infrastructure.HttpClients.Models;

using System.Text.Json.Serialization;

public class RabbitMqChannelModel
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("messages_unacknowledged")]
    public int MessagesUnacknowledged { get; set; }

    [JsonPropertyName("prefetch_count")]
    public int PrefetchCount { get; set; }

    [JsonPropertyName("consumer_count")]
    public int ConsumerCount { get; set; }
}