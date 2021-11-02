namespace OJS.Common.Utils
{
    using OJS.Common.Enumerations;
    using System;
    using System.Text.RegularExpressions;
    using static OJS.Common.GlobalConstants.EnvironmentVariables;
    using static OJS.Common.GlobalConstants.RegexPatterns;

    public static class EnvironmentUtils
    {
        public static string GetApplicationConnectionString(
            ApplicationName appName,
            bool appUsesMultipleDatabases = false)
            => IsProduction() || IsDocker()
                ? BuildAndGetConnectionString(appName, appUsesMultipleDatabases)
                : Environment.GetEnvironmentVariable(GetConnectionStringName(appName, appUsesMultipleDatabases));

        private static string GetConnectionStringName(ApplicationName appName, bool appUsesMultipleDatabases)
            => appUsesMultipleDatabases
                ? $"{appName}DbContext"
                : "DbContext";

        private static string BuildAndGetConnectionString(ApplicationName appName, bool appUsesMultipleDatabases)
        {
            var server = GetDatabaseServer(appName, appUsesMultipleDatabases);
            var database = GetDatabaseName(appName);
            var user = GetDatabaseUser(appName, appUsesMultipleDatabases);
            var password = GetDatabasePassword(appName, appUsesMultipleDatabases);
            return $"Server={server};Database={database};User Id={user}; Password={password};";
        }

        private static string GetDatabaseServer(ApplicationName appName, bool appUsesMultipleDatabases)
        {
            var key = appUsesMultipleDatabases
                ? $"{GetApplicationEnvironmentPrefix(appName)}_DB_SERVER"
                : "DB_SERVER";

            return Environment.GetEnvironmentVariable(key);
        }

        private static string GetDatabaseName(ApplicationName appName)
            => appName is ApplicationName.Ui or ApplicationName.Administration
                ? "OpenJudgeSystem"
                : $"OJS.Servers.{appName}";

        private static string GetDatabaseUser(ApplicationName appName, bool appUsesMultipleDatabases)
        {
            var key = appUsesMultipleDatabases
                ? $"{GetApplicationEnvironmentPrefix(appName)}_DB_USER"
                : "DB_USER";

            return Environment.GetEnvironmentVariable(key);
        }

        private static string GetDatabasePassword(ApplicationName appName, bool appUsesMultipleDatabases)
        {
            var key = appUsesMultipleDatabases
                ? $"{GetApplicationEnvironmentPrefix(appName)}_DB_PASSWORD"
                : "DB_PASSWORD";

            return Environment.GetEnvironmentVariable(key);
        }

        private static string GetApplicationEnvironmentPrefix(ApplicationName appName)
            => string.Join("_", Regex.Split(appName.ToString(), UpperCaseGroupsRegex)).ToUpper();

        private static bool IsProduction()
            => Environment.GetEnvironmentVariable(EnvironmentKey) == ProductionValue;

        private static bool IsDocker()
            => Environment.GetEnvironmentVariable(EnvironmentKey) == DockerValue;
    }
}