namespace OJS.Services.Common.Models.Configurations;

public class MessageQueueConfig
{
        public string Host { get; set; } = string.Empty;

        public string VirtualHost { get; set; } = string.Empty;

        public string User { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public int RetryCount { get; set; } = 5;

        public int RetryInterval { get; set; } = 200;

        public int? PrefetchCount { get; set; }
}