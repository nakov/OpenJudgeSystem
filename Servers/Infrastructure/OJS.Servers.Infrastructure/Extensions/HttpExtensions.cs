namespace OJS.Servers.Infrastructure.Extensions
{
    using FluentExtensions.Extensions;
    using Microsoft.AspNetCore.Http;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using static OJS.Common.GlobalConstants;
    using static OJS.Servers.Infrastructure.ServerConstants;

    public static class HttpExtensions
    {
        public static Task WriteJson<T>(this HttpResponse response, T? obj)
        {
            response.ContentType = MimeTypes.ApplicationJson;

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

        public static void AppendAuthInfoCookies(this HttpContext httpContext, IEnumerable<string> roles, string username)
        {
            if (roles.Any(r => r is Roles.Administrator or Roles.Lecturer))
            {
                httpContext.Response.Cookies.Append(Authentication.CanAccessAdministrationCookieName, "yes");
            }

            httpContext.Response.Cookies.Append(Authentication.LoggedInUsername, username);
        }

        public static void ClearAuthInfoCookies(this HttpContext httpContext)
        {
            httpContext.Response.Cookies.Delete(Authentication.CanAccessAdministrationCookieName);
            httpContext.Response.Cookies.Delete(Authentication.LoggedInUsername);
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