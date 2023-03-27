namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Net.Http.Json;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using OJS.Common.Utils;
    using OJS.Services.Common.Models;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Common.GlobalConstants.ErrorMessages;

    public class SulsPlatformHttpClientService : HttpClientService, ISulsPlatformHttpClientService
    {
        private readonly ILogger<HttpClientService> logger;

        public SulsPlatformHttpClientService(
            HttpClient client,
            ILogger<HttpClientService> logger)
            : base(client)
        {
            var sulsPlatformBaseUrl = EnvironmentUtils.GetByKey(SulsPlatformBaseUrlKey);
            this.logger = logger;

            if (string.IsNullOrWhiteSpace(sulsPlatformBaseUrl))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformBaseUrlKey));
            }

            client.BaseAddress = new Uri(sulsPlatformBaseUrl);

            this.ApiKey = EnvironmentUtils.GetByKey(SulsPlatformApiKeyKey);

            if (string.IsNullOrWhiteSpace(this.ApiKey))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformApiKeyKey));
            }
        }

        protected string? ApiKey { get; set; }

        public Task<ExternalDataRetrievalResult<TData>> GetAsync<TData>(object requestData, string endpoint)
        {
            if (string.IsNullOrWhiteSpace(endpoint))
            {
                throw new ArgumentException(string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, nameof(endpoint)));
            }

            return this.InternalGetAsync<TData>(requestData, endpoint);
        }

        private static string GetQueryStringSeparator(string url)
            => url.Contains('?') ? "&" : "?";

        private static T? DeserializeJson<T>(Stream stream)
        {
            using var streamReader = new StreamReader(stream);
            using var jsonTextReader = new JsonTextReader(streamReader);
            var jsonSerializer = new JsonSerializer();
            return jsonSerializer.Deserialize<T>(jsonTextReader);
        }

        private async Task<ExternalDataRetrievalResult<TData>> InternalGetAsync<TData>(
            object requestData,
            string endpoint)
        {
            var externalDataResult = new ExternalDataRetrievalResult<TData>();

            var queryStringSeparator = GetQueryStringSeparator(endpoint);
            var requestUrl = $"{endpoint}{queryStringSeparator}apiKey={this.ApiKey}";

            try
            {
                // Using POST because of chance of enormous request data
                var response = await this.Client
                    .PostAsJsonAsync(requestUrl, requestData)
                    .ConfigureAwait(continueOnCapturedContext: false);

                if (response.IsSuccessStatusCode)
                {
                    await using var responseContentStream = await response.Content.ReadAsStreamAsync();
                    externalDataResult.Data = DeserializeJson<TData>(responseContentStream);
                }
                else
                {
                    externalDataResult.ErrorMessage = await response.Content.ReadAsStringAsync();
                    this.logger.LogError(externalDataResult.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                externalDataResult.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                this.logger.LogError(externalDataResult.ErrorMessage);
            }

            return externalDataResult;
        }
    }
}