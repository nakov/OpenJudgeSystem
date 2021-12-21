namespace OJS.Services.Infrastructure.HttpClients.Implementations
{
    using FluentExtensions.Extensions;
    using System;
    using System.Net.Http;
    using System.Net.Http.Json;
    using System.Text;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants.ErrorMessages;
    using static OJS.Common.GlobalConstants.MimeTypes;

    public class HttpClientService : IHttpClientService
    {
        protected readonly HttpClient Client;

        public HttpClientService(HttpClient client)
            => this.Client = client;

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

        private async Task<HttpResponseMessage> GetResponse(string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                throw new ArgumentException(UrlCannotBeNull);
            }

            var responseMessage = await this.Client.GetAsync(url);
            await this.ValidateResponseMessage(responseMessage);

            return responseMessage;
        }

        private async Task<TResponse?> Post<TResponse>(HttpContent content, string url)
        {
            var responseMessage = await this.Client.PostAsync(url, content);
            await this.ValidateResponseMessage(responseMessage);
            var result = await responseMessage.Content.ReadFromJsonAsync<TResponse>();

            return result;
        }

        private async Task ValidateResponseMessage(HttpResponseMessage responseMessage)
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
    }
}