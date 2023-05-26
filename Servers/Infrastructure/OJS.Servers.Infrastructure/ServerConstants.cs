namespace OJS.Servers.Infrastructure
{
    public static class ServerConstants
    {
        public static class Authentication
        {
            public const string CanAccessAdministrationCookieName = "can_access_administration";
            public const string LoggedInUsername = "logged_in_username";
        }

        public static class ViewDataKeys
        {
            public const string ReturnUrl = "ReturnUrl";
        }

        public static class ExceptionHandling
        {
            public const string BadHttpRequestExceptionTitle = "Bad Request!";
            public const string ValidationExceptionTitle = "Invalid Request!";
            public const string UnhandledExceptionTitle = "An unexpected error occurred!";
            public const string ExceptionDetailsForUnauthorized = "Please use the Instance code if reporting an issue.";
        }
    }
}