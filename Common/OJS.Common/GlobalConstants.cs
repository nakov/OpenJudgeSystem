namespace OJS.Common
{
    public static class GlobalConstants
    {
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