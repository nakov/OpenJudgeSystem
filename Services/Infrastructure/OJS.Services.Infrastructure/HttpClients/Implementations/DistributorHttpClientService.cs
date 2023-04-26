namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using Microsoft.Extensions.Logging;
    using OJS.Common;
    using OJS.Common.Utils;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;

    public class DistributorHttpClientService : HttpClientService, IDistributorHttpClientService
    {
        public DistributorHttpClientService(HttpClient client, ILogger<HttpClientService> logger)
            : base(client, logger, EnvironmentUtils.GetByKey(DistributorApiKeyKey))
        {
            var distributorBaseUrl = EnvironmentUtils.GetRequiredByKey(DistributorBaseUrlKey);
            var hostOriginHeaderValue = EnvironmentUtils.GetRequiredByKey(ApplicationUrl);

            client.DefaultRequestHeaders.Add(GlobalConstants.HeaderKeys.Origin, hostOriginHeaderValue);
            client.BaseAddress = new Uri(distributorBaseUrl);
        }
    }
}