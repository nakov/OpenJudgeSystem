namespace OJS.Services.Infrastructure.HttpClients
{
    using System.Net.Http;
    using System.Threading.Tasks;

    public interface IHttpClientService
    {
        /// <summary>
        /// Post http request to the url.
        /// </summary>
        /// <typeparam name="TResponse">Type to which the response of the request will be deserialized.</typeparam>
        /// <param name="model">Object which will be serialized and sent in the request body.</param>
        /// <param name="url">Request url.</param>
        /// <returns>The response of the request deserialized to object of type TResponse.</returns>
        Task<TResponse?> Post<TResponse>(object model, string url);

        /// <summary>
        /// Post http request to the url.
        /// </summary>
        /// <typeparam name="TResponse">Type to which the response of the request will be deserialized.</typeparam>
        /// <param name="form">Object representing form data, which will be serialized and sent in the request as form data.</param>
        /// <param name="url">Request url.</param>
        /// <returns>The response of the request deserialized to object of type TResponse.</returns>
        Task<TResponse?> PostForm<TResponse>(MultipartFormDataContent form, string url);

        /// <summary>
        /// Get http request to the url.
        /// </summary>
        /// <typeparam name="TResponse">Type to which the response of the request will be deserialized.</typeparam>
        /// <param name="url">Request url.</param>
        /// <returns>The response of the request deserialized to object of type TResponse.</returns>
        Task<TResponse?> Fetch<TResponse>(string url);

        Task<byte[]> Fetch(string url);
    }
}