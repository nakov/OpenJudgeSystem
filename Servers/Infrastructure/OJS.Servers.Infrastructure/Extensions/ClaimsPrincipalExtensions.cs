namespace OJS.Servers.Infrastructure.Extensions
{
    using System.Security.Claims;

    public static class ClaimsPrincipalExtensions
    {
        public static bool IsAuthenticated(this ClaimsPrincipal user)
            => user?.Identity?.IsAuthenticated ?? false;
    }
}