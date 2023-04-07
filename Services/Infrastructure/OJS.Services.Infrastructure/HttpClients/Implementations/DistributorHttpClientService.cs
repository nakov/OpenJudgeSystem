namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using Microsoft.Extensions.Logging;
    using OJS.Common.Utils;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Common.GlobalConstants.ErrorMessages;

    public class DistributorHttpClientService : HttpClientService, IDistributorHttpClientService
    {
        public DistributorHttpClientService(HttpClient client, ILogger<HttpClientService> logger)
            : base(client, logger, EnvironmentUtils.GetByKey(DistributorApiKeyKey))
        {
            var distributorBaseUrl = EnvironmentUtils.GetByKey(DistributorBaseUrlKey);

            if (string.IsNullOrWhiteSpace(distributorBaseUrl))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformBaseUrlKey));
            }

            client.BaseAddress = new Uri(distributorBaseUrl);
        }
    }
}