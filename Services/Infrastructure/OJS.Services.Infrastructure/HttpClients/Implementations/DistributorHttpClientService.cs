namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using OJS.Common;
    using OJS.Common.Utils;
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

            var hostOriginHeaderValue = EnvironmentUtils.GetByKey(ApplicationUrl);
            if (string.IsNullOrWhiteSpace(hostOriginHeaderValue))
            {
                throw new ArgumentException(string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, ApplicationUrl));
            }

            client.DefaultRequestHeaders.Add(GlobalConstants.HeaderKeys.Origin, EnvironmentUtils.GetByKey(ApplicationUrl));
            client.BaseAddress = new Uri(distributorBaseUrl);
        }
    }
}