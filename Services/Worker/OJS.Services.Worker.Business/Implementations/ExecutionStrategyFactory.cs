#nullable disable

namespace OJS.Services.Worker.Business.Implementations
{
    using Microsoft.Extensions.Options;
    using OJS.Services.Worker.Models.Configuration;
    using System;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.Compilers;
    using OJS.Workers.ExecutionStrategies;
    using OJS.Workers.ExecutionStrategies.CPlusPlus;
    using OJS.Workers.ExecutionStrategies.CSharp;
    using OJS.Workers.ExecutionStrategies.CSharp.DotNetCore;
    using OJS.Workers.ExecutionStrategies.Golang;
    using OJS.Workers.ExecutionStrategies.Java;
    using OJS.Workers.ExecutionStrategies.NodeJs;
    using OJS.Workers.ExecutionStrategies.Python;
    using OJS.Workers.ExecutionStrategies.Sql.MySql;
    using OJS.Workers.ExecutionStrategies.Sql.PostgreSql;
    using OJS.Workers.ExecutionStrategies.Sql.SqlServerSingleDatabase;
    using OJS.Workers.Executors.Implementations;

    public class ExecutionStrategyFactory : IExecutionStrategyFactory
    {
        private readonly ICompilerFactory compilerFactory;
        private readonly OjsWorkersConfig settings;
        private readonly string submissionProcessorIdentifier;

        public ExecutionStrategyFactory(
            ICompilerFactory compilerFactory,
            IOptions<OjsWorkersConfig> ojsWorkersConfigAccessor,
            IOptions<ApplicationConfig> appConfigAccessor)
        {
            this.compilerFactory = compilerFactory;
            this.settings = ojsWorkersConfigAccessor.Value;
            this.submissionProcessorIdentifier = appConfigAccessor.Value.SubmissionsProcessorIdentifierNumber.ToString();
        }

        public IExecutionStrategy CreateExecutionStrategy(
            ExecutionStrategyType type)
        {
            IExecutionStrategy executionStrategy;
            var tasksService = new TasksService();
            var processExecutorFactory = new ProcessExecutorFactory(tasksService);

            switch (type)
            {
                case ExecutionStrategyType.CompileExecuteAndCheck:
                    executionStrategy = new CompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.MsBuildBaseTimeUsedInMilliseconds,
                        this.settings.MsBuildBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy:
                    executionStrategy = new CPlusPlusCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.GPlusPlusBaseTimeUsedInMilliseconds,
                        this.settings.GPlusPlusBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy:
                    executionStrategy = new CPlusPlusZipFileExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.GPlusPlusBaseTimeUsedInMilliseconds,
                        this.settings.GPlusPlusBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck:
                    executionStrategy = new DotNetCoreCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.DotNetCoreRuntimeVersion(type),
                        this.settings.DotNetCscBaseTimeUsedInMilliseconds,
                        this.settings.DotNetCscBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.GolangCompileExecuteAndCheck:
                    executionStrategy = new GolangCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.GolangBaseTimeUsedInMilliseconds,
                        this.settings.GolangBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                        this.settings.DotNetCliBaseMemoryUsedInBytes,
                        OjsWorkersConfig.DotNetCoreTargetFrameworkName(type),
                        OjsWorkersConfig.MicrosoftEntityFrameworkCoreInMemoryVersion(type),
                        OjsWorkersConfig.MicrosoftEntityFrameworkCoreProxiesVersion(type));
                    break;
                case ExecutionStrategyType.CSharpProjectTestsExecutionStrategy:
                    executionStrategy = new CSharpProjectTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.NUnitConsoleRunnerPath,
                        this.settings.MsBuildBaseTimeUsedInMilliseconds,
                        this.settings.MsBuildBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                        this.settings.DotNetCliBaseMemoryUsedInBytes);
                    break;

