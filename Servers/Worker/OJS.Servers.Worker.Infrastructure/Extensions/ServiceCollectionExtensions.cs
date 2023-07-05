namespace OJS.Servers.Worker.Infrastructure.Extensions;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Common.Utils;
using OJS.Servers.Infrastructure.Extensions;
using SoftUni.Judge.Common.Extensions;
using OJS.Services.Worker.Models.Configuration;
using OJS.Workers.Common;
using OJS.Workers.SubmissionProcessors;

public static class ServiceCollectionExtensions
{
    private const string SubmissionsProcessorIdentifierNumberEnvVariableName =
        "SUBMISSIONS_PROCESSOR_IDENTIFIER_NUMBER";

    public static WebApplication ConfigureWebApplication(
        this WebApplication app,
        string apiVersion)
    {
        app
            .UseDefaults()
            .MapDefaultRoutes();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwaggerDocs(apiVersion.ToApiName());
        }

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                "default",
                "{controller=Home}/{action=Index}");
        });

        return app;
    }

    public static void ConfigureServices<TProgram>(
        this IServiceCollection services,
        IConfiguration configuration,
        string apiVersion)
        => services
            .AddWebServer<TProgram>()
            .AddMemoryCache()
            .AddSoftUniJudgeCommonServices()
            .AddLogging()
            .AddSubmissionExecutor();
            // .AddHealthMonitoring();
            // .ConfigureSettings(configuration);

    public static IServiceCollection AddSubmissionExecutor(
        this IServiceCollection services)
        => services
            .AddTransient<ISubmissionExecutor>(sp => new SubmissionExecutor(
                EnvironmentUtils.GetByKey(SubmissionsProcessorIdentifierNumberEnvVariableName) !));

    public static IServiceCollection AddConfiguration(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .Configure<SubmissionExecutionConfig>(configuration.GetSection(nameof(SubmissionExecutionConfig)));
}