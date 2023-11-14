namespace OJS.Servers.Ui.Infrastructure.Extensions
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Common.Models.Configurations;
    using static OJS.Common.GlobalConstants;
    using ApplicationConfig = OJS.Services.Ui.Models.ApplicationConfig;

    public static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Ui;

        private static readonly string ApiDocsTitle = $"{ApplicationFullName} {AppName} Api";

        public static void ConfigureServices<TProgram>(
            this IServiceCollection services,
            IConfiguration configuration,
            string apiVersion)
        {
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                services
                    .AddSpaStaticFiles(cnfg => { cnfg.RootPath = "ClientApp/dist"; });
            }

            services
                .AddWebServer<TProgram>()
                .AddHttpContextServices()
                .AddSwaggerDocs(apiVersion.ToApiName(), ApiDocsTitle, apiVersion)
                .AddHangfireServer(AppName)
                .AddMessageQueue<TProgram>(configuration)
                .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(configuration)
                .AddMemoryCache()
                .AddSoftUniJudgeCommonServices()
                .AddDistributedCaching(configuration)
                .AddLogging()
                .AddOptionsWithValidation<ApplicationConfig>(nameof(ApplicationConfig))
                .AddOptionsWithValidation<EmailServiceConfig>(nameof(EmailServiceConfig))
                .AddControllersWithViews();
        }
    }
}