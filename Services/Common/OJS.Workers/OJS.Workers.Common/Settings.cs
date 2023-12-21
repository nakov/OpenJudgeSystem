namespace OJS.Workers.Common
{
    using System.Collections.Generic;
    using System.Linq;
    using OJS.Workers.Common.Helpers;
    using OJS.Workers.Common.Models;

    public static class Settings
    {
        public static string DotNetCompilerPath => SettingsHelper.GetSetting("DotNetCompilerPath");

        public static string MavenPath => SettingsHelper.GetSetting("MavenPath");

        public static string CPlusPlusGccCompilerPath => SettingsHelper.GetSetting("CPlusPlusGccCompilerPath");

        public static string NUnitConsoleRunnerPath => SettingsHelper.GetSetting("NUnitConsoleRunnerPath");

        public static string NuGetExecutablePath => SettingsHelper.GetSetting("NuGetExecutablePath");

        public static string GolangCompilerPath => SettingsHelper.GetSetting("GolangCompilerPath");

        public static string JavaCompilerPath => SettingsHelper.GetSetting("JavaCompilerPath");

        public static string JavaExecutablePath => SettingsHelper.GetSetting("JavaExecutablePath");

        public static string JavaLibsPath => SettingsHelper.GetSetting("JavaLibsPath");

        public static string RubyPath => SettingsHelper.GetSetting("RubyPath");

        public static string NodeJsExecutablePath => SettingsHelper.GetSetting("NodeJsExecutablePath");

        public static string JsProjNodeModules => SettingsHelper.GetSetting("JSProjNodeModules");

        public static int JsProjDefaultApplicationPortNumber => SettingsHelper.GetSettingOrDefault("JsProjDefaultApplicationPortNumber", 9636, true);

        public static string MochaModulePath => SettingsHelper.GetSetting("MochaModulePath");

        public static string ChaiModulePath => SettingsHelper.GetSetting("ChaiModulePath");

        public static string PlaywrightModulePath => SettingsHelper.GetSetting("PlaywrightModulePath");

        public static string PlaywrightChromiumModulePath => SettingsHelper.GetSetting("PlaywrightChromiumModulePath");

        public static string JsDomModulePath => SettingsHelper.GetSetting("JsDomModulePath");

        public static string JQueryModulePath => SettingsHelper.GetSetting("JQueryModulePath");

        public static string HandlebarsModulePath => SettingsHelper.GetSetting("HandlebarsModulePath");

        public static string SinonModulePath => SettingsHelper.GetSetting("SinonModulePath");

        public static string SinonJsDomModulePath => SettingsHelper.GetSetting("SinonJsDomModulePath");

        public static string SinonChaiModulePath => SettingsHelper.GetSetting("SinonChaiModulePath");

        public static string UnderscoreModulePath => SettingsHelper.GetSetting("UnderscoreModulePath");

        public static string BrowserifyModulePath => SettingsHelper.GetSetting("BrowserifyModulePath");

        public static string BabelifyModulePath => SettingsHelper.GetSetting("BabelifyModulePath");

        public static string Es2015ImportPluginPath => SettingsHelper.GetSetting("ES2015ImportPluginPath");

        public static string BabelCoreModulePath => SettingsHelper.GetSetting("BabelCoreModulePath");

        public static string ReactJsxPluginPath => SettingsHelper.GetSetting("ReactJsxPluginPath");

        public static string ReactModulePath => SettingsHelper.GetSetting("ReactModulePath");

        public static string ReactDomModulePath => SettingsHelper.GetSetting("ReactDOMModulePath");

        public static string NodeFetchModulePath => SettingsHelper.GetSetting("NodeFetchModulePath");

        public static string BootstrapModulePath => SettingsHelper.GetSetting("BootstrapModulePath");

        public static string BootstrapCssPath => SettingsHelper.GetSetting("BootstrapCssPath");

        public static string PythonExecutablePath => SettingsHelper.GetSetting("PythonExecutablePath");

        public static string SqlServerLocalDbMasterDbConnectionString =>
            SettingsHelper.GetSetting("SqlServerLocalDbMasterDbConnectionString");

        public static string SqlServerLocalDbRestrictedUserId =>
            SettingsHelper.GetSetting("SqlServerLocalDbRestrictedUserId");

        public static string SqlServerLocalDbRestrictedUserPassword =>
            SettingsHelper.GetSetting("SqlServerLocalDbRestrictedUserPassword");

        public static string MySqlSysDbConnectionString => SettingsHelper.GetSetting("MySqlSysDbConnectionString");

        public static string MySqlRestrictedUserId => SettingsHelper.GetSetting("MySqlRestrictedUserId");

        public static string MySqlRestrictedUserPassword => SettingsHelper.GetSetting("MySqlRestrictedUserPassword");

        public static string PythonExecutablePathV311 => SettingsHelper.GetSetting("PythonExecutablePathV311");

        public static string PipExecutablePathV311 => SettingsHelper.GetSetting("PipExecutablePathV311");

        public static int ThreadsCount => SettingsHelper.GetSettingOrDefault("ThreadsCount", 2);

        // Base time and memory used
        public static int NodeJsBaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("NodeJsBaseTimeUsedInMilliseconds", 0);

        public static int NodeJsBaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("NodeJsBaseMemoryUsedInBytes", 0);

        public static int MsBuildBaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("MsBuildBaseTimeUsedInMilliseconds", 0);

        public static int MsBuildBaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("MsBuildBaseMemoryUsedInBytes", 0);

        public static int DotNetCscBaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("DotNetCscBaseTimeUsedInMilliseconds", 0);

        public static int DotNetCscBaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("DotNetCscBaseMemoryUsedInBytes", 0);

        public static int DotNetCliBaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("DotNetCliBaseTimeUsedInMilliseconds", 0);

        public static int DotNetCliBaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("DotNetCliBaseMemoryUsedInBytes", 0);

        public static int GolangBaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("GolangBaseTimeUsedInMilliseconds", 0);

        public static int GolangBaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("GolangBaseMemoryUsedInBytes", 0);

        public static int JavaBaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("JavaBaseTimeUsedInMilliseconds", 0);

        public static int JavaBaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("JavaBaseMemoryUsedInBytes", 0);

        public static int JavaBaseUpdateTimeOffsetInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("JavaBaseUpdateTimeOffsetInMilliseconds", 0);

        public static int GPlusPlusBaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("GPlusPlusBaseTimeUsedInMilliseconds", 0);

        public static int GPlusPlusBaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("GPlusPlusBaseMemoryUsedInBytes", 0);

        public static int PythonBaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("PythonBaseTimeUsedInMilliseconds", 0);

        public static int PythonBaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("PythonBaseMemoryUsedInBytes", 0);

        public static int PythonV311BaseTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("PythonV311BaseTimeUsedInMilliseconds", 0);

        public static int PythonV311InstallPackagesTimeUsedInMilliseconds =>
            SettingsHelper.GetSettingOrDefault("PythonV311InstallPackagesTimeUsedInMilliseconds", 0);

        public static int PythonV311BaseMemoryUsedInBytes =>
            SettingsHelper.GetSettingOrDefault("PythonV311BaseMemoryUsedInBytes", 0);

        // Compiler time out multipliers
        public static int CPlusPlusCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("CPlusPlusCompilerProcessExitTimeOutMultiplier", 1);

        public static int CPlusPlusZipCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("CPlusPlusZipCompilerProcessExitTimeOutMultiplier", 1);

        public static int CSharpCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("CSharpCompilerProcessExitTimeOutMultiplier", 1);

        public static int CSharpDotNetCoreCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("CSharpDotNetCoreCompilerProcessExitTimeOutMultiplier", 1);

        public static int DotNetCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("DotNetCompilerProcessExitTimeOutMultiplier", 1);

        public static int GolangCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("GolangCompilerProcessExitTimeOutMultiplier", 1);

        public static int JavaCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("JavaCompilerProcessExitTimeOutMultiplier", 1);

        public static int JavaInPlaceCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("JavaInPlaceCompilerProcessExitTimeOutMultiplier", 1);

        public static int JavaZipCompilerProcessExitTimeOutMultiplier =>
            SettingsHelper.GetSettingOrDefault("JavaZipCompilerProcessExitTimeOutMultiplier", 1);

        public static int HttpClientTimeoutForRemoteWorkersInSeconds =>
            SettingsHelper.GetSettingOrDefault("HttpClientTimeoutForRemoteWorkersInSeconds", 120);

        public static IEnumerable<string> RemoteWorkerEndpoints => SettingsHelper.GetSetting("RemoteWorkerEndpoints")
            .Split(';')
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x.Trim());

        public static string PostgreSqlMasterDbConnectionString =>
            SettingsHelper.GetSetting("PostgreSqlMasterDbConnectionString");

        public static string PostgreSqlRestrictedUserId =>
            SettingsHelper.GetSetting("PostgreSqlRestrictedUserId");

        public static string PostgreSqlRestrictedUserPassword =>
            SettingsHelper.GetSetting("PostgreSqlRestrictedUserPassword");

        public static string DotNetCoreRuntimeVersion(ExecutionStrategyType type)
            => type == ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck
                ? SettingsHelper.GetSetting("DotNetCore3RuntimeVersion")
                : type == ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck
                    ? SettingsHelper.GetSetting("DotNetCore5RuntimeVersion")
                    : SettingsHelper.GetSetting("DotNetCore6RuntimeVersion");

        public static string DotNetCoreSharedAssembliesPath(ExecutionStrategyType type)
            => type == ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck
                ? SettingsHelper.GetSetting("DotNetCore3SharedAssembliesPath")
                : type == ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck
                    ? SettingsHelper.GetSetting("DotNetCore5SharedAssembliesPath")
                    : SettingsHelper.GetSetting("DotNetCore6SharedAssembliesPath");

        public static string CSharpDotNetCoreCompilerPath(ExecutionStrategyType type)
            => type == ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck
                ? SettingsHelper.GetSetting("CSharpDotNet3CoreCompilerPath")
                : type == ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck
                    ? SettingsHelper.GetSetting("CSharpDotNetCore5CompilerPath")
                    : SettingsHelper.GetSetting("CSharpDotNetCore6CompilerPath");

        public static string DotNetCoreTargetFrameworkName(ExecutionStrategyType type)
            => type == ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy
                ? "netcoreapp3.1"
                : type == ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy
                    ? "net5.0"
                    : "net6.0";

        public static string MicrosoftEntityFrameworkCoreInMemoryVersion(ExecutionStrategyType type)
            => type == ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy
                ? "3.1.4"
                : type == ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy
                    ? "5.0.13"
                    : "6.0.1";

        public static string MicrosoftEntityFrameworkCoreProxiesVersion(ExecutionStrategyType type)
            => type == ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy
                ? "3.1.4"
                : type == ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy
                    ? "5.0.13"
                    : "6.0.1";
    }
}