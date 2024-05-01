namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using OJS.Services.Infrastructure.Configurations;

    public class SulsPlatformHttpClientService : HttpClientService, ISulsPlatformHttpClientService
    {
        public SulsPlatformHttpClientService(
            HttpClient client,
            ILogger<HttpClientService> logger,
            IOptions<ApplicationUrlsConfig> appUrlsOptions)
            : base(client, logger, appUrlsOptions.Value.SulsPlatformApiKey)
        {
            var appUrls = appUrlsOptions.Value;
            client.BaseAddress = new Uri(appUrls.SulsPlatformBaseUrl);
        }
    }
}