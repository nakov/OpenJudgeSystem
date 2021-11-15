namespace OJS.Servers.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Http;
    using OJS.Common;
    using OJS.Common.Extensions.Json;
    using System.Net;
    using System.Threading.Tasks;

    public static class HttpExtensions
    {
        public static Task WriteJson<T>(this HttpResponse response, T obj)
        {
            response.ContentType = GlobalConstants.MimeTypes.ApplicationJson;

            return response.WriteAsync(obj.ToJson());
        }

        public static Task WriteUnauthorized(this HttpResponse response)
        {
            response.Clear();
            response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return response.WriteAsync("Unauthorized");
        }
    }
}