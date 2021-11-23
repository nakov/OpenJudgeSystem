namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Ui.Models.Configurations;
    using SoftUni.Judge.Common.Extensions;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Ui;

        public static void ConfigureServices<TProgram>(this IServiceCollection services, IConfiguration configuration)
            => services
                .AddWebServer<TProgram>()
                .AddHangfireServer(AppName)
                .AddIdentityDatabase<OjsDbContext, UserProfile>()
                .AddMemoryCache()
                .AddSoftUniJudgeCommonServices()
                .ConfigureSettings(configuration)
                .AddControllersWithViews();

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