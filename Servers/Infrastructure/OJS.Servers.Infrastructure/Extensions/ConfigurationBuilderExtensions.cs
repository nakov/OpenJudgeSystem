namespace OJS.Servers.Infrastructure.Extensions
{
    using Microsoft.Extensions.Configuration;
    using System;
    using OJS.Common;
    using static OJS.Common.GlobalConstants;

    public static class ConfigurationBuilderExtensions
    {
        public static IConfigurationBuilder AddEnvironmentJsonFiles(this IConfigurationBuilder builder, string fileName)
        {
            var env = Environment.GetEnvironmentVariable(GlobalConstants.EnvironmentVariables.EnvironmentKey);

            builder
                .AddJsonFile($"{fileName}{GlobalConstants.FileExtensions.Json}", optional: true, reloadOnChange: true)
                .AddJsonFile($"{fileName}.{env}{GlobalConstants.FileExtensions.Json}", optional: true, reloadOnChange: true);

            return builder;
        }
    }
}
