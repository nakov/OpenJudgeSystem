namespace OJS.Servers.Ui.Extensions
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Infrastructure.Configurations;
    using static OJS.Common.GlobalConstants;
    using static OJS.Common.GlobalConstants.BackgroundJobs;
    using ApplicationConfig = OJS.Services.Ui.Models.ApplicationConfig;

    internal static class ServiceCollectionExtensions
    {
        private const string AppName = "Ui";
        private const string ApiDocsTitle = $"{ApplicationFullName} {AppName} Api";

        public static void ConfigureServices(
            this IServiceCollection services,
            IConfiguration configuration,
            string apiVersion)
            => services
                .AddWebServer<Program>(configuration)
                .AddHttpClients(configuration)
                .AddSwaggerDocs(apiVersion.ToApiName(), ApiDocsTitle, apiVersion)
                .AddHangfireServer(configuration, AppName, [UiQueueName])
                .ConfigureCorsPolicy(configuration)
                .AddMessageQueue<Program>(configuration)
                .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(configuration)
                .AddResiliencePipelines()
                .AddOpenAiClient(configuration)
                .AddMemoryCache()
                .AddDistributedCaching(configuration)
                .AddOptionsWithValidation<ApplicationConfig>()
                .AddOptionsWithValidation<ApplicationUrlsConfig>()
                .AddOptionsWithValidation<EmailServiceConfig>()
                .AddOptionsWithValidation<MentorConfig>()
                .AddControllers();
    }
}