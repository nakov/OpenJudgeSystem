namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Ui.Models.Configurations;
    using SoftUni.Judge.Common.Extensions;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Configuration;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Ui;

        public static void ConfigureServices<TProgram>(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddSpaStaticFiles(cnfg => { cnfg.RootPath = "ClientApp/build"; });

            services
                .AddWebServer<TProgram>()
                .AddHangfireServer(AppName)
                .AddIdentityDatabase<OjsDbContext, UserProfile>()
                .AddMemoryCache()
                .AddSoftUniJudgeCommonServices()
                .AddLogging()
                .ConfigureSettings(configuration)
                .AddControllersWithViews();
        }

        private static IServiceCollection ConfigureSettings(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services
                .Configure<DistributorConfig>(configuration.GetSection(nameof(DistributorConfig)));

            return services;
        }
    }
}