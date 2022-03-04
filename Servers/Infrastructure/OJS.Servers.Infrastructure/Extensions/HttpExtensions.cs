namespace OJS.Servers.Infrastructure.Extensions
{
    using FluentExtensions.Extensions;
    using Microsoft.AspNetCore.Http;
    using OJS.Common;
    using System;
    using System.Net;
    using System.Threading.Tasks;

    public static class HttpExtensions
    {
        public static Task WriteJson<T>(this HttpResponse response, T? obj)
        {
            response.ContentType = GlobalConstants.MimeTypes.ApplicationJson;

            if (obj == null)
            {
                throw new ArgumentNullException(nameof(obj));
            }

            return response.WriteAsync(obj.ToJson());
        }

        public static Task WriteUnauthorized(this HttpResponse response)
        {
            response.Clear();
            response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return response.WriteAsync("Unauthorized");
        }

        public static string GetReturnUrl(this HttpContext httpContext)
        {
            var referer = httpContext.Request.GetTypedHeaders().Referer;

            return referer != null
                ? referer.PathAndQuery
                : "/";
        }
    }
}