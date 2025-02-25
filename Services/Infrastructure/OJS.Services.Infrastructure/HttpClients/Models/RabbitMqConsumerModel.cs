namespace OJS.Services.Infrastructure.HttpClients.Models;

using System.Text.Json.Serialization;

public class RabbitMqConsumerModel
{
    [JsonPropertyName("active")]
    public bool Active { get; set; }

    [JsonPropertyName("prefetch_count")]
    public int PrefetchCount { get; set; }

    [JsonPropertyName("channel_details")]
    public RabbitMqConsumerChannelDetails ChannelDetails { get; set; } = new();

    [JsonPropertyName("queue")]
    public RabbitMqConsumerQueueModel Queue { get; set; } = new();
}