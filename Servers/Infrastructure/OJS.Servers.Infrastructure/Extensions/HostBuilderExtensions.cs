namespace OJS.Servers.Infrastructure.Extensions;

using Elastic.Ingest.Elasticsearch;
using Elastic.Ingest.Elasticsearch.DataStreams;
using Elastic.Serilog.Sinks;
using Microsoft.Extensions.Hosting;
using OJS.Services.Infrastructure.Configurations;
using Serilog;
using Serilog.Events;
using System.IO;

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

            var elasticsearchSettings = hostingContext.Configuration
                .GetSectionWithValidation<ElasticsearchConfig>();

            configuration
                .ReadFrom.Configuration(hostingContext.Configuration)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.File(
                    errorLogFilePath,
                    rollingInterval: RollingInterval.Day,
                    rollOnFileSizeLimit: true,
                    restrictedToMinimumLevel: LogEventLevel.Error)
                .WriteTo.Elasticsearch(
                    elasticsearchSettings.GetEndpoints(),
                    opts =>
                    {
                        opts.DataStream = new DataStreamName(
                            type: "logs",
                            dataSet: environment.EnvironmentName.ToLower(),
                            @namespace: applicationName.ToLower());
                        // Silent mode is used to avoid exceptions when the elasticsearch is not available.
                        opts.BootstrapMethod = BootstrapMethod.Silent;
                    },
                    transport =>
                    {
                        transport
                            .ServerCertificateValidationCallback(ElasticsearchHelper.GetServerCertificateValidationCallback())
                            .Authentication(ElasticsearchHelper.GetElasticsearchAuthentication(elasticsearchSettings));
                    });
        });
}