#nullable disable
namespace OJS.Workers.SubmissionProcessors.Common
{
    using System;
    using System.Net.Http;
    using System.Text;

    using Newtonsoft.Json;

#pragma warning disable CA1001
    public class HttpService
#pragma warning restore CA1001
    {
        private readonly HttpClient httpClient;

        public HttpService() => this.httpClient = new HttpClient();

        public HttpService(int timeoutInSeconds)
        {
            this.httpClient = new HttpClient();
            this.httpClient.Timeout = TimeSpan.FromSeconds(timeoutInSeconds);
        }

        public TResponseBody PostJson<TRequestBody, TResponseBody>(string url, TRequestBody body)
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(url),
                Content = new StringContent(
                    JsonConvert.SerializeObject(body),
                    Encoding.UTF8,
                    "application/json"),
            };

            var response = this.httpClient.SendAsync(request)
                .Result;
            var content = response.Content.ReadAsStringAsync()
                .Result;

            return JsonConvert.DeserializeObject<TResponseBody>(content);
        }

        public string Get(string url)
            => this.httpClient.GetAsync(url)
                .Result
                .Content
                .ReadAsStringAsync()
                .Result;

        public TResponse Get<TResponse>(string url)
            => JsonConvert.DeserializeObject<TResponse>(this.Get(url));
    }
}
