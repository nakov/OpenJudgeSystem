namespace OJS.Servers.Worker.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Data;
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
        => services
            .AddWebServer<Program>(configuration)
            .AddHttpContextServices()
            .AddSingleton<ICompilerFactory, CompilerFactory>()
            .AddSingleton<IExecutionStrategySettingsProvider, ExecutionStrategySettingsProvider>()
            .AddMemoryCache()
            .AddMessageQueue<Program>(configuration)
            .AddLogging()
            .AddOptionsWithValidation<ApplicationConfig>()
            .AddOptionsWithValidation<SubmissionExecutionConfig>()
            .AddOptionsWithValidation<OjsWorkersConfig>()
            .AddControllers();
}
