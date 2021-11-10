namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Ui;

        public static void Configure<TProgram>(this IServiceCollection services)
            => services
                .AddWebServer<TProgram>()
                .AddHangfireServer(AppName)
                .AddIdentityDatabase<OjsDbContext, UserProfile>()
                .AddControllersWithViews();
    }
}