namespace OJS.Servers.Worker.Infrastructure.Extensions;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Common.Utils;
using OJS.Servers.Infrastructure.Extensions;
using SoftUni.Judge.Common.Extensions;

public static class ServiceCollectionExtensions
{
    private const string SubmissionsProcessorIdentifierNumberEnvVariableName =
        "SUBMISSIONS_PROCESSOR_IDENTIFIER_NUMBER";

    public static void ConfigureServices<TProgram>(
        this IServiceCollection services,
        IConfiguration configuration,
        string apiVersion)
        => services
            .AddWebServer<TProgram>()
            .AddMemoryCache()
            .AddSoftUniJudgeCommonServices()
            .AddLogging()
            .ConfigureSettings(configuration);

    public static IServiceCollection AddSubmissionExecutor(
        this IServiceCollection services)
        => services
            .AddTransient<ISubmissionExecutor>(sp => new SubmissionExecutor(
                EnvironmentUtils.GetByKey(SubmissionsProcessorIdentifierNumberEnvVariableName)));

    public static IServiceCollection AddConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .Configure<SubmissionExecutionConfig>(configuration.GetSection(nameof(SubmissionExecutionConfig)));
}

