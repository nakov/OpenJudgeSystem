namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using OJS.Common.Utils;
    using System;
    using System.Net.Http;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Common.GlobalConstants.ErrorMessages;

    public class SulsPlatformHttpClientService : HttpClientService, ISulsPlatformHttpClientService
    {
        public SulsPlatformHttpClientService(HttpClient client)
            : base(client)
        {
            var baseUrl = EnvironmentUtils.GetByKey(SulsPlatformBaseUrlKey);

            if (string.IsNullOrWhiteSpace(baseUrl))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformBaseUrlKey));
            }

            client.BaseAddress = new Uri(baseUrl);
        }
    }
}