namespace OJS.Common
{
    public static class GlobalConstants
    {
        public static class Assemblies
        {
            // Models
            public const string ModelsRegexPattern = "^OJS\\..+Models,";

            // Services
            public const string BusinessServices = "OJS.Services.Business";
            public const string DataServices = "OJS.Services.Data";
            public const string InfrastructureServices = "OJS.Services.Infrastructure";
        }

        public static class RegexPatterns
        {
            public const string UpperCaseGroupsRegex = @"(?<!^)(?=[A-Z])";
        }

        public static class EnvironmentVariables
        {
            public const string EnvironmentKey = "ASPNETCORE_ENVIRONMENT";
            public const string DockerValue = "Docker";
            public const string ProductionValue = "Production";
        }
    }
}