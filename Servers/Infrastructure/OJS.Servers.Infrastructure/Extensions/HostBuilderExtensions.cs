namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.Extensions.Hosting;
using OJS.Common.Extensions;
using OJS.Services.Common.Models.Configurations;
using Serilog;
using Serilog.Events;
using System;
using System.IO;

public static class HostBuilderExtensions
{
    public static IHostBuilder UseFileLogger<TStartup>(this IHostBuilder builder)
        => builder.UseSerilog((hostingContext, configuration) =>
        {
            var loggerFilePath = hostingContext.Configuration
                .GetSectionValueWithValidation<ApplicationConfig, string>(
                    nameof(ApplicationConfig.LoggerFilesFolderPath));

            var projectLogsDirectoryPath = Path.Combine(loggerFilePath, typeof(TStartup).GetProjectName());
            var filePath = Path.Combine(projectLogsDirectoryPath, "log.txt");
            var errorFilePath = Path.Combine(projectLogsDirectoryPath, "error.txt");
            Func<LogEvent, bool> errorsFilter = e => e.Level is LogEventLevel.Error or LogEventLevel.Fatal;

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
                    retainedFileCountLimit: null)
                .WriteTo
                .Logger(l => l.Filter.ByIncludingOnly(errorsFilter)
                    .WriteTo
                    .File(
                        errorFilePath,
                        rollingInterval: RollingInterval.Day,
                        rollOnFileSizeLimit: true,
                        retainedFileCountLimit: null));
        });
}