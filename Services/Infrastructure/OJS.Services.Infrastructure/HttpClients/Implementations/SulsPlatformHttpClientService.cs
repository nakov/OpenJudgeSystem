namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using Microsoft.Extensions.Logging;
    using OJS.Common.Utils;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Common.GlobalConstants.ErrorMessages;

    public class SulsPlatformHttpClientService : HttpClientService, ISulsPlatformHttpClientService
    {
        public SulsPlatformHttpClientService(HttpClient client, ILogger<HttpClientService> logger)
            : base(client, logger, EnvironmentUtils.GetByKey(SulsPlatformApiKeyKey))
        {
            var sulsPlatformBaseUrl = EnvironmentUtils.GetByKey(SulsPlatformBaseUrlKey);

            if (string.IsNullOrWhiteSpace(sulsPlatformBaseUrl))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformBaseUrlKey));
            }

            client.BaseAddress = new Uri(sulsPlatformBaseUrl);

            if (string.IsNullOrWhiteSpace(this.ApiKey))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformApiKeyKey));
            }
        }
    }
}