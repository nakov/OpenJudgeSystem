namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.Extensions.Hosting;
using OJS.Common.Utils;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using static OJS.Common.GlobalConstants.EnvironmentVariables;

public static class HostBuilderExtensions
{
    private const string LoggerFilesPathTemplateVariableNotFoundExceptionMessageFormat =
        "Environment variable \"{0}\" for logger file path must be set.";

    public static IHostBuilder UseFileLogger<TStartup>(this IHostBuilder builder)
    {
        ValidateEnvironmentVariableExists(
            new List<string> { LoggerFilesFolderPath },
            EnvironmentUtils.GetByKey,
            LoggerFilesPathTemplateVariableNotFoundExceptionMessageFormat);

        return builder.UseSerilog((hostingContext, configuration)
            => configuration
                .ReadFrom
                .Configuration(hostingContext.Configuration)
                .Enrich
                .FromLogContext()
                .WriteTo
                .File(
                    Path.Combine(EnvironmentUtils.GetLoggerFilePath<TStartup>(), "log.txt"),
                    rollingInterval: RollingInterval.Day,
                    rollOnFileSizeLimit: true,
                    retainedFileCountLimit: null));
    }

    public static void ValidateEnvironmentVariableExists(
        IEnumerable<string> configurationValues,
        Func<string, string?> f,
        string exceptionMessageFormat)
    {
        var invalidConfigurationMessages = configurationValues
            .Where(cf => string.IsNullOrWhiteSpace(f(cf)))
            .Select(x => string.Format(exceptionMessageFormat, x))
            .ToList();

        if (invalidConfigurationMessages.Any())
        {
            throw new ArgumentException(string.Join("\n", invalidConfigurationMessages));
        }
    }
}