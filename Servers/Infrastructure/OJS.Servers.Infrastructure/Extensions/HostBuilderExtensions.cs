namespace OJS.Servers.Infrastructure.Extensions;

using Microsoft.Extensions.Hosting;
using OJS.Common.Utils;
using Serilog;
using System.Collections.Generic;
using System.IO;
using static OJS.Common.GlobalConstants.EnvironmentVariables;

public static class HostBuilderExtensions
{
    public static IHostBuilder UseFileLogger<TStartup>(this IHostBuilder builder)
    {
        EnvironmentUtils.ValidateEnvironmentVariableExists(new List<string> { LoggerFilesFolderPath });

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
}