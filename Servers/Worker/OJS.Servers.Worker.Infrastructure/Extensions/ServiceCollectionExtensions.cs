namespace OJS.Servers.Worker.Infrastructure.Extensions;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OJS.Common.Utils;
using OJS.Servers.Infrastructure.Extensions;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using OJS.Services.Worker.Models.Configuration;
using SoftUni.Services.Infrastructure.Extensions;
using OJS.Workers.Common;
using OJS.Workers.SubmissionProcessors;
using OJS.Servers.Infrastructure.Middleware;

public static class ServiceCollectionExtensions
{
    private const string SubmissionsProcessorIdentifierNumberEnvVariableName =
        "SUBMISSIONS_PROCESSOR_IDENTIFIER_NUMBER";

    public static void ConfigureServices<TProgram>(
        this IServiceCollection services,
        IConfiguration configuration)
        => services
            .AddWebServer<TProgram>()
            .AddSubmissionExecutor()
            .AddMemoryCache()
            .AddLogging()
            .AddConfiguration(configuration)
            .AddControllers();

    public static WebApplication ConfigureWebApplication(
        this WebApplication app,
        string apiVersion)
    {
        // if (app.Environment.IsDevelopment())
        // {
        //     app.UseSwaggerDocs(apiVersion.ToApiName());
        // }
        app.UseCustomExceptionHandling();
        app.UseAutoMapper();
        app.MapControllers();

        return app;
    }

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

    private static WebApplication UseCustomExceptionHandling(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler(errorApp => errorApp.Run(new DevelopmentExceptionMiddleware().Get));
        }
        else
        {
            app.UseExceptionHandler(errorApp => errorApp.Run(new Rfc7807ExceptionMiddleware().Get));
        }

        return app;
    }

    private static IServiceCollection AddWebServerServices<TStartUp>(this IServiceCollection services)
    {
        services
            .AddConventionServices<TStartUp>();

        return services;
    }
}