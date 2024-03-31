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
                CompileExecuteAndCheckExecutionStrategySettings(
                    this.settings.MsBuildBaseTimeUsedInMilliseconds,
                    this.settings.MsBuildBaseMemoryUsedInBytes)

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck => new
                NodeJsPreprocessExecuteAndCheckExecutionStrategySettings(
                    this.settings.NodeJsBaseTimeUsedInMilliseconds * 2,
                    this.settings.NodeJsBaseMemoryUsedInBytes,
                    this.GetNodeJsExecutablePath(executionStrategyType),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.UnderscoreModulePath))

                as TSettings,
            ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck or
            ExecutionStrategyType.Java21PreprocessCompileExecuteAndCheck => new
                JavaPreprocessCompileExecuteAndCheckExecutionStrategySettings(
                    this.settings.JavaBaseTimeUsedInMilliseconds,
                    this.settings.JavaBaseMemoryUsedInBytes,
                    this.GetJavaExecutablePath(executionStrategyType),
                    this.GetJavaLibsPath(executionStrategyType),
                    this.settings.JavaBaseUpdateTimeOffsetInMilliseconds)

                as TSettings,
            ExecutionStrategyType.CheckOnly => new
                CheckOnlyExecutionStrategySettings(0, 0)

                as TSettings,
            ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck or
            ExecutionStrategyType.Java21ZipFileCompileExecuteAndCheck => new
                JavaZipFileCompileExecuteAndCheckExecutionStrategySettings(
                    this.settings.JavaBaseTimeUsedInMilliseconds,
                    this.settings.JavaBaseMemoryUsedInBytes,
                    this.GetJavaExecutablePath(executionStrategyType),
                    this.GetJavaLibsPath(executionStrategyType),
                    this.settings.JavaBaseUpdateTimeOffsetInMilliseconds)

                as TSettings,
            ExecutionStrategyType.PythonExecuteAndCheck => new
                PythonExecuteAndCheckExecutionStrategySettings(
                    this.settings.PythonBaseTimeUsedInMilliseconds,
                    this.settings.PythonBaseMemoryUsedInBytes,
                    this.settings.PythonExecutablePath)

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha => new
                NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings(
                    this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    this.settings.NodeJsBaseMemoryUsedInBytes,
                    this.GetNodeJsExecutablePath(executionStrategyType),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.UnderscoreModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.MochaModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.ChaiModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.SinonModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.SinonChaiModulePath))

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests => new
                NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings(
                    this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    this.settings.NodeJsBaseMemoryUsedInBytes,
                    this.GetNodeJsExecutablePath(executionStrategyType),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.UnderscoreModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.MochaModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.ChaiModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.SinonModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.SinonChaiModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.JsDomModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.JQueryModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.HandlebarsModulePath))

                as TSettings,
            ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries => new
                MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings(
                    this.settings.MySqlSysDbConnectionString,
                    this.settings.MySqlRestrictedUserId,
                    this.settings.MySqlRestrictedUserPassword)

                as TSettings,
            ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase => new
                MySqlRunQueriesAndCheckDatabaseExecutionStrategySettings(
                    this.settings.MySqlSysDbConnectionString,
                    this.settings.MySqlRestrictedUserId,
                    this.settings.MySqlRestrictedUserPassword)

                as TSettings,
            ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase => new
                MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings(
                    this.settings.MySqlSysDbConnectionString,
                    this.settings.MySqlRestrictedUserId,
                    this.settings.MySqlRestrictedUserPassword)

                as TSettings,
            ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy => new
                NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategySettings(
                    this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    this.settings.NodeJsBaseMemoryUsedInBytes,
                    this.GetNodeJsExecutablePath(executionStrategyType),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.UnderscoreModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.MochaModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.ChaiModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.SinonModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.SinonChaiModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.JsDomModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.JQueryModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.HandlebarsModulePath))

                as TSettings,
            ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy => new
                NodeJsZipExecuteHtmlAndCssStrategySettings(
                    this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    this.settings.NodeJsBaseMemoryUsedInBytes,
                    this.GetNodeJsExecutablePath(executionStrategyType),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.UnderscoreModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.MochaModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.ChaiModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.SinonModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.SinonChaiModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.JsDomModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.JQueryModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.BootstrapModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.BootstrapCssPath))

                as TSettings,
            ExecutionStrategyType.JavaProjectTestsExecutionStrategy or
            ExecutionStrategyType.Java21ProjectTestsExecutionStrategy => new
                JavaProjectTestsExecutionStrategySettings(
                    this.settings.JavaBaseTimeUsedInMilliseconds,
                    this.settings.JavaBaseMemoryUsedInBytes,
                    this.GetJavaExecutablePath(executionStrategyType),
                    this.GetJavaLibsPath(executionStrategyType),
                    this.settings.JavaBaseUpdateTimeOffsetInMilliseconds)

                as TSettings,
            ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy => new
                CPlusPlusZipFileExecutionStrategySettings(
                    this.settings.GPlusPlusBaseTimeUsedInMilliseconds,
                    this.settings.GPlusPlusBaseMemoryUsedInBytes)

                as TSettings,
            ExecutionStrategyType.JavaUnitTestsExecutionStrategy or
            ExecutionStrategyType.Java21UnitTestsExecutionStrategy => new
                JavaUnitTestsExecutionStrategySettings(
                    this.settings.JavaBaseTimeUsedInMilliseconds,
                    this.settings.JavaBaseMemoryUsedInBytes,
                    this.GetJavaExecutablePath(executionStrategyType),
                    this.GetJavaLibsPath(executionStrategyType),
                    this.settings.JavaBaseUpdateTimeOffsetInMilliseconds)

                as TSettings,
            ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy => new
                CPlusPlusCompileExecuteAndCheckExecutionStrategySettings(
                    this.settings.GPlusPlusBaseTimeUsedInMilliseconds,
                    this.settings.GPlusPlusBaseMemoryUsedInBytes)

                as TSettings,
            ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy or
            ExecutionStrategyType.Java21SpringAndHibernateProjectExecution => new
                JavaSpringAndHibernateProjectExecutionStrategySettings(
                    this.settings.JavaBaseTimeUsedInMilliseconds,
                    this.settings.JavaBaseMemoryUsedInBytes,
                    this.GetJavaExecutablePath(executionStrategyType),
                    this.GetJavaLibsPath(executionStrategyType),
                    this.settings.JavaBaseUpdateTimeOffsetInMilliseconds,
                    this.settings.MavenPath,
                    this.settings.JavaSpringAndHibernateStrategyPomFilePath)

                as TSettings,
            ExecutionStrategyType.DotNetCoreProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes)

                as TSettings,
            ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes,
                    "netcoreapp3.1",
                    "3.1.4",
                    "3.1.4")

                as TSettings,
            ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategySettings(
                    this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCscBaseMemoryUsedInBytes,
                    this.settings.DotNetCore3RuntimeVersion)

                as TSettings,
            ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes,
                    "netcoreapp3.1",
                    "3.1.4",
                    "3.1.4")

                as TSettings,
            ExecutionStrategyType.PythonUnitTests => new
                PythonProjectUnitTestsExecutionStrategySettings(
                    this.settings.PythonBaseTimeUsedInMilliseconds,
                    this.settings.PythonBaseMemoryUsedInBytes,
                    this.settings.PythonExecutablePath)

                as TSettings,
            ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests => new
                PythonCodeExecuteAgainstUnitTestsExecutionStrategySettings(
                    this.settings.PythonBaseTimeUsedInMilliseconds,
                    this.settings.PythonBaseMemoryUsedInBytes,
                    this.settings.PythonExecutablePath)

                as TSettings,
            ExecutionStrategyType.PythonProjectTests => new
                PythonProjectUnitTestsExecutionStrategySettings(
                    this.settings.PythonBaseTimeUsedInMilliseconds,
                    this.settings.PythonBaseMemoryUsedInBytes,
                    this.settings.PythonExecutablePath)

                as TSettings,
            ExecutionStrategyType.PythonProjectUnitTests => new
                PythonProjectUnitTestsExecutionStrategySettings(
                    this.settings.PythonBaseTimeUsedInMilliseconds,
                    this.settings.PythonBaseMemoryUsedInBytes,
                    this.settings.PythonExecutablePath)

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries => new
                SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategySettings(
                    this.settings.SqlServerLocalDbMasterDbConnectionString,
                    this.settings.SqlServerLocalDbRestrictedUserId,
                    this.settings.SqlServerLocalDbRestrictedUserPassword,
                    this.submissionProcessorIdentifier)

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase => new
                SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings(
                    this.settings.SqlServerLocalDbMasterDbConnectionString,
                    this.settings.SqlServerLocalDbRestrictedUserId,
                    this.settings.SqlServerLocalDbRestrictedUserPassword,
                    this.submissionProcessorIdentifier)

                as TSettings,
            ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase => new
                SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings(
                    this.settings.SqlServerLocalDbMasterDbConnectionString,
                    this.settings.SqlServerLocalDbRestrictedUserId,
                    this.settings.SqlServerLocalDbRestrictedUserPassword,
                    this.submissionProcessorIdentifier)

                as TSettings,
            ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy or
            ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests => new
                RunSpaAndExecuteMochaTestsExecutionStrategySettings(
                    this.settings.NodeJsBaseTimeUsedInMilliseconds,
                    this.settings.NodeJsBaseMemoryUsedInBytes,
                    this.settings.PythonExecutablePath,
                    this.GetNodeResourcePath(executionStrategyType, this.settings.JsProjNodeModules),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.MochaModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.ChaiModulePath),
                    this.GetNodeResourcePath(executionStrategyType, this.settings.PlaywrightChromiumModulePath))

                as TSettings,
            ExecutionStrategyType.GolangCompileExecuteAndCheck => new
                GolangCompileExecuteAndCheckExecutionStrategySettings(
                    this.settings.GolangBaseTimeUsedInMilliseconds,
                    this.settings.GolangBaseMemoryUsedInBytes)

                as TSettings,
            ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes,
                    "net6.0",
                    "6.0.1",
                    "6.0.1")

                as TSettings,
            ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy => new
                DotNetCoreProjectTestsExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes,
                    "net5.0",
                    "5.0.13",
                    "5.0.13")

                as TSettings,
            ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategySettings(
                    this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCscBaseMemoryUsedInBytes,
                    this.settings.DotNetCore5RuntimeVersion)

                as TSettings,
            ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck => new
                DotNetCoreCompileExecuteAndCheckExecutionStrategySettings(
                    this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCscBaseMemoryUsedInBytes,
                    this.settings.DotNetCore6RuntimeVersion)

                as TSettings,
            ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes,
                    "net5.0",
                    "5.0.13",
                    "5.0.13")

                as TSettings,
            ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy => new
                DotNetCoreUnitTestsExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes,
                    "net6.0",
                    "6.0.1",
                    "6.0.1")

                as TSettings,
            ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes)

                as TSettings,
            ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy => new
                DotNetCoreProjectExecutionStrategySettings(
                    this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                    this.settings.DotNetCliBaseMemoryUsedInBytes)

                as TSettings,
            ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries => new
                PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategySettings(
                    this.settings.PostgreSqlMasterDbConnectionString,
                    this.settings.PostgreSqlRestrictedUserId,
                    this.settings.PostgreSqlRestrictedUserPassword,
                    this.submissionProcessorIdentifier)

                as TSettings,
            ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase => new
                PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategySettings(
                    this.settings.PostgreSqlMasterDbConnectionString,
                    this.settings.PostgreSqlRestrictedUserId,
                    this.settings.PostgreSqlRestrictedUserPassword,
                    this.submissionProcessorIdentifier)

                as TSettings,
            ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase => new
                PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings(
                    this.settings.PostgreSqlMasterDbConnectionString,
                    this.settings.PostgreSqlRestrictedUserId,
                    this.settings.PostgreSqlRestrictedUserPassword,
                    this.submissionProcessorIdentifier)

                as TSettings,
            ExecutionStrategyType.PythonDjangoOrmExecutionStrategy => new
                PythonDjangoOrmExecutionStrategySettings(
                    this.settings.PythonV311BaseTimeUsedInMilliseconds,
                    this.settings.PythonV311BaseMemoryUsedInBytes,
                    this.settings.PythonExecutablePathV311,
                    this.settings.PipExecutablePathV311,
                    this.settings.PythonV311InstallPackagesTimeUsedInMilliseconds)

                as TSettings,
            ExecutionStrategyType.DoNothing => new DoNothingExecutionStrategySettings() as TSettings,
            ExecutionStrategyType.NotFound => throw new ArgumentException(
                $"Cannot get settings for {ExecutionStrategyType.NotFound} strategy.",
                nameof(executionStrategyType)),
            _ => throw new ArgumentOutOfRangeException(nameof(executionStrategyType), executionStrategyType, null),
        };

    private static bool IsJava21(ExecutionStrategyType type)
        => type.ToString().Contains("21");

    private static bool IsNode20(ExecutionStrategyType type)
        => type.ToString().Contains("20");

    private string GetJavaExecutablePath(ExecutionStrategyType strategyType)
        => IsJava21(strategyType)
            ? this.settings.Java21ExecutablePath
            : this.settings.JavaExecutablePath;

    private string GetJavaLibsPath(ExecutionStrategyType strategyType)
        => IsJava21(strategyType)
            ? this.settings.Java21LibsPath
            : this.settings.JavaLibsPath;

    private string GetNodeJsExecutablePath(ExecutionStrategyType strategyType)
        => IsNode20(strategyType)
            ? this.settings.NodeJs20ExecutablePath
            : this.settings.NodeJsExecutablePath;

    private string GetNodeResourcePath(ExecutionStrategyType strategyType, string template)
    {
        var resourcesPath = IsNode20(strategyType)
            ? this.settings.Node20ResourcesPath
            : this.settings.NodeResourcesPath;

        return template.Replace(this.settings.NodeResourcesPathPlaceholder, resourcesPath);
    }
}