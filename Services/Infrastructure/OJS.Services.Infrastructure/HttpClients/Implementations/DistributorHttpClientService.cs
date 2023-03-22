namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using OJS.Common;
    using OJS.Common.Utils;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Common.GlobalConstants.ErrorMessages;

    public class DistributorHttpClientService : SulsPlatformHttpClientService, IDistributorHttpClientService
    {
        public DistributorHttpClientService(HttpClient client)
            : base(client)
        {
            var distributorBaseUrl = EnvironmentUtils.GetByKey(DistributorBaseUrlKey);

            if (string.IsNullOrWhiteSpace(distributorBaseUrl))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformBaseUrlKey));
            }

            client.DefaultRequestHeaders.Add(GlobalConstants.HeaderKeys.HostOrigin, EnvironmentUtils.GetByKey(ApplicationUrl));
            client.BaseAddress = new Uri(distributorBaseUrl);
        }
    }
}