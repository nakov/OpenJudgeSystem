namespace OJS.Services.Worker.Business.Implementations;

using Microsoft.Extensions.Options;
using OJS.Services.Worker.Models.Configuration;
using OJS.Workers.Common.Models;
using OJS.Workers.ExecutionStrategies;
using OJS.Workers.ExecutionStrategies.CPlusPlus;
using OJS.Workers.ExecutionStrategies.CSharp.DotNetCore;
using OJS.Workers.ExecutionStrategies.Golang;
using OJS.Workers.ExecutionStrategies.Java;
using OJS.Workers.ExecutionStrategies.NodeJs;
using OJS.Workers.ExecutionStrategies.Python;
using OJS.Workers.ExecutionStrategies.Sql.MySql;
using OJS.Workers.ExecutionStrategies.Sql.PostgreSql;
using OJS.Workers.ExecutionStrategies.Sql.SqlServerSingleDatabase;
using System;

public class ExecutionStrategySettingsProvider : IExecutionStrategySettingsProvider
{
    private readonly OjsWorkersConfig settings;
    private readonly string submissionProcessorIdentifier;

    public ExecutionStrategySettingsProvider(
        IOptions<OjsWorkersConfig> ojsWorkersConfigAccessor,
        IOptions<ApplicationConfig> appConfigAccessor)
    {
        this.settings = ojsWorkersConfigAccessor.Value;
        this.submissionProcessorIdentifier = appConfigAccessor.Value.SubmissionsProcessorIdentifierNumber.ToString();
    }

    public TSettings? GetSettings<TSettings>(ExecutionStrategyType executionStrategyType)
        where TSettings : class, IExecutionStrategySettings
        => executionStrategyType switch
        {
            ExecutionStrategyType.CompileExecuteAndCheck => new
                CompileExecuteAndCheckExecutionStrategySettings
                {
                    BaseTimeUsed = this.settings.MsBuildBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.MsBuildBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck => new
                NodeJsPreprocessExecuteAndCheckExecutionStrategySettings
                {
                    NodeJsExecutablePath = this.settings.NodeJsExecutablePath,
                    UnderscoreModulePath = this.settings.UnderscoreModulePath,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds * 2,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck or
            ExecutionStrategyType.Java17PreprocessCompileExecuteAndCheck => new
                JavaPreprocessCompileExecuteAndCheckExecutionStrategySettings
                {
                    JavaExecutablePath = this.GetJavaExecutablePath(executionStrategyType),
                    JavaLibrariesPath = this.GetJavaLibsPath(executionStrategyType),
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                    BaseUpdateTimeOffset = this.settings.JavaBaseUpdateTimeOffsetInMilliseconds,
                }

                as TSettings,
            ExecutionStrategyType.CheckOnly => new
                CheckOnlyExecutionStrategySettings
                {
                    BaseTimeUsed = 0, BaseMemoryUsed = 0,
                }

                as TSettings,
            ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck or
            ExecutionStrategyType.Java17ZipFileCompileExecuteAndCheck => new
                JavaZipFileCompileExecuteAndCheckExecutionStrategySettings
                {
                    JavaExecutablePath = this.GetJavaExecutablePath(executionStrategyType),
                    JavaLibrariesPath = this.GetJavaLibsPath(executionStrategyType),
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonExecuteAndCheck => new
                PythonExecuteAndCheckExecutionStrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha => new
                NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings
                {
                    NodeJsExecutablePath = this.settings.NodeJsExecutablePath,
                    MochaModulePath = this.settings.MochaModulePath,
                    ChaiModulePath = this.settings.ChaiModulePath,
                    SinonModulePath = this.settings.SinonModulePath,
                    SinonChaiModulePath = this.settings.SinonChaiModulePath,
                    UnderscoreModulePath = this.settings.UnderscoreModulePath,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests => new
                NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings
                {
                    NodeJsExecutablePath = this.settings.NodeJsExecutablePath,
                    MochaModulePath = this.settings.MochaModulePath,
                    ChaiModulePath = this.settings.ChaiModulePath,
                    JsDomModulePath = this.settings.JsDomModulePath,
                    JQueryModulePath = this.settings.JQueryModulePath,
                    HandlebarsModulePath = this.settings.HandlebarsModulePath,
                    SinonModulePath = this.settings.SinonModulePath,
                    SinonChaiModulePath = this.settings.SinonChaiModulePath,
                    UnderscoreModulePath = this.settings.UnderscoreModulePath,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries => new
                MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.MySqlSysDbConnectionString,
                    RestrictedUserId = this.settings.MySqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.MySqlRestrictedUserPassword,
                }

                as TSettings,
            ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase => new
                MySqlRunQueriesAndCheckDatabaseExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.MySqlSysDbConnectionString,
                    RestrictedUserId = this.settings.MySqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.MySqlRestrictedUserPassword,
                }

                as TSettings,
            ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase => new
                MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.MySqlSysDbConnectionString,
                    RestrictedUserId = this.settings.MySqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.MySqlRestrictedUserPassword,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy => new
                NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategySettings
                {
                    NodeJsExecutablePath = this.settings.NodeJsExecutablePath,
                    MochaModulePath = this.settings.MochaModulePath,
                    ChaiModulePath = this.settings.ChaiModulePath,
                    JsDomModulePath = this.settings.JsDomModulePath,
                    JQueryModulePath = this.settings.JQueryModulePath,
                    HandlebarsModulePath = this.settings.HandlebarsModulePath,
                    SinonModulePath = this.settings.SinonModulePath,
                    SinonChaiModulePath = this.settings.SinonChaiModulePath,
                    UnderscoreModulePath = this.settings.UnderscoreModulePath,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMocha => new
                NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategySettings
                {
                    NodeJsExecutablePath = this.settings.NodeJsExecutablePath,
                    MochaModulePath = this.settings.MochaModulePath,
                    ChaiModulePath = this.settings.ChaiModulePath,
                    JsDomModulePath = this.settings.JsDomModulePath,
                    JQueryModulePath = this.settings.JQueryModulePath,
                    HandlebarsModulePath = this.settings.HandlebarsModulePath,
                    SinonModulePath = this.settings.SinonModulePath,
                    SinonChaiModulePath = this.settings.SinonChaiModulePath,
                    UnderscoreModulePath = this.settings.UnderscoreModulePath,
                    BrowserifyModulePath = this.settings.BrowserifyModulePath,
                    BabelifyModulePath = this.settings.BabelifyModulePath,
                    EcmaScriptImportPluginPath = this.settings.Es2015ImportPluginPath,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy => new
                NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategySettings
                {
                    NodeJsExecutablePath = this.settings.NodeJsExecutablePath,
                    MochaModulePath = this.settings.MochaModulePath,
                    ChaiModulePath = this.settings.ChaiModulePath,
                    JsDomModulePath = this.settings.JsDomModulePath,
                    JQueryModulePath = this.settings.JQueryModulePath,
                    HandlebarsModulePath = this.settings.HandlebarsModulePath,
                    SinonJsDomModulePath = this.settings.SinonJsDomModulePath,
                    SinonModulePath = this.settings.SinonModulePath,
                    SinonChaiModulePath = this.settings.SinonChaiModulePath,
                    UnderscoreModulePath = this.settings.UnderscoreModulePath,
                    BabelCoreModulePath = this.settings.BabelCoreModulePath,
                    ReactJsxPluginPath = this.settings.ReactJsxPluginPath,
                    ReactModulePath = this.settings.ReactModulePath,
                    ReactDomModulePath = this.settings.ReactDomModulePath,
                    NodeFetchModulePath = this.settings.NodeFetchModulePath,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy => new
                NodeJsZipExecuteHtmlAndCssStrategySettings
                {
                    NodeJsExecutablePath = this.settings.NodeJsExecutablePath,
                    MochaModulePath = this.settings.MochaModulePath,
                    ChaiModulePath = this.settings.ChaiModulePath,
                    SinonModulePath = this.settings.SinonModulePath,
                    SinonChaiModulePath = this.settings.SinonChaiModulePath,
                    JsDomModulePath = this.settings.JsDomModulePath,
                    JQueryModulePath = this.settings.JQueryModulePath,
                    UnderscoreModulePath = this.settings.UnderscoreModulePath,
                    BootstrapModulePath = this.settings.BootstrapModulePath,
                    BootstrapCssPath = this.settings.BootstrapCssPath,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.JavaProjectTestsExecutionStrategy or
            ExecutionStrategyType.Java17ProjectTestsExecutionStrategy => new
                JavaProjectTestsExecutionStrategySettings
                {
                    JavaExecutablePath = this.GetJavaExecutablePath(executionStrategyType),
                    JavaLibrariesPath = this.GetJavaLibsPath(executionStrategyType),
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                    BaseUpdateTimeOffset = this.settings.JavaBaseUpdateTimeOffsetInMilliseconds,
                }

                as TSettings,
            ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy => new
                CPlusPlusZipFileExecutionStrategySettings
                {
                    BaseTimeUsed = this.settings.GPlusPlusBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.GPlusPlusBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.JavaUnitTestsExecutionStrategy or
            ExecutionStrategyType.Java17UnitTestsExecutionStrategy => new
                JavaUnitTestsExecutionStrategySettings
                {
                    JavaExecutablePath = this.GetJavaExecutablePath(executionStrategyType),
                    JavaLibrariesPath = this.GetJavaLibsPath(executionStrategyType),
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy => new
                CPlusPlusCompileExecuteAndCheckExecutionStrategySettings
                {
                    BaseTimeUsed = this.settings.GPlusPlusBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.GPlusPlusBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy or
            ExecutionStrategyType.Java17SpringAndHibernateProjectExecution => new
                JavaSpringAndHibernateProjectExecutionStrategySettings
                {
                    JavaExecutablePath = this.GetJavaExecutablePath(executionStrategyType),
                    JavaLibrariesPath = this.GetJavaLibsPath(executionStrategyType),
                    MavenPath = this.settings.MavenPath,
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCoreProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategySettings
                {
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategySettings
                {
                    TargetFrameworkName = "netcoreapp3.1",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "3.1.4",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "3.1.4",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategySettings
                {
                    DotNetCoreRuntimeVersion = this.settings.DotNetCore3RuntimeVersion,
                    BaseTimeUsed = this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCscBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategySettings
                {
                    TargetFrameworkName = "netcoreapp3.1",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "3.1.4",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "3.1.4",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonUnitTests => new
                PythonProjectUnitTestsExecutionStrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests => new
                PythonCodeExecuteAgainstUnitTestsExecutionStrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonProjectTests => new
                PythonProjectUnitTestsExecutionStrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonProjectUnitTests => new
                PythonProjectUnitTestsExecutionStrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries => new
                SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.SqlServerLocalDbMasterDbConnectionString,
                    RestrictedUserId = this.settings.SqlServerLocalDbRestrictedUserId,
                    RestrictedUserPassword = this.settings.SqlServerLocalDbRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase => new
                SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.SqlServerLocalDbMasterDbConnectionString,
                    RestrictedUserId = this.settings.SqlServerLocalDbRestrictedUserId,
                    RestrictedUserPassword = this.settings.SqlServerLocalDbRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase => new
                SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.SqlServerLocalDbMasterDbConnectionString,
                    RestrictedUserId = this.settings.SqlServerLocalDbRestrictedUserId,
                    RestrictedUserPassword = this.settings.SqlServerLocalDbRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy => new
                RunSpaAndExecuteMochaTestsExecutionStrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    JsProjNodeModulesPath = this.settings.JsProjNodeModules,
                    MochaModulePath = this.settings.MochaModulePath,
                    ChaiModulePath = this.settings.ChaiModulePath,
                    PlaywrightChromiumModulePath = this.settings.PlaywrightChromiumModulePath,
                    PortNumber = this.settings.JsProjDefaultApplicationPortNumber,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.GolangCompileExecuteAndCheck => new
                GolangCompileExecuteAndCheckExecutionStrategySettings
                {
                    BaseTimeUsed = this.settings.GolangBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.GolangBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategySettings
                {
                    TargetFrameworkName = "net6.0",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "6.0.1",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "6.0.1",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategySettings
                {
                    TargetFrameworkName = "net5.0",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "5.0.13",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "5.0.13",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategySettings
                {
                    DotNetCoreRuntimeVersion = this.settings.DotNetCore5RuntimeVersion,
                    BaseTimeUsed = this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCscBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategySettings
                {
                    DotNetCoreRuntimeVersion = this.settings.DotNetCore6RuntimeVersion,
                    BaseTimeUsed = this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCscBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategySettings
                {
                    TargetFrameworkName = "net5.0",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "5.0.13",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "5.0.13",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategySettings
                {
                    TargetFrameworkName = "net6.0",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "6.0.1",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "6.0.1",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategySettings
                {
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategySettings
                {
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries => new
                PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.PostgreSqlMasterDbConnectionString,
                    RestrictedUserId = this.settings.PostgreSqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.PostgreSqlRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase => new
                PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.PostgreSqlMasterDbConnectionString,
                    RestrictedUserId = this.settings.PostgreSqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.PostgreSqlRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase => new
                PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings
                {
                    MasterDbConnectionString = this.settings.PostgreSqlMasterDbConnectionString,
                    RestrictedUserId = this.settings.PostgreSqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.PostgreSqlRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.PythonDjangoOrmExecutionStrategy => new
                PythonDjangoOrmExecutionStrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePathV311,
                    PipExecutablePath = this.settings.PipExecutablePathV311,
                    BaseTimeUsed = this.settings.PythonV311BaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonV311BaseMemoryUsedInBytes,
                    InstallPackagesTimeUsed = this.settings.PythonV311InstallPackagesTimeUsedInMilliseconds,
                }

                as TSettings,
            ExecutionStrategyType.DoNothing => new DoNothingExecutionStrategySettings() as TSettings,
            ExecutionStrategyType.NotFound => throw new ArgumentException(
                $"Cannot get settings for {ExecutionStrategyType.NotFound} strategy.",
                nameof(executionStrategyType)),
            _ => throw new ArgumentOutOfRangeException(nameof(executionStrategyType), executionStrategyType, null),
        };

    private static bool IsJava17(ExecutionStrategyType type)
        => type.ToString().Contains("17");

    private string GetJavaExecutablePath(ExecutionStrategyType strategyType)
        => IsJava17(strategyType)
            ? this.settings.Java17ExecutablePath
            : this.settings.JavaExecutablePath;

    private string GetJavaLibsPath(ExecutionStrategyType strategyType)
        => IsJava17(strategyType)
            ? this.settings.Java17LibsPath
            : this.settings.JavaLibsPath;

    private string GetJavaCompilerPath(ExecutionStrategyType strategyType)
    {
        var isJava17 = strategyType.ToString().Contains("17");

        return isJava17
            ? this.settings.Java17CompilerPath
            : this.settings.JavaCompilerPath;
    }
}