namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.Extensions.Hosting;
using OJS.Services.Infrastructure.Configurations;
using OJS.Workers.Common.Extensions;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.OpenTelemetry;
using System.Collections.Generic;
using System.IO;

public static class HostBuilderExtensions
{
    public static IHostBuilder UseLogger(
        this IHostBuilder builder,
        IHostEnvironment environment)
        => builder.UseSerilog((hostingContext, configuration) =>
        {
            var applicationName = environment.GetShortApplicationName();
            var appSettings = hostingContext.Configuration.GetSectionWithValidation<ApplicationConfig>();
            var projectLogsDirectoryPath = Path.Combine(appSettings.LoggerFilesFolderPath, applicationName);
            var errorLogFilePath = Path.Combine(projectLogsDirectoryPath, "error.log");

            configuration
                .ReadFrom.Configuration(hostingContext.Configuration)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.File(
                    errorLogFilePath,
                    rollingInterval: RollingInterval.Day,
                    rollOnFileSizeLimit: true,
                    restrictedToMinimumLevel: LogEventLevel.Error)
                .WriteTo.OpenTelemetry(options =>
                {
                    options.Endpoint = $"{appSettings.LokiBaseUrl.TrimFromEnd("/")}/otlp";
                    options.Protocol = OtlpProtocol.HttpProtobuf;
                    options.ResourceAttributes = new Dictionary<string, object>
                    {
                        ["service.name"] = applicationName.ToLower(),
                        ["service.namespace"] = environment.EnvironmentName.ToLower(),
                    };
                });
        });
}