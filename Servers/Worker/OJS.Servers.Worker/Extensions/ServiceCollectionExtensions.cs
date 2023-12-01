namespace OJS.Servers.Worker.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Data;
using OJS.Servers.Infrastructure.Extensions;
using OJS.Services.Worker.Models.Configuration;
using OJS.Workers.Common;
using OJS.Workers.SubmissionProcessors;
using ApplicationConfig = OJS.Services.Worker.Models.Configuration.ApplicationConfig;

internal static class ServiceCollectionExtensions
{
    public static void ConfigureServices(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .AddWebServer<Program>(configuration)
            .AddHttpContextServices()
            .AddScoped<DbContext, OjsDbContext>()
            .AddSubmissionExecutor(configuration)
            .AddMemoryCache()
            .AddMessageQueue<Program>(configuration)
            .AddLogging()
            .AddSoftUniJudgeCommonServices()
            .AddOptionsWithValidation<ApplicationConfig>()
            .AddOptionsWithValidation<SubmissionExecutionConfig>()
            .AddControllers();

    private static IServiceCollection AddSubmissionExecutor(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .AddTransient<ISubmissionExecutor>(_ => new SubmissionExecutor(
                configuration.GetSectionWithValidation<ApplicationConfig>()
                    .SubmissionsProcessorIdentifierNumber.ToString()));
}
