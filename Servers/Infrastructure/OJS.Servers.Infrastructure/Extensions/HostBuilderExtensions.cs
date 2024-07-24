namespace OJS.Servers.Infrastructure.Extensions;

using Elastic.Ingest.Elasticsearch;
using Elastic.Ingest.Elasticsearch.DataStreams;
using Elastic.Serilog.Sinks;
using Microsoft.Extensions.Hosting;
using OJS.Services.Infrastructure.Configurations;
using Serilog;
using Serilog.Events;
using System;
using System.IO;
using System.Linq;

public static class HostBuilderExtensions
{
    public static IHostBuilder UseLogger(
        this IHostBuilder builder,
        IHostEnvironment environment)
        => builder.UseSerilog((hostingContext, configuration) =>
        {
            var applicationName = environment.GetShortApplicationName();
            var loggerFilePath = hostingContext.Configuration
                .GetSectionValueWithValidation<ApplicationConfig, string>(nameof(ApplicationConfig.LoggerFilesFolderPath));
            var projectLogsDirectoryPath = Path.Combine(loggerFilePath, applicationName);
            var errorLogFilePath = Path.Combine(projectLogsDirectoryPath, "error.log");

            var elasticSearchNodes =
                hostingContext.Configuration
                    .GetSectionValueWithValidation<ApplicationConfig, string>(nameof(ApplicationConfig.ElasticsearchEndpoints))
                    .Split(',')
                    .Select(x => new Uri(x))
                    .ToArray();

            configuration
                .ReadFrom.Configuration(hostingContext.Configuration)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.File(
                    errorLogFilePath,
                    rollingInterval: RollingInterval.Day,
                    rollOnFileSizeLimit: true,
                    restrictedToMinimumLevel: LogEventLevel.Error)
                .WriteTo.Elasticsearch(elasticSearchNodes, opts =>
                {
                    opts.DataStream = new DataStreamName(
                        type: "logs",
                        dataSet: environment.EnvironmentName.ToLower(),
                        @namespace: applicationName.ToLower());
                    // Silent mode is used to avoid exceptions when the elasticsearch is not available.
                    opts.BootstrapMethod = BootstrapMethod.Silent;
                });
        });
}