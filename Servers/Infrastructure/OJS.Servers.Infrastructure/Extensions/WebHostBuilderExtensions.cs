namespace OJS.Servers.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using OJS.Common.Enumerations;
    using OJS.Common.Utils;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;


    public static class WebHostBuilderExtensions
    {
        private const string UrlVariableNotFoundExceptionMessageFormat =
            "Environment variable for application url for \"{0}\" must be set";

        private const string ConnectionStringVariableNotFoundExceptionMessageFormat =
            "Environment variable for connection string for \"{0}\" must be set";

        private const string LoggerFilesPathTemplateVariableNotFoundExceptionMessageFormat =
            "Environment variable \"{0}\" for logger file path must be set.";

        private const string VariableForRegisteringGlobalCacheServiceNotFoundFormat =
            "Environment variable \"{0}\" for registering global cache service must be set.";

        // public static IWebHostBuilder UseFileLogger<TStartup>(this IWebHostBuilder builder)
        // {
        //     ValidateEnvironmentVariableExists(
        //         new List<string> { LoggerFilesFolderPath },
        //         EnvironmentUtils.GetByKey,
        //         LoggerFilesPathTemplateVariableNotFoundExceptionMessageFormat);
        //
        //     return builder.UseSerilog((hostingContext, configuration)
        //         => configuration
        //             .ReadFrom
        //             .Configuration(hostingContext.Configuration)
        //             .Enrich
        //             .FromLogContext()
        //             .WriteTo
        //             .File(
        //                 Path.Combine(EnvironmentUtils.GetLoggerFilePath<TStartup>(), "log.txt"),
        //                 rollingInterval: RollingInterval.Day,
        //                 rollOnFileSizeLimit: true,
        //                 retainedFileCountLimit: null));
        // }

        public static IWebHostBuilder ValidateConnectionStringsConfiguration(
            this IWebHostBuilder builder,
            params ApplicationName[] applicationNames)
        {
            ValidateConfigByApplicationName(
                applicationNames ?? new ApplicationName[0],
                ConnectionStringVariableNotFoundExceptionMessageFormat,
                appName => EnvironmentUtils.GetApplicationConnectionString(
                    appName,
                    appUsesMultipleDatabases: applicationNames?.Length > 1));
            return builder;
        }

        public static IWebHostBuilder ValidateApplicationUrlsConfiguration(
            this IWebHostBuilder builder,
            params ApplicationName[] applicationNames)
        {
            ValidateConfigByApplicationName(
                applicationNames ?? new ApplicationName[0],
                UrlVariableNotFoundExceptionMessageFormat,
                EnvironmentUtils.GetApplicationUrl);
            return builder;
        }

        public static IWebHostBuilder BuildWebHostConfiguration<TStartup>(
            this IWebHostBuilder builder,
            string[] args,
            ApplicationName[] connectionStrings = default,
            ApplicationName[] applicationUrls = default)
            where TStartup : class
            => builder
                .ValidateConnectionStringsConfiguration(connectionStrings)
                .ValidateApplicationUrlsConfiguration(applicationUrls)
                .UseHostingConfiguration()
                .UseStartup<TStartup>();

        public static IWebHostBuilder UseHostingConfiguration(
            this IWebHostBuilder builder)
            => builder.UseConfiguration(
                new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddEnvironmentJsonFiles("hosting")
                    .Build());

        // public static IWebHostBuilder ValidateGlobalCacheConfiguration(this IWebHostBuilder builder)
        // {
        //     var configurationValues = new List<string>()
        //     {
        //         RedisCacheConnectionString,
        //     };
        //
        //     ValidateEnvironmentVariableExists(
        //         configurationValues,
        //         EnvironmentUtils.GetByKey,
        //         VariableForRegisteringGlobalCacheServiceNotFoundFormat);
        //
        //     return builder;
        // }

        // public static IWebHostBuilder ValidateExternalLoginConfiguration(
        //     this IWebHostBuilder builder,
        //     ExternalApplication[] externalApplications)
        // {
        //     var applicationsInfo = externalApplications.Select(application => new
        //     {
        //         application, credentials = EnvironmentUtils.GetExternalApplicationCredentials(application),
        //     });
        //
        //     var failingApplicationsInfo = applicationsInfo.Where(info =>
        //             string.IsNullOrEmpty(info.credentials.Id) ||
        //             string.IsNullOrEmpty(info.credentials.Secret))
        //         .ToList();
        //
        //     if (failingApplicationsInfo.Any())
        //     {
        //         var message = string.Empty;
        //
        //         failingApplicationsInfo
        //             .ForEach(info =>
        //             {
        //                 if (string.IsNullOrEmpty(info.credentials.Id))
        //                 {
        //                     message += string.Format($"Missing ID for {info.application}\n");
        //                 }
        //
        //                 if (string.IsNullOrEmpty(info.credentials.Secret))
        //                 {
        //                     message += string.Format($"Missing SECRET for {info.application}\n");
        //                 }
        //             });
        //         throw new ArgumentException(message);
        //     }
        //
        //     return builder;
        // }

        // public static IWebHostBuilder ValidateMessageQueueConfiguration(this IWebHostBuilder builder)
        // {
        //     var mqStringVariables = new[]
        //     {
        //         MessageQueueHost, MessageQueueVirtualHost, MessageQueueUser, MessageQueuePassword,
        //     };
        //     var mqNumberVariables = new[]
        //     {
        //         MessageQueuePrefetchCount, MessageQueueRetryCount, MessageQueueRetryTimeout,
        //     };
        //
        //     var allConfigs = new List<KeyValuePair<string, bool>>();
        //
        //     mqStringVariables.ToDictionary(
        //             x => x,
        //             x => !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable(x)))
        //         .ForEach(allConfigs.Add);
        //
        //     mqNumberVariables.ToDictionary(
        //             x => x,
        //             x => !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable(x)) &&
        //                  ushort.TryParse(Environment.GetEnvironmentVariable(x), out var y))
        //         .ForEach(allConfigs.Add);
        //
        //     var invalidConfigurationMessages = allConfigs
        //         .Where(x => !x.Value)
        //         .Select(x => x.Key)
        //         .Select(x => string.Format($"Missing env variable: {x}"))
        //         .ToList();
        //
        //     if (invalidConfigurationMessages.Any())
        //     {
        //         throw new ArgumentException(string.Join(Environment.NewLine, invalidConfigurationMessages));
        //     }
        //
        //     return builder;
        // }

        public static void ValidateEnvironmentVariableExists(
            IEnumerable<string> configurationValues,
            Func<string, string> f,
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

        private static void ValidateConfigByApplicationName(
            ApplicationName[] applicationNames,
            string messageTemplate,
            Func<ApplicationName, string> f)
        {
            var failingApplicationNames = applicationNames
                .Where(appName =>
                    string.IsNullOrEmpty(f(appName)))
                .ToList();

            if (failingApplicationNames.Any())
            {
                var message = string.Empty;

                failingApplicationNames
                    .ForEach(applicationName =>
                        message += string.Format(messageTemplate, applicationName));
                throw new ArgumentException(message);
            }
        }
    }
}