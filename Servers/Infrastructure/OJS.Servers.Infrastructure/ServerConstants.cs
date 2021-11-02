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
    }
}