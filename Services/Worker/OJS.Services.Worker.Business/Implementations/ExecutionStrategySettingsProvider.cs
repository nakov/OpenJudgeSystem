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
                CompileExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    BaseTimeUsed = this.settings.MsBuildBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.MsBuildBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck => new
                NodeJsPreprocessExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    NodeJsExecutablePath = this.settings.NodeJsExecutablePath,
                    UnderscoreModulePath = this.settings.UnderscoreModulePath,
                    BaseTimeUsed = this.settings.NodeJsBaseTimeUsedInMilliseconds * 2,
                    BaseMemoryUsed = this.settings.NodeJsBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck => new
                JavaPreprocessCompileExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    JavaExecutablePath = this.settings.JavaExecutablePath,
                    JavaLibrariesPath = this.settings.JavaLibsPath,
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                    BaseUpdateTimeOffset = this.settings.JavaBaseUpdateTimeOffsetInMilliseconds,
                }

                as TSettings,
            ExecutionStrategyType.CheckOnly => new
                BaseCodeExecutionStrategySettings
                {
                    BaseTimeUsed = 0, BaseMemoryUsed = 0,
                }

                as TSettings,
            ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck => new
                JavaZipFileCompileExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    JavaExecutablePath = this.settings.JavaExecutablePath,
                    JavaLibrariesPath = this.settings.JavaLibsPath,
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonExecuteAndCheck => new
                PythonExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha => new
                NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy.StrategySettings
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
                NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy.StrategySettings
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
                MySqlPrepareDatabaseAndRunQueriesExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.MySqlSysDbConnectionString,
                    RestrictedUserId = this.settings.MySqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.MySqlRestrictedUserPassword,
                }

                as TSettings,
            ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase => new
                MySqlRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.MySqlSysDbConnectionString,
                    RestrictedUserId = this.settings.MySqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.MySqlRestrictedUserPassword,
                }

                as TSettings,
            ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase => new
                MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.MySqlSysDbConnectionString,
                    RestrictedUserId = this.settings.MySqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.MySqlRestrictedUserPassword,
                }

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy => new
                NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy.StrategySettings
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
                NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategy.StrategySettings
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
                NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy.StrategySettings
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
                NodeJsZipExecuteHtmlAndCssStrategy.StrategySettings
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
            ExecutionStrategyType.JavaProjectTestsExecutionStrategy => new
                JavaProjectTestsExecutionStrategy.StrategySettings
                {
                    JavaExecutablePath = this.settings.JavaExecutablePath,
                    JavaLibrariesPath = this.settings.JavaLibsPath,
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy => new
                CPlusPlusZipFileExecutionStrategy.StrategySettings
                {
                    BaseTimeUsed = this.settings.GPlusPlusBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.GPlusPlusBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.JavaUnitTestsExecutionStrategy => new
                JavaUnitTestsExecutionStrategy.StrategySettings
                {
                    JavaExecutablePath = this.settings.JavaExecutablePath,
                    JavaLibrariesPath = this.settings.JavaLibsPath,
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy => new
                CPlusPlusCompileExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    BaseTimeUsed = this.settings.GPlusPlusBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.GPlusPlusBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy => new
                JavaSpringAndHibernateProjectExecutionStrategy.StrategySettings
                {
                    JavaExecutablePath = this.settings.JavaExecutablePath,
                    JavaLibrariesPath = this.settings.JavaLibsPath,
                    MavenPath = this.settings.MavenPath,
                    BaseTimeUsed = this.settings.JavaBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.JavaBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCoreProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategy.StrategySettings
                {
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategy.StrategySettings
                {
                    TargetFrameworkName = "netcoreapp3.1",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "3.1.4",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "3.1.4",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    DotNetCoreRuntimeVersion = this.settings.DotNetCore3RuntimeVersion,
                    BaseTimeUsed = this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCscBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategy.StrategySettings
                {
                    TargetFrameworkName = "netcoreapp3.1",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "3.1.4",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "3.1.4",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonUnitTests => new
                PythonProjectUnitTestsExecutionStrategy.StrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests => new
                PythonCodeExecuteAgainstUnitTestsExecutionStrategy.StrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonProjectTests => new
                PythonProjectUnitTestsExecutionStrategy.StrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PythonProjectUnitTests => new
                PythonProjectUnitTestsExecutionStrategy.StrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePath,
                    BaseTimeUsed = this.settings.PythonBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries => new
                SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.SqlServerLocalDbMasterDbConnectionString,
                    RestrictedUserId = this.settings.SqlServerLocalDbRestrictedUserId,
                    RestrictedUserPassword = this.settings.SqlServerLocalDbRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase => new
                SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.SqlServerLocalDbMasterDbConnectionString,
                    RestrictedUserId = this.settings.SqlServerLocalDbRestrictedUserId,
                    RestrictedUserPassword = this.settings.SqlServerLocalDbRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase => new
                SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.SqlServerLocalDbMasterDbConnectionString,
                    RestrictedUserId = this.settings.SqlServerLocalDbRestrictedUserId,
                    RestrictedUserPassword = this.settings.SqlServerLocalDbRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy => new
                RunSpaAndExecuteMochaTestsExecutionStrategy.StrategySettings
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
                GolangCompileExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    BaseTimeUsed = this.settings.GolangBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.GolangBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategy.StrategySettings
                {
                    TargetFrameworkName = "net6.0",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "6.0.1",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "6.0.1",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategy.StrategySettings
                {
                    TargetFrameworkName = "net5.0",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "5.0.13",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "5.0.13",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    DotNetCoreRuntimeVersion = this.settings.DotNetCore5RuntimeVersion,
                    BaseTimeUsed = this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCscBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategy.StrategySettings
                {
                    DotNetCoreRuntimeVersion = this.settings.DotNetCore6RuntimeVersion,
                    BaseTimeUsed = this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCscBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategy.StrategySettings
                {
                    TargetFrameworkName = "net5.0",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "5.0.13",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "5.0.13",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategy.StrategySettings
                {
                    TargetFrameworkName = "net6.0",
                    MicrosoftEntityFrameworkCoreInMemoryVersion = "6.0.1",
                    MicrosoftEntityFrameworkCoreProxiesVersion = "6.0.1",
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategy.StrategySettings
                {
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategy.StrategySettings
                {
                    BaseTimeUsed = this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.DotNetCliBaseMemoryUsedInBytes,
                }

                as TSettings,
            ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries => new
                PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.PostgreSqlMasterDbConnectionString,
                    RestrictedUserId = this.settings.PostgreSqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.PostgreSqlRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase => new
                PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.PostgreSqlMasterDbConnectionString,
                    RestrictedUserId = this.settings.PostgreSqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.PostgreSqlRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase => new
                PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings
                {
                    MasterDbConnectionString = this.settings.PostgreSqlMasterDbConnectionString,
                    RestrictedUserId = this.settings.PostgreSqlRestrictedUserId,
                    RestrictedUserPassword = this.settings.PostgreSqlRestrictedUserPassword,
                    SubmissionProcessorIdentifier = this.submissionProcessorIdentifier,
                }

                as TSettings,
            ExecutionStrategyType.PythonDjangoOrmExecutionStrategy => new
                PythonDjangoOrmExecutionStrategy.StrategySettings
                {
                    PythonExecutablePath = this.settings.PythonExecutablePathV311,
                    PipExecutablePath = this.settings.PipExecutablePathV311,
                    BaseTimeUsed = this.settings.PythonV311BaseTimeUsedInMilliseconds,
                    BaseMemoryUsed = this.settings.PythonV311BaseMemoryUsedInBytes,
                    InstallPackagesTimeUsed = this.settings.PythonV311InstallPackagesTimeUsedInMilliseconds,
                }

                as TSettings,
            ExecutionStrategyType.DoNothing => null,
            ExecutionStrategyType.NotFound => throw new ArgumentException(
                $"Cannot get settings for {ExecutionStrategyType.NotFound} strategy.",
                nameof(executionStrategyType)),
            _ => throw new ArgumentOutOfRangeException(nameof(executionStrategyType), executionStrategyType, null),
        };
}