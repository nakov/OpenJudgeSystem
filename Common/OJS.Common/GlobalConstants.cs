namespace OJS.Common
{
    public static class GlobalConstants
    {
        public const string ApplicationFullName = "OpenJudgeSystem";

        public static class Assemblies
        {
            // Models
            public const string ModelsRegexPattern = "^OJS\\..+Models,";

            // Services
            public const string BusinessServices = "OJS.Services.{0}.Business";
            public const string DataServices = "OJS.Services.{0}.Data";
            public const string CommonBusinessServices = "OJS.Services.Common.Business";
            public const string CommonDataServices = "OJS.Services.Common.Data";
            public const string InfrastructureServices = "OJS.Services.Infrastructure";
        }

        public static class RegexPatterns
        {
            public const string UpperCaseGroupsRegex = @"(?<!^)(?=[A-Z])";
        }

        public static class EnvironmentVariables
        {
            // Keys
            public const string EnvironmentKey = "ASPNETCORE_ENVIRONMENT";
            public const string PathToCommonKeyRingFolderKey = "PATH_TO_COMMON_KEY_RING_FOLDER";

            // Values
            public const string DockerValue = "Docker";
            public const string ProductionValue = "Production";
        }

        public static class Roles
        {
            public const string Administrator = "Administrator";
            public const string Lecturer = "Lecturer";

            public const string AdministratorOrLecturer = Administrator + ", " + Lecturer;
        }
    }
}