namespace OJS.Servers.Administration.Infrastructure.Extensions
{
    using System.Linq;
    using AutoCrudAdmin.Extensions;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using SoftUni.Data.Infrastructure.Enumerations;
    using static OJS.Common.GlobalConstants;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Administration;

        private static readonly string[] RequiredConfigValues =
        {
            EnvironmentVariables.LocalTimeZone,
        };

        public static void ConfigureServices<TProgram>(
            this IServiceCollection services,
            IConfiguration configuration)
            => services
                .AddWebServer<TProgram>()
                .AddHttpContextServices()
                .AddHangfireServer(AppName)
                .AddMessageQueue<TProgram>(configuration)
                .ConfigureGlobalDateFormat()
                .ValidateLaunchSettings(RequiredConfigValues)
                .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(Enumerable.Empty<GlobalQueryFilterType>())
                .AddDistributedCaching<TProgram>()
                .AddSoftUniJudgeCommonServices()
                .UseAutoCrudAdmin()
                .AddControllersWithViews();
    }
}