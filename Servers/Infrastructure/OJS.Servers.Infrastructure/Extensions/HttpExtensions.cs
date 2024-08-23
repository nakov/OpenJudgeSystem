namespace OJS.Servers.Infrastructure.Extensions
{
    using FluentExtensions.Extensions;
    using Microsoft.AspNetCore.Http;
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants;

    public static class HttpExtensions
    {
        public static Task WriteJson<T>(this HttpResponse response, T? obj, CancellationToken cancellationToken = default)
        {
            response.ContentType = MimeTypes.ApplicationJson;

            if (obj == null)
            {
                throw new ArgumentNullException(nameof(obj));
            }

            return response.WriteAsync(obj.ToJson(), cancellationToken);
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