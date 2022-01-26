using FluentExtensions.Extensions;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    public static class HttpContextExtensions
    {
        private static class Constants
        {
            public const string Role = "role";
            public const string EmailAddress = "email";
            public const string Subject = "sub";

            public const string Administrator = "Administrator";
            public const string Developer = "Developer";
        }

        public static async Task<string> GetUserId(this HttpContext httpContext)
            => httpContext.User
                ?.Claims.FirstOrDefault(x => x.Type == Constants.Subject)
                ?.Value;

        public static async Task<string> GetUserEmail(this HttpContext httpContext)
            => await httpContext.GetClaimByType(Constants.EmailAddress);

        public static async Task<string> GetClaimByType(this HttpContext httpContext, string claimType)
            => (httpContext.User)
                ?.Claims.FirstOrDefault(x => x.Type == claimType)
                ?.Value;

        public static bool IsUserAdminOrDeveloper(this HttpContext httpContext)
        {
            var roles = httpContext.User.Claims.Select(x => x.ToString()).ToList();

            var adminRole = $"role: {Constants.Administrator}";
            var devRole = $"role: {Constants.Developer}";

            return roles.Contains(adminRole) || roles.Contains(devRole);
        }

        public static IEnumerable<string> GetUserRoles(this HttpContext httpContext)
            => httpContext.User.Claims
                .Where(x => x.Type == Constants.Role)
                .Select(x => x.Value);

        public static async Task<T> ReadFromBodyAndRewind<T>(this HttpContext httpContext)
        {
            // Ensure the request body can be read multiple times.
            httpContext.Request.EnableBuffering();

            var bufferSize = 1024;

            using (var streamReader = new StreamReader(
                httpContext.Request.Body,
                Encoding.UTF8,
                detectEncodingFromByteOrderMarks: false,
                bufferSize,
                leaveOpen: true))
            {
                var bodyAsString = await streamReader.ReadToEndAsync();
                var requestModel = bodyAsString.FromJson<T>();

                // Reset the request body stream position so it can be read again
                httpContext.Request.Body.Position = 0;

                return requestModel;
            }
        }
    }
}
