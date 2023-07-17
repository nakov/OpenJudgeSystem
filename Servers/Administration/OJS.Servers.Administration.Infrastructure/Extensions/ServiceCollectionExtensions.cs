namespace OJS.Servers.Administration.Infrastructure.Extensions
{
    using AutoCrudAdmin.Extensions;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using SoftUni.Data.Infrastructure.Enumerations;
    using SoftUni.Judge.Common.Extensions;
    using System.Linq;
    using static OJS.Common.GlobalConstants;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Administration;

        private static readonly string[] RequiredConfigValues =
        {
            EnvironmentVariables.LocalTimeZone,
        };

        public static void ConfigureServices<TProgram>(this IServiceCollection services) =>
            services
                .AddWebServer<TProgram>()
                .AddHangfireServer(AppName)
                .ConfigureGlobalDateFormat()
                .ValidateLaunchSettings(RequiredConfigValues)
                .AddIdentityDatabase<AdminDbContext, UserProfile, Role, UserInRole>(Enumerable.Empty<GlobalQueryFilterType>())
                .AddScoped<OjsDbContext, AdminDbContext>()
                .AddDistributedCaching<TProgram>()
                .AddSoftUniJudgeCommonServices()
                .UseAutoCrudAdmin()
                .AddControllersWithViews();
    }
}