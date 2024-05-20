namespace OJS.Servers.Worker.Extensions;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Worker.Business.Implementations;
using OJS.Services.Worker.Models.Configuration;
using OJS.Workers.Compilers;
using OJS.Workers.ExecutionStrategies;
using ApplicationConfig = OJS.Services.Worker.Models.Configuration.ApplicationConfig;

internal static class ServiceCollectionExtensions
{
    public static void ConfigureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services
            .AddWebServer<Program>(configuration)
            .AddHttpContextServices()
            .AddSingleton<ICompilerFactory, CompilerFactory>()
            .AddSingleton<IExecutionStrategySettingsProvider, ExecutionStrategySettingsProvider>()
            .AddMemoryCache();

        if (configuration.GetSectionValueWithValidation<ApplicationConfig, bool>(nameof(ApplicationConfig.UseMessageQueue)))
        {
            services.AddMessageQueue<Program>(configuration);
        }

        services.AddHealthChecks();

        services
            .AddLogging()
            .AddOptionsWithValidation<ApplicationConfig>()
            .AddOptionsWithValidation<SubmissionExecutionConfig>()
            .AddOptionsWithValidation<OjsWorkersConfig>()
            .AddControllers();
    }
}
