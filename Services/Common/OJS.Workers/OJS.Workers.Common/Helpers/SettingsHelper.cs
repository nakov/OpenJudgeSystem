#nullable disable
namespace OJS.Workers.Common.Helpers
{
    using System;

    using Microsoft.Extensions.Configuration;

    using static OJS.Workers.Common.Constants;

    public static class SettingsHelper
    {
        private static readonly IConfiguration Configuration;

        static SettingsHelper() => Configuration = BuildConfiguration();

        public static string GetSetting(string settingName)
            => GetSection(settingName)?.Value
                ?? throw new Exception($"{settingName} setting not found in Config file!");

        public static T GetSettingOrDefault<T>(
            string settingName,
            T defaultValue,
            bool? searchInEnvironmentVariablesFirst = false)
        {
            string value = null;

            if (searchInEnvironmentVariablesFirst.HasValue && searchInEnvironmentVariablesFirst.Value)
            {
                value = Environment.GetEnvironmentVariable(settingName);
            }

            if (string.IsNullOrEmpty(value))
            {
                var section = GetSection(settingName);

                value = section?.Value;
            }

            return GetValueOrDefault(value, defaultValue);
        }

        private static IConfigurationSection GetSection(string settingName)
        {
            var section = Configuration.GetSection($"OjsWorkersConfig:{settingName}");

            if (LegacyConfigurationProvider.HasSettings())
            {
                section = Configuration.GetSection($"{settingName}");
            }

            return section;
        }

        private static IConfiguration BuildConfiguration()
        {
            var env = Environment.GetEnvironmentVariable(AspNetCoreEnvironmentVariable);

            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile($"appsettings{JsonFileExtension}", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env}{JsonFileExtension}", optional: true, reloadOnChange: true)
                .Add(new LegacyConfigurationProvider())
                .Build();
        }

        private static T GetValueOrDefault<T>(string value, T defaultValue)
            => string.IsNullOrEmpty(value)
                ? defaultValue
                : (T)Convert.ChangeType(value, typeof(T));
    }
}
