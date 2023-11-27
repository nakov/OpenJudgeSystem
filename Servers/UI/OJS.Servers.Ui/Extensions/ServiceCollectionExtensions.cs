namespace OJS.Servers.Ui.Extensions
{
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using OJS.Common.Enumerations;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Common.Models.Configurations;
    using static OJS.Common.GlobalConstants;
    using ApplicationConfig = OJS.Services.Ui.Models.ApplicationConfig;

    internal static class ServiceCollectionExtensions
    {
        private const ApplicationName AppName = ApplicationName.Ui;

        private static readonly string ApiDocsTitle = $"{ApplicationFullName} {AppName} Api";

        public static void ConfigureServices(
            this IServiceCollection services,
            IConfiguration configuration,
            IWebHostEnvironment environment,
            string apiVersion)
        {
            if (environment.IsDevelopment())
            {
                services
                    .AddSpaStaticFiles(cnfg => { cnfg.RootPath = "ClientApp/dist"; });
            }

            services
                .AddWebServer<Program>()
                .AddHttpContextServices()
                .AddSwaggerDocs(apiVersion.ToApiName(), ApiDocsTitle, apiVersion)
                .AddHangfireServer(configuration, AppName)
                .AddMessageQueue<Program>(configuration)
                .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(configuration)
                .AddMemoryCache()
                .AddSoftUniJudgeCommonServices()
                .AddDistributedCaching(configuration)
                .AddLogging()
                .AddOptionsWithValidation<ApplicationConfig>()
                .AddOptionsWithValidation<ApplicationUrlsConfig>()
                .AddOptionsWithValidation<EmailServiceConfig>()
                .AddControllersWithViews();
        }
    }
}