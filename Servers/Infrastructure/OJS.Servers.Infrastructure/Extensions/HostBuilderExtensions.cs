namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using OJS.Common.Extensions;
using OJS.Services.Common.Models.Configurations;
using Serilog;
using System.IO;

public static class HostBuilderExtensions
{
    public static IHostBuilder UseFileLogger<TStartup>(this IHostBuilder builder)
        => builder.UseSerilog((hostingContext, configuration) =>
        {
            var loggerFilePath = hostingContext.Configuration
                .GetSectionValueWithValidation<ApplicationConfig, string>(
                    nameof(ApplicationConfig.LoggerFilesFolderPath));

            var filePath = Path.Combine(loggerFilePath, typeof(TStartup).GetProjectName(), "log.txt");

            configuration
                .ReadFrom
                .Configuration(hostingContext.Configuration)
                .Enrich
                .FromLogContext()
                .WriteTo
                .Console()
                .WriteTo
                .File(
                    filePath,
                    rollingInterval: RollingInterval.Day,
                    rollOnFileSizeLimit: true,
                    retainedFileCountLimit: null);
        });
}