                case ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.settings.DotNetCliBaseTimeUsedInMilliseconds,
                        this.settings.DotNetCliBaseMemoryUsedInBytes,
                        OjsWorkersConfig.DotNetCoreTargetFrameworkName(type),
                        OjsWorkersConfig.MicrosoftEntityFrameworkCoreInMemoryVersion(type),
                        OjsWorkersConfig.MicrosoftEntityFrameworkCoreProxiesVersion(type));
                    break;
                case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                case ExecutionStrategyType.Java17PreprocessCompileExecuteAndCheck:
                    executionStrategy = new JavaPreprocessCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.GetJavaCompilerPath,
                        this.GetJavaExecutablePath(type),
                        this.GetJavaLibsPath(type),
                        this.settings.JavaBaseTimeUsedInMilliseconds,
                        this.settings.JavaBaseMemoryUsedInBytes,
                        this.settings.JavaBaseUpdateTimeOffsetInMilliseconds);
                    break;
                case ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck:
                case ExecutionStrategyType.Java17ZipFileCompileExecuteAndCheck:
                    executionStrategy = new JavaZipFileCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.GetJavaCompilerPath,
                        this.GetJavaExecutablePath(type),
                        this.GetJavaLibsPath(type),
                        this.settings.JavaBaseTimeUsedInMilliseconds,
                        this.settings.JavaBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.JavaProjectTestsExecutionStrategy:
                case ExecutionStrategyType.Java17ProjectTestsExecutionStrategy:
                    executionStrategy = new JavaProjectTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.GetJavaCompilerPath,
                        this.GetJavaExecutablePath(type),
                        this.GetJavaLibsPath(type),
                        this.settings.JavaBaseTimeUsedInMilliseconds,
                        this.settings.JavaBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.JavaUnitTestsExecutionStrategy:
                case ExecutionStrategyType.Java17UnitTestsExecutionStrategy:
                    executionStrategy = new JavaUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.GetJavaCompilerPath,
                        this.GetJavaExecutablePath(type),
                        this.GetJavaLibsPath(type),
                        this.settings.JavaBaseTimeUsedInMilliseconds,
                        this.settings.JavaBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy:
                case ExecutionStrategyType.Java17SpringAndHibernateProjectExecution:
                    executionStrategy = new JavaSpringAndHibernateProjectExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.GetJavaCompilerPath,
                        this.GetJavaExecutablePath(type),
                        this.GetJavaLibsPath(type),
                        this.settings.MavenPath,
                        this.settings.JavaBaseTimeUsedInMilliseconds,
                        this.settings.JavaBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                    executionStrategy = new NodeJsPreprocessExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.settings.NodeJsExecutablePath,
                        this.settings.UnderscoreModulePath,
                        this.settings.NodeJsBaseTimeUsedInMilliseconds * 2,
                        this.settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy(
                        processExecutorFactory,
                        this.settings.NodeJsExecutablePath,
                        this.settings.MochaModulePath,
                        this.settings.ChaiModulePath,
                        this.settings.SinonModulePath,
                        this.settings.SinonChaiModulePath,
                        this.settings.UnderscoreModulePath,
                        this.settings.NodeJsBaseTimeUsedInMilliseconds,
                        this.settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMocha:
                    executionStrategy = new NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategy(
                        processExecutorFactory,
                        this.settings.NodeJsExecutablePath,
                        this.settings.MochaModulePath,
                        this.settings.ChaiModulePath,
                        this.settings.JsDomModulePath,
                        this.settings.JQueryModulePath,
                        this.settings.HandlebarsModulePath,
                        this.settings.SinonModulePath,
                        this.settings.SinonChaiModulePath,
                        this.settings.UnderscoreModulePath,
                        this.settings.BrowserifyModulePath,
                        this.settings.BabelifyModulePath,
                        this.settings.Es2015ImportPluginPath,
                        this.settings.NodeJsBaseTimeUsedInMilliseconds,
                        this.settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.settings.NodeJsExecutablePath,
                        this.settings.MochaModulePath,
                        this.settings.ChaiModulePath,
                        this.settings.JsDomModulePath,
                        this.settings.JQueryModulePath,
                        this.settings.HandlebarsModulePath,
                        this.settings.SinonModulePath,
                        this.settings.SinonChaiModulePath,
                        this.settings.UnderscoreModulePath,
                        this.settings.NodeJsBaseTimeUsedInMilliseconds,
                        this.settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy(
                        processExecutorFactory,
                        this.settings.NodeJsExecutablePath,
                        this.settings.MochaModulePath,
                        this.settings.ChaiModulePath,
                        this.settings.JsDomModulePath,
                        this.settings.JQueryModulePath,
                        this.settings.HandlebarsModulePath,
                        this.settings.SinonModulePath,
                        this.settings.SinonChaiModulePath,
                        this.settings.UnderscoreModulePath,
                        this.settings.NodeJsBaseTimeUsedInMilliseconds,
                        this.settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy:
                    executionStrategy = new NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy(
                        processExecutorFactory,
                        this.settings.NodeJsExecutablePath,
                        this.settings.MochaModulePath,
                        this.settings.ChaiModulePath,
                        this.settings.JsDomModulePath,
                        this.settings.JQueryModulePath,
                        this.settings.HandlebarsModulePath,
                        this.settings.SinonJsDomModulePath,
                        this.settings.SinonModulePath,
                        this.settings.SinonChaiModulePath,
                        this.settings.UnderscoreModulePath,
                        this.settings.BabelCoreModulePath,
                        this.settings.ReactJsxPluginPath,
                        this.settings.ReactModulePath,
                        this.settings.ReactDomModulePath,
                        this.settings.NodeFetchModulePath,
                        this.settings.NodeJsBaseTimeUsedInMilliseconds,
                        this.settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy:
                    executionStrategy = new NodeJsZipExecuteHtmlAndCssStrategy(
                        processExecutorFactory,
                        this.settings.NodeJsExecutablePath,
                        this.settings.MochaModulePath,
                        this.settings.ChaiModulePath,
                        this.settings.SinonModulePath,
                        this.settings.SinonChaiModulePath,
                        this.settings.JsDomModulePath,
                        this.settings.JQueryModulePath,
                        this.settings.UnderscoreModulePath,
                        this.settings.BootstrapModulePath,
                        this.settings.BootstrapCssPath,
                        this.settings.NodeJsBaseTimeUsedInMilliseconds,
                        this.settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategy(
                        processExecutorFactory,
                        this.settings.PythonExecutablePath,
                        this.settings.JsProjNodeModules,
                        this.settings.MochaModulePath,
                        this.settings.ChaiModulePath,
                        this.settings.PlaywrightChromiumModulePath,
                        this.settings.JsProjDefaultApplicationPortNumber,
                        this.settings.NodeJsBaseTimeUsedInMilliseconds,
                        this.settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonExecuteAndCheck:
                    executionStrategy = new PythonExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.settings.PythonExecutablePath,
                        this.settings.PythonBaseTimeUsedInMilliseconds,
                        this.settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonUnitTests:
                    executionStrategy = new PythonUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.settings.PythonExecutablePath,
                        this.settings.PythonBaseTimeUsedInMilliseconds,
                        this.settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests:
                    executionStrategy = new PythonCodeExecuteAgainstUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.settings.PythonExecutablePath,
                        this.settings.PythonBaseTimeUsedInMilliseconds,
                        this.settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonProjectTests:
                    executionStrategy = new PythonProjectTestsExecutionStrategy(
                        processExecutorFactory,
                        this.settings.PythonExecutablePath,
                        this.settings.PythonBaseTimeUsedInMilliseconds,
                        this.settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonProjectUnitTests:
                    executionStrategy = new PythonProjectUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.settings.PythonExecutablePath,
                        this.settings.PythonBaseTimeUsedInMilliseconds,
                        this.settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries:
                    executionStrategy = new SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy(
                        this.settings.SqlServerLocalDbMasterDbConnectionString,
                        this.settings.SqlServerLocalDbRestrictedUserId,
                        this.settings.SqlServerLocalDbRestrictedUserPassword,
                        this.submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.settings.SqlServerLocalDbMasterDbConnectionString,
                        this.settings.SqlServerLocalDbRestrictedUserId,
                        this.settings.SqlServerLocalDbRestrictedUserPassword,
                        this.submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                            this.settings.SqlServerLocalDbMasterDbConnectionString,
                            this.settings.SqlServerLocalDbRestrictedUserId,
                            this.settings.SqlServerLocalDbRestrictedUserPassword,
                            this.submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new MySqlPrepareDatabaseAndRunQueriesExecutionStrategy(
                        this.settings.MySqlSysDbConnectionString,
                        this.settings.MySqlRestrictedUserId,
                        this.settings.MySqlRestrictedUserPassword);
                    break;
                case ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.settings.MySqlSysDbConnectionString,
                        this.settings.MySqlRestrictedUserId,
                        this.settings.MySqlRestrictedUserPassword);
                    break;
                case ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.settings.MySqlSysDbConnectionString,
                        this.settings.MySqlRestrictedUserId,
                        this.settings.MySqlRestrictedUserPassword);
                    break;
                case ExecutionStrategyType.DoNothing:
                    executionStrategy = new DoNothingExecutionStrategy();
                    break;
                case ExecutionStrategyType.CheckOnly:
                    executionStrategy = new CheckOnlyExecutionStrategy(processExecutorFactory, 0, 0);
                    break;
                case ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy(
                        this.settings.PostgreSqlMasterDbConnectionString,
                        this.settings.PostgreSqlRestrictedUserId,
                        this.settings.PostgreSqlRestrictedUserPassword,
                        this.submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase:
                    executionStrategy = new PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.settings.PostgreSqlMasterDbConnectionString,
                        this.settings.PostgreSqlRestrictedUserId,
                        this.settings.PostgreSqlRestrictedUserPassword,
                        this.submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                            this.settings.PostgreSqlMasterDbConnectionString,
                            this.settings.PostgreSqlRestrictedUserId,
                            this.settings.PostgreSqlRestrictedUserPassword,
                            this.submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.PythonDjangoOrmExecutionStrategy:
                    executionStrategy = new PythonDjangoOrmExecutionStrategy(
                        processExecutorFactory,
                        this.settings.PythonExecutablePathV311,
                        this.settings.PipExecutablePathV311,
                        this.settings.PythonV311BaseTimeUsedInMilliseconds,
                        this.settings.PythonV311BaseMemoryUsedInBytes,
                        this.settings.PythonV311InstallPackagesTimeUsedInMilliseconds);
                    break;
                case ExecutionStrategyType.NotFound:
                default:
                    throw new ArgumentOutOfRangeException(nameof(executionStrategy), "Invalid execution strategy type.");
            }

            executionStrategy.Type = type;

            return executionStrategy;
        }

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
}