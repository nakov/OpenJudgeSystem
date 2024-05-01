namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Json;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using FluentExtensions.Extensions;
    using Microsoft.Extensions.Logging;
    using OJS.Common.Extensions;
    using static OJS.Common.GlobalConstants.ErrorMessages;
    using static OJS.Common.GlobalConstants.MimeTypes;

    public class HttpClientService : IHttpClientService
    {
#pragma warning disable SA1401
        protected readonly HttpClient Client;
#pragma warning restore SA1401

        protected HttpClientService(
            HttpClient client,
            ILogger<HttpClientService> logger,
            string? apiKey)
        {
            this.Client = client;
            this.Logger = logger;
            this.ApiKey = apiKey;
        }

        protected string? ApiKey { get; set; }

        private ILogger<HttpClientService> Logger { get; set; }

        public async Task<TResponse?> Post<TResponse>(object model, string url)
        {
            if (model == null)
            {
                throw new ArgumentException(ModelCannotBeNull);
            }

            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentException(UrlCannotBeNull);
            }

            var requestContent = new StringContent(model.ToJson(), Encoding.UTF8, ApplicationJson);

            return await this.Post<TResponse>(requestContent, url);
        }

        public async Task<TResponse?> PostForm<TResponse>(MultipartFormDataContent form, string url)
        {
            if (form == null)
            {
                throw new ArgumentException(FormCannotBeNull);
            }

            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentException(UrlCannotBeNull);
            }

            return await this.Post<TResponse>(form, url);
        }

        public async Task<TResponse?> Get<TResponse>(string url)
        {
            var responseMessage = await this.GetResponse(url);
            return await responseMessage.Content.ReadFromJsonAsync<TResponse>();
        }

        public async Task<byte[]> Get(string url)
        {
            var responseMessage = await this.GetResponse(url);
            return await responseMessage.Content.ReadAsByteArrayAsync();
        }

        public Task<ExternalDataRetrievalResult<TData>> GetAsync<TData>(object requestData, string endpoint)
        {
            if (string.IsNullOrWhiteSpace(endpoint))
            {
                throw new ArgumentException(string.Format(ValueCannotBeNullOrWhiteSpaceTemplate, nameof(endpoint)));
            }

            return this.InternalPostAsync<TData>(requestData, endpoint);
        }

        private static string GetQueryStringSeparator(string url)
            => url.Contains('?') ? "&" : "?";

        private static async Task ValidateResponseMessage(HttpResponseMessage responseMessage)
        {
            if (!responseMessage.IsSuccessStatusCode)
            {
                var errorMessage = GenericErrorMessage;
                var requestMessage = responseMessage.RequestMessage;

                if (requestMessage != null)
                {
                    errorMessage =
                        $"{requestMessage.Method.Method} request to {requestMessage.RequestUri} failed. " +
                        $"Status code: {responseMessage.StatusCode}.";

                    var content = await responseMessage.Content.ReadAsStringAsync();
                    if (!string.IsNullOrEmpty(content))
                    {
                        errorMessage += Environment.NewLine + content;
                    }
                }

                throw new Exception(errorMessage);
            }
        }

        private async Task<ExternalDataRetrievalResult<TData>> InternalPostAsync<TData>(
            object requestData,
            string endpoint)
        {
            var externalDataResult = new ExternalDataRetrievalResult<TData>();

            var requestUrl = this.InternalGetEndpoint(endpoint);

            try
            {
                this.Logger.LogInformation($"Sending {HttpMethod.Post} {requestUrl} to {this.Client.BaseAddress}");
                var response = await this.Client
                    .PostAsJsonAsync(requestUrl, requestData, cancellationToken: CancellationToken.None)
                    .ConfigureAwait(continueOnCapturedContext: false);

                if (response.IsSuccessStatusCode)
                {
                    await using var responseContentStream = await response.Content.ReadAsStreamAsync();
                    externalDataResult.Data = responseContentStream.FromJson<TData>();
                }
                else
                {
                    externalDataResult.ErrorMessage = await response.Content.ReadAsStringAsync();
                    this.Logger.LogError(externalDataResult.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                externalDataResult.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                this.Logger.LogError(externalDataResult.ErrorMessage);
            }

            return externalDataResult;
        }

        private async Task<HttpResponseMessage> GetResponse(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentException(UrlCannotBeNull);
            }

            var responseMessage = await this.Client.GetAsync(url);
            await ValidateResponseMessage(responseMessage);

            return responseMessage;
        }

        private async Task<TResponse?> Post<TResponse>(HttpContent content, string url)
        {
            var responseMessage = await this.Client.PostAsync(url, content);
            await ValidateResponseMessage(responseMessage);
            var result = await responseMessage.Content.ReadFromJsonAsync<TResponse>();

            return result;
        }

        private string InternalGetEndpoint(string endpoint) => $"{endpoint}{GetQueryStringSeparator(endpoint)}apiKey={this.ApiKey}";
    }
}