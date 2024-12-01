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
    using static System.Text.Json.Serialization.JsonIgnoreCondition;
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
                .AddSwaggerDocs(apiVersion.ToApiName(), ApiDocsTitle, apiVersion)
                .AddHangfireServer(configuration, AppName, new[] { UiQueueName })
                .ConfigureCorsPolicy(configuration)
                .AddMessageQueue<Program>(configuration)
                .AddIdentityDatabase<OjsDbContext, UserProfile, Role, UserInRole>(configuration)
                .AddResiliencePipelines()
                .AddMemoryCache()
                .AddDistributedCaching(configuration)
                .AddOptionsWithValidation<ApplicationConfig>()
                .AddOptionsWithValidation<ApplicationUrlsConfig>()
                .AddOptionsWithValidation<EmailServiceConfig>()
                .AddControllers()
                .AddJsonOptions(opt => opt.JsonSerializerOptions.DefaultIgnoreCondition = WhenWritingNull);
    }
}