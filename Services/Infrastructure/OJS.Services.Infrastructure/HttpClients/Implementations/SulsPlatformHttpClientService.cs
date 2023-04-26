namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using Microsoft.Extensions.Logging;
    using OJS.Common.Utils;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;

    public class SulsPlatformHttpClientService : HttpClientService, ISulsPlatformHttpClientService
    {
        public SulsPlatformHttpClientService(HttpClient client, ILogger<HttpClientService> logger)
            : base(client, logger, EnvironmentUtils.GetByKey(SulsPlatformApiKeyKey))
        {
            var sulsPlatformBaseUrl = EnvironmentUtils.GetRequiredByKey(SulsPlatformBaseUrlKey);

            client.BaseAddress = new Uri(sulsPlatformBaseUrl);

            EnvironmentUtils.GetRequiredByKey(this.ApiKey!);
        }
    }
}