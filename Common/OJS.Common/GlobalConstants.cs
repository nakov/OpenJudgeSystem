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
            public const string CommonServices = "OJS.Services.Common";
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
            public const string SulsPlatformBaseUrlKey = "SULS_PLATFORM_BASE_URL";

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

        public static class Urls
        {
            public const string HangfirePath = "/hangfire";
        }

        public static class MimeTypes
        {
            public const string ApplicationJson = "application/json";
            public const string ApplicationPdf = "application/pdf";
            public const string Csv = "text/csv";
            public const string Tsv = "text/tsv";
            public const string CsvExcelSheet = "application/vnd.ms-excel";
            public const string ExcelSheet = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            public const string TextHtml = "text/html";
            public const string Plain = "text/plain";
        }

        public static class ErrorMessages
        {
            public const string GenericErrorMessage = "Something went wrong, please try again";
            public const string ModelCannotBeNull = "Model cannot be null";
            public const string FormCannotBeNull = "Form cannot be null";
            public const string UrlCannotBeNull = "URL cannot be null";
            public const string EntityDoesNotExistMessage = "Entity does not exist.";

            public const string EntityWithIdDoesNotExistTemplate = "{0} with Id \"{1}\" does not exist.";
            public const string CannotBeTemplate = "{0} cannot be {1}";
            public const string ValueCannotBeLessThanOrEqualToZero = "Value cannot be less than or equal to 0";
            public const string ValueCannotBeNullOrWhiteSpaceTemplate = "{0} cannot be null or white space";
        }
    }
}