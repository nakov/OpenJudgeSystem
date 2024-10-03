namespace OJS.Services.Common.HttpRequester
{
    using System;
    using System.IO;
    using System.Net.Http;
    using System.Threading.Tasks;

    using Newtonsoft.Json;

    using OJS.Services.Common.HttpRequester.Models;

    public class HttpRequesterService : IHttpRequesterService
    {
        // TODO: Add to resource
        private const string InvalidUrlMessage = "Invalid URL.";

        private const string InvalidApiKeyMessage = "Invalid API key.";
        private const string ErrorInConnectingToTheRemoteServerMessage = "Remote server connection problem.";

        public ExternalDataRetrievalResult<TData> Get<TData>(object requestData, string url, string apiKey)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                throw new ArgumentException(InvalidUrlMessage, nameof(url));
            }

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new ArgumentException(InvalidApiKeyMessage, nameof(apiKey));
            }

            return InternalGet<TData>(requestData, url, apiKey);
        }

        public Task<ExternalDataRetrievalResult<TData>> GetAsync<TData>(object requestData, string url, string apiKey)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                throw new ArgumentException(InvalidUrlMessage, nameof(url));
            }

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new ArgumentException(InvalidApiKeyMessage, nameof(apiKey));
            }

            return InternalGetAsync<TData>(requestData, url, apiKey);
        }

        private static ExternalDataRetrievalResult<TData> InternalGet<TData>(
            object requestData,
            string url,
            string apiKey)
        {
            var externalDataResult = new ExternalDataRetrievalResult<TData>();

            var queryStringSeparator = GetQueryStringSeparator(url);
            var requestUrl = $"{url}{queryStringSeparator}apiKey={apiKey}";

            using (var httpClient = new HttpClient())
            {
                try
                {
                    // Using POST because of chance of enormous request data
                    var response = httpClient.PostAsJsonAsync(requestUrl, requestData).GetAwaiter().GetResult();

                    if (response.IsSuccessStatusCode)
                    {
                        using (var responseContentStream = response.Content.ReadAsStreamAsync().Result)
                        {
                            externalDataResult.Data = DeserializeJson<TData>(responseContentStream);
                        }
                    }
                    else
                    {
                        var errorMessage = response.Content.ReadAsStringAsync().Result;
                        externalDataResult.ErrorMessage = string.IsNullOrWhiteSpace(errorMessage)
                            ? ErrorInConnectingToTheRemoteServerMessage
                            : errorMessage;
                    }
                }
                catch(Exception ex)
                {
                    externalDataResult.ErrorMessage = ex.InnerException?.Message?? ex.Message;
                }
            }

            return externalDataResult;
        }

        private static async Task<ExternalDataRetrievalResult<TData>> InternalGetAsync<TData>(
            object requestData,
            string url,
            string apiKey)
        {
            var externalDataResult = new ExternalDataRetrievalResult<TData>();

            var queryStringSeparator = GetQueryStringSeparator(url);
            var requestUrl = $"{url}{queryStringSeparator}apiKey={apiKey}";

            using (var httpClient = new HttpClient())
            {
                try
                {
                    // Using POST because of chance of enormous request data
                    var response = await httpClient
                        .PostAsJsonAsync(requestUrl, requestData)
                        .ConfigureAwait(continueOnCapturedContext: false);

                    if (response.IsSuccessStatusCode)
                    {
                        using (var responseContentStream = await response.Content.ReadAsStreamAsync())
                        {
                            externalDataResult.Data = DeserializeJson<TData>(responseContentStream);
                        }
                    }
                    else
                    {
                        var errorMessage = await response.Content.ReadAsStringAsync();
                        externalDataResult.ErrorMessage = string.IsNullOrWhiteSpace(errorMessage)
                            ? ErrorInConnectingToTheRemoteServerMessage
                            : errorMessage;
                    }
                }
                catch(Exception ex)
                {
                    externalDataResult.ErrorMessage = ex.InnerException?.Message?? ex.Message;
                }
            }

            return externalDataResult;
        }

        private static string GetQueryStringSeparator(string url) =>
            url.IndexOf("?", StringComparison.Ordinal) >= 0 ? "&" : "?";

        private static T DeserializeJson<T>(Stream stream)
        {
            using (var streamReader = new StreamReader(stream))
            {
                using (var jsonTextReader = new JsonTextReader(streamReader))
                {
                    var jsonSerializer = new JsonSerializer();
                    return jsonSerializer.Deserialize<T>(jsonTextReader);
                }
            }
        }
    }
}