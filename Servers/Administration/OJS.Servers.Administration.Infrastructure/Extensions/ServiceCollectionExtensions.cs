namespace OJS.Servers.Administration.Infrastructure.Extensions
{
    using AutoCrudAdmin.Extensions;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Administration;

        public static void Configure<TProgram>(this IServiceCollection services)
            => services
                .AddWebServer<TProgram>()
                .AddHangfireServer(AppName)
                .AddIdentityDatabase<OjsDbContext, UserProfile>()
                .UseAutoCrudAdmin()
                .AddControllersWithViews();
    }
}