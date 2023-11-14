namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using OJS.Services.Common.Models.Configurations;

    public class SulsPlatformHttpClientService : HttpClientService, ISulsPlatformHttpClientService
    {
        public SulsPlatformHttpClientService(
            HttpClient client,
            ILogger<HttpClientService> logger,
            IOptions<ApplicationConfig> appConfigOptions)
            : base(client, logger, appConfigOptions.Value.SulsPlatformApiKey)
        {
            var appConfig = appConfigOptions.Value;
            client.BaseAddress = new Uri(appConfig.SulsPlatformBaseUrl);
        }
    }
}