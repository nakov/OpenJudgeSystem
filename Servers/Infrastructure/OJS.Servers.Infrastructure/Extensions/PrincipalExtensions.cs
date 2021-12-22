namespace OJS.Servers.Infrastructure.Extensions
{
    using OJS.Common;
    using System.Security.Claims;
    using System.Security.Principal;

    public static class PrincipalExtensions
    {
        public static string? GetId(this ClaimsPrincipal? principal)
            => principal?.FindFirstValue(ClaimTypes.NameIdentifier);

        public static bool IsAuthenticated(this IPrincipal principal)
            => principal.Identity?.IsAuthenticated ?? false;

        public static bool IsAdmin(this IPrincipal principal)
            => principal.IsInRole(GlobalConstants.Roles.Administrator);

        public static bool IsLecturer(this IPrincipal principal)
            => principal.IsInRole(GlobalConstants.Roles.Lecturer);

        public static bool IsAdminOrLecturer(this IPrincipal principal)
            => principal.IsAdmin() || principal.IsLecturer();
    }
}