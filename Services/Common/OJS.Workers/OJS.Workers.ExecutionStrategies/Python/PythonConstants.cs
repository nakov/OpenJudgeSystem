namespace OJS.Workers.ExecutionStrategies.Python
{
    internal static class PythonConstants
    {
        // arguments
        public const string IsolatedModeArgument = "-I"; // https://docs.python.org/3/using/cmdline.html#cmdoption-I
        public const string OptimizeAndDiscardDocstringsArgument = "-OO"; // https://docs.python.org/3/using/cmdline.html#cmdoption-OO
        public const string IgnorePythonEnvVarsArgument = "-E"; // -E and -s are part of -I (isolated mode)
        public const string DontAddUserSiteDirectoryArgument = "-s";
        public const string ModuleNameArgument = "-m";

        // commands
        public const string DiscoverTestsCommandName = "discover";

        // modules
        public const string UnitTestModuleName = "unittest";
    }
}