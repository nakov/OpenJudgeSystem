namespace OJS.Servers.Infrastructure.Extensions;

using Elastic.Ingest.Elasticsearch;
using Elastic.Ingest.Elasticsearch.DataStreams;
using Elastic.Serilog.Sinks;
using Microsoft.Extensions.Hosting;
using OJS.Services.Infrastructure.Configurations;
using Serilog;
using System;
using System.Linq;

public static class HostBuilderExtensions
{
    public static IHostBuilder UseElasticsearchLogger(
        this IHostBuilder builder,
        IHostEnvironment environment)
        => builder.UseSerilog((hostingContext, configuration) =>
        {
            var elasticSearchNodes =
                hostingContext.Configuration
                    .GetSectionValueWithValidation<ApplicationConfig, string>(nameof(ApplicationConfig.ElasticsearchEndpoints))
                    .Split(',')
                    .Select(x => new Uri(x))
                    .ToArray();

            var dataSetName = environment.EnvironmentName.ToLower();

            // Data stream namespace is the application name without the "ojs.servers." prefix
            var dataStreamNamespace = environment.ApplicationName
                .Split(',')[0]
                .ToLower()
                .Replace("ojs.", string.Empty)
                .Replace("servers.", string.Empty);

            configuration
                .ReadFrom.Configuration(hostingContext.Configuration)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.Elasticsearch(elasticSearchNodes, opts =>
                {
                    opts.DataStream = new DataStreamName("logs", dataSetName, dataStreamNamespace);
                    opts.BootstrapMethod = BootstrapMethod.Failure;
                });
        });
}