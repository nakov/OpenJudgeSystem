namespace OJS.Servers.Administration.Infrastructure.Extensions
{
    using AutoCrudAdmin.Extensions;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Common.Utils;
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

        public static void ConfigureServices<TProgram>(this IServiceCollection services)
            => services
                .AddWebServer<TProgram>()
                .AddHangfireServer(AppName)
                .ValidateLaunchSettings()
                .AddIdentityDatabase<AdminDbContext, UserProfile, Role, UserInRole>(Enumerable.Empty<GlobalQueryFilterType>())
                .AddScoped<OjsDbContext, AdminDbContext>()
                .AddSoftUniJudgeCommonServices()
                .UseAutoCrudAdmin()
                .AddControllersWithViews();

        private static IServiceCollection ValidateLaunchSettings(this IServiceCollection services)
        {
            var requiredConfigValues = new[]
            {
                EnvironmentVariables.DistributorBaseUrlKey,
                EnvironmentVariables.ApplicationUrl,
                EnvironmentVariables.PathToCommonKeyRingFolderKey,
                EnvironmentVariables.RedisConnectionString,
                EnvironmentVariables.SharedAuthCookieDomain,
                EnvironmentVariables.LocalTimeZone,
            };

            EnvironmentUtils.ValidateEnvironmentVariableExists(requiredConfigValues);

            return services;
        }
    }
}