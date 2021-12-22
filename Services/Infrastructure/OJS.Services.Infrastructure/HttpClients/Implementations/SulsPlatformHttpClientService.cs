namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using Newtonsoft.Json;
    using OJS.Common.Utils;
    using OJS.Services.Common.Models;
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Net.Http.Json;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Common.GlobalConstants.ErrorMessages;

    public class SulsPlatformHttpClientService : HttpClientService, ISulsPlatformHttpClientService
    {
        private readonly string? apiKey;

        public SulsPlatformHttpClientService(HttpClient client)
            : base(client)
        {
            var sulsPlatformBaseUrl = EnvironmentUtils.GetByKey(SulsPlatformBaseUrlKey);

            if (string.IsNullOrWhiteSpace(sulsPlatformBaseUrl))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformBaseUrlKey));
            }

            client.BaseAddress = new Uri(sulsPlatformBaseUrl);

            this.apiKey = EnvironmentUtils.GetByKey(SulsPlatformApiKeyKey);

            if (string.IsNullOrWhiteSpace(this.apiKey))
            {
                throw new ArgumentException(
                    string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, SulsPlatformApiKeyKey));
            }
        }

        public Task<ExternalDataRetrievalResult<TData>> GetAsync<TData>(object requestData, string endpoint)
        {
            if (string.IsNullOrWhiteSpace(endpoint))
            {
                throw new ArgumentException(string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, nameof(endpoint)));
            }

            return InternalGetAsync<TData>(requestData, endpoint);
        }

        private async Task<ExternalDataRetrievalResult<TData>> InternalGetAsync<TData>(
            object requestData,
            string endpoint)
        {
            var externalDataResult = new ExternalDataRetrievalResult<TData>();

            var queryStringSeparator = GetQueryStringSeparator(endpoint);
            var requestUrl = $"/{endpoint}{queryStringSeparator}apiKey={this.apiKey}";

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
                }
            }
            catch(Exception ex)
            {
                externalDataResult.ErrorMessage = ex.InnerException?.Message?? ex.Message;
            }

            return externalDataResult;
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
    }
}