namespace OJS.Servers.Infrastructure
{
    public static class ServerConstants
    {
        public static class Authentication
        {
            public const string SharedCookiesScheme = "Identity.OJS.Application";
            public const string SharedCookieName = ".AspNet.SharedOjsCookie";
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