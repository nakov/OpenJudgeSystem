namespace OJS.Servers.Infrastructure.Filters
{
    using Hangfire.Dashboard;
    using OJS.Servers.Infrastructure.Extensions;

    public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
            => context
                .GetHttpContext()
                .User
                .IsAdmin();
    }
}