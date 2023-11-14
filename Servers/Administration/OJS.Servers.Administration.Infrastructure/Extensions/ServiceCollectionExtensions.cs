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
    using OJS.Services.Common.Models.Configurations;
    using SoftUni.Data.Infrastructure.Enumerations;
    using ApplicationConfig = OJS.Services.Administration.Models.ApplicationConfig;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Administration;

        public static void ConfigureServices<TProgram>(
            this IServiceCollection services,
            IConfiguration configuration) =>
            services
                .AddWebServer<TProgram>()
                .AddHttpContextServices()
                .AddHangfireServer(AppName)
                .AddMessageQueue<TProgram>(configuration)
                .ConfigureGlobalDateFormat()
                .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(
                    configuration,
                    Enumerable.Empty<GlobalQueryFilterType>())
                .AddMemoryCache()
                .AddDistributedCaching(configuration)
                .AddSoftUniJudgeCommonServices()
                .AddOptionsWithValidation<ApplicationConfig>(nameof(ApplicationConfig))
                .AddOptionsWithValidation<EmailServiceConfig>(nameof(EmailServiceConfig))
                .UseAutoCrudAdmin()
                .AddControllersWithViews();
    }
}