#nullable disable
namespace OJS.Workers.SubmissionProcessors.Helpers
{
    using System;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.ExecutionStrategies;
    using OJS.Workers.ExecutionStrategies.CPlusPlus;
    using OJS.Workers.ExecutionStrategies.CSharp;
    using OJS.Workers.ExecutionStrategies.CSharp.DotNetCore;
    using OJS.Workers.ExecutionStrategies.CSharp.DotNetFramework;
    using OJS.Workers.ExecutionStrategies.Golang;
    using OJS.Workers.ExecutionStrategies.Java;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.ExecutionStrategies.NodeJs;
    using OJS.Workers.ExecutionStrategies.Python;
    using OJS.Workers.ExecutionStrategies.Ruby;
    using OJS.Workers.ExecutionStrategies.Sql.MySql;
    using OJS.Workers.ExecutionStrategies.Sql.PostgreSql;
    using OJS.Workers.ExecutionStrategies.Sql.SqlServerSingleDatabase;
    using OJS.Workers.Executors.Implementations;
    using OJS.Workers.SubmissionProcessors.Models;

    public static class SubmissionProcessorHelper
    {
        public static IExecutionStrategy CreateExecutionStrategy(ExecutionStrategyType type, string submissionProcessorIdentifier)
        {
            IExecutionStrategy executionStrategy;
            var tasksService = new TasksService();
            var processExecutorFactory = new ProcessExecutorFactory(tasksService);
            switch (type)
            {
                case ExecutionStrategyType.CompileExecuteAndCheck:
                    executionStrategy = new CompileExecuteAndCheckExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.MsBuildBaseTimeUsedInMilliseconds,
                        Settings.MsBuildBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy:
                    executionStrategy = new CPlusPlusCompileExecuteAndCheckExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.GPlusPlusBaseTimeUsedInMilliseconds,
                        Settings.GPlusPlusBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy:
                    executionStrategy = new CPlusPlusZipFileExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.GPlusPlusBaseTimeUsedInMilliseconds,
                        Settings.GPlusPlusBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck:
                    executionStrategy = new DotNetCoreCompileExecuteAndCheckExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.DotNetCoreRuntimeVersion(type),
                        Settings.DotNetCscBaseTimeUsedInMilliseconds,
                        Settings.DotNetCscBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.GolangCompileExecuteAndCheck:
                    executionStrategy = new GolangCompileExecuteAndCheckExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.GolangBaseTimeUsedInMilliseconds,
                        Settings.GolangBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreUnitTestsExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.DotNetCliBaseTimeUsedInMilliseconds,
                        Settings.DotNetCliBaseMemoryUsedInBytes,
                        Settings.DotNetCoreTargetFrameworkName(type),
                        Settings.MicrosoftEntityFrameworkCoreInMemoryVersion(type),
                        Settings.MicrosoftEntityFrameworkCoreProxiesVersion(type));
                    break;
                case ExecutionStrategyType.CSharpUnitTestsExecutionStrategy:
                    executionStrategy = new CSharpUnitTestsExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.NUnitConsoleRunnerPath,
                        Settings.MsBuildBaseTimeUsedInMilliseconds,
                        Settings.MsBuildBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.CSharpProjectTestsExecutionStrategy:
                    executionStrategy = new CSharpProjectTestsExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.NUnitConsoleRunnerPath,
                        Settings.MsBuildBaseTimeUsedInMilliseconds,
                        Settings.MsBuildBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.DotNetCliBaseTimeUsedInMilliseconds,
                        Settings.DotNetCliBaseMemoryUsedInBytes);
                    break;

                case ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectTestsExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.DotNetCliBaseTimeUsedInMilliseconds,
                        Settings.DotNetCliBaseMemoryUsedInBytes,
                        Settings.DotNetCoreTargetFrameworkName(type),
                        Settings.MicrosoftEntityFrameworkCoreInMemoryVersion(type),
                        Settings.MicrosoftEntityFrameworkCoreProxiesVersion(type));
                    break;
                case ExecutionStrategyType.RubyExecutionStrategy:
                    executionStrategy = new RubyExecutionStrategy(
                        processExecutorFactory,
                        Settings.RubyPath,
                        Settings.RubyBaseTimeUsedInMilliseconds,
                        Settings.RubyBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                    executionStrategy = new JavaPreprocessCompileExecuteAndCheckExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.JavaExecutablePath,
                        Settings.JavaLibsPath,
                        Settings.JavaBaseTimeUsedInMilliseconds,
                        Settings.JavaBaseMemoryUsedInBytes,
                        Settings.JavaBaseUpdateTimeOffsetInMilliseconds);
                    break;
                case ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck:
                    executionStrategy = new JavaZipFileCompileExecuteAndCheckExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.JavaExecutablePath,
                        Settings.JavaLibsPath,
                        Settings.JavaBaseTimeUsedInMilliseconds,
                        Settings.JavaBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.JavaProjectTestsExecutionStrategy:
                    executionStrategy = new JavaProjectTestsExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.JavaExecutablePath,
                        Settings.JavaLibsPath,
                        Settings.JavaBaseTimeUsedInMilliseconds,
                        Settings.JavaBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.JavaUnitTestsExecutionStrategy:
                    executionStrategy = new JavaUnitTestsExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.JavaExecutablePath,
                        Settings.JavaLibsPath,
                        Settings.JavaBaseTimeUsedInMilliseconds,
                        Settings.JavaBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy:
                    executionStrategy = new JavaSpringAndHibernateProjectExecutionStrategy(
                        GetCompilerPath,
                        processExecutorFactory,
                        Settings.JavaExecutablePath,
                        Settings.JavaLibsPath,
                        Settings.MavenPath,
                        Settings.JavaBaseTimeUsedInMilliseconds,
                        Settings.JavaBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                    executionStrategy = new NodeJsPreprocessExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        Settings.NodeJsExecutablePath,
                        Settings.UnderscoreModulePath,
                        Settings.NodeJsBaseTimeUsedInMilliseconds * 2,
                        Settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy(
                        processExecutorFactory,
                        Settings.NodeJsExecutablePath,
                        Settings.MochaModulePath,
                        Settings.ChaiModulePath,
                        Settings.SinonModulePath,
                        Settings.SinonChaiModulePath,
                        Settings.UnderscoreModulePath,
                        Settings.NodeJsBaseTimeUsedInMilliseconds,
                        Settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMocha:
                    executionStrategy = new NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategy(
                        processExecutorFactory,
                        Settings.NodeJsExecutablePath,
                        Settings.MochaModulePath,
                        Settings.ChaiModulePath,
                        Settings.JsDomModulePath,
                        Settings.JQueryModulePath,
                        Settings.HandlebarsModulePath,
                        Settings.SinonModulePath,
                        Settings.SinonChaiModulePath,
                        Settings.UnderscoreModulePath,
                        Settings.BrowserifyModulePath,
                        Settings.BabelifyModulePath,
                        Settings.Es2015ImportPluginPath,
                        Settings.NodeJsBaseTimeUsedInMilliseconds,
                        Settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        Settings.NodeJsExecutablePath,
                        Settings.MochaModulePath,
                        Settings.ChaiModulePath,
                        Settings.JsDomModulePath,
                        Settings.JQueryModulePath,
                        Settings.HandlebarsModulePath,
                        Settings.SinonModulePath,
                        Settings.SinonChaiModulePath,
                        Settings.UnderscoreModulePath,
                        Settings.NodeJsBaseTimeUsedInMilliseconds,
                        Settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy(
                        processExecutorFactory,
                        Settings.NodeJsExecutablePath,
                        Settings.MochaModulePath,
                        Settings.ChaiModulePath,
                        Settings.JsDomModulePath,
                        Settings.JQueryModulePath,
                        Settings.HandlebarsModulePath,
                        Settings.SinonModulePath,
                        Settings.SinonChaiModulePath,
                        Settings.UnderscoreModulePath,
                        Settings.NodeJsBaseTimeUsedInMilliseconds,
                        Settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy:
                    executionStrategy = new NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy(
                        processExecutorFactory,
                        Settings.NodeJsExecutablePath,
                        Settings.MochaModulePath,
                        Settings.ChaiModulePath,
                        Settings.JsDomModulePath,
                        Settings.JQueryModulePath,
                        Settings.HandlebarsModulePath,
                        Settings.SinonJsDomModulePath,
                        Settings.SinonModulePath,
                        Settings.SinonChaiModulePath,
                        Settings.UnderscoreModulePath,
                        Settings.BabelCoreModulePath,
                        Settings.ReactJsxPluginPath,
                        Settings.ReactModulePath,
                        Settings.ReactDomModulePath,
                        Settings.NodeFetchModulePath,
                        Settings.NodeJsBaseTimeUsedInMilliseconds,
                        Settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy:
                    executionStrategy = new NodeJsZipExecuteHtmlAndCssStrategy(
                        processExecutorFactory,
                        Settings.NodeJsExecutablePath,
                        Settings.MochaModulePath,
                        Settings.ChaiModulePath,
                        Settings.SinonModulePath,
                        Settings.SinonChaiModulePath,
                        Settings.JsDomModulePath,
                        Settings.JQueryModulePath,
                        Settings.UnderscoreModulePath,
                        Settings.BootstrapModulePath,
                        Settings.BootstrapCssPath,
                        Settings.NodeJsBaseTimeUsedInMilliseconds,
                        Settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategy(
                        processExecutorFactory,
                        Settings.PythonExecutablePath,
                        Settings.JsProjNodeModules,
                        Settings.MochaModulePath,
                        Settings.ChaiModulePath,
                        Settings.PlaywrightChromiumModulePath,
                        Settings.JsProjDefaultApplicationPortNumber,
                        Settings.NodeJsBaseTimeUsedInMilliseconds,
                        Settings.NodeJsBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonExecuteAndCheck:
                    executionStrategy = new PythonExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        Settings.PythonExecutablePath,
                        Settings.PythonBaseTimeUsedInMilliseconds,
                        Settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonUnitTests:
                    executionStrategy = new PythonUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        Settings.PythonExecutablePath,
                        Settings.PythonBaseTimeUsedInMilliseconds,
                        Settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests:
                    executionStrategy = new PythonCodeExecuteAgainstUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        Settings.PythonExecutablePath,
                        Settings.PythonBaseTimeUsedInMilliseconds,
                        Settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonProjectTests:
                    executionStrategy = new PythonProjectTestsExecutionStrategy(
                        processExecutorFactory,
                        Settings.PythonExecutablePath,
                        Settings.PythonBaseTimeUsedInMilliseconds,
                        Settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.PythonProjectUnitTests:
                    executionStrategy = new PythonProjectUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        Settings.PythonExecutablePath,
                        Settings.PythonBaseTimeUsedInMilliseconds,
                        Settings.PythonBaseMemoryUsedInBytes);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries:
                    executionStrategy = new SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy(
                        Settings.SqlServerLocalDbMasterDbConnectionString,
                        Settings.SqlServerLocalDbRestrictedUserId,
                        Settings.SqlServerLocalDbRestrictedUserPassword,
                        submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy(
                        Settings.SqlServerLocalDbMasterDbConnectionString,
                        Settings.SqlServerLocalDbRestrictedUserId,
                        Settings.SqlServerLocalDbRestrictedUserPassword,
                        submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                            Settings.SqlServerLocalDbMasterDbConnectionString,
                            Settings.SqlServerLocalDbRestrictedUserId,
                            Settings.SqlServerLocalDbRestrictedUserPassword,
                            submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new MySqlPrepareDatabaseAndRunQueriesExecutionStrategy(
                        Settings.MySqlSysDbConnectionString,
                        Settings.MySqlRestrictedUserId,
                        Settings.MySqlRestrictedUserPassword);
                    break;
                case ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunQueriesAndCheckDatabaseExecutionStrategy(
                        Settings.MySqlSysDbConnectionString,
                        Settings.MySqlRestrictedUserId,
                        Settings.MySqlRestrictedUserPassword);
                    break;
                case ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                        Settings.MySqlSysDbConnectionString,
                        Settings.MySqlRestrictedUserId,
                        Settings.MySqlRestrictedUserPassword);
                    break;
                case ExecutionStrategyType.DoNothing:
                    executionStrategy = new DoNothingExecutionStrategy();
                    break;
                case ExecutionStrategyType.CheckOnly:
                    executionStrategy = new CheckOnlyExecutionStrategy(processExecutorFactory, 0, 0);
                    break;
                case ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy(
                        Settings.PostgreSqlMasterDbConnectionString,
                        Settings.PostgreSqlRestrictedUserId,
                        Settings.PostgreSqlRestrictedUserPassword,
                        submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase:
                    executionStrategy = new PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy(
                        Settings.PostgreSqlMasterDbConnectionString,
                        Settings.PostgreSqlRestrictedUserId,
                        Settings.PostgreSqlRestrictedUserPassword,
                        submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                            Settings.PostgreSqlMasterDbConnectionString,
                            Settings.PostgreSqlRestrictedUserId,
                            Settings.PostgreSqlRestrictedUserPassword,
                            submissionProcessorIdentifier);
                    break;
                case ExecutionStrategyType.PythonDjangoOrmExecutionStrategy:
                    executionStrategy = new PythonDjangoOrmExecutionStrategy(
                        processExecutorFactory,
                        Settings.PythonExecutablePathV311,
                        Settings.PipExecutablePathV311,
                        Settings.PythonV311BaseTimeUsedInMilliseconds,
                        Settings.PythonV311BaseMemoryUsedInBytes,
                        Settings.PythonV311InstallPackagesTimeUsedInMilliseconds);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            executionStrategy.Type = type;

            return executionStrategy;
        }

        public static IExecutionContext<TInput> CreateExecutionContext<TInput>(
            OjsSubmission<TInput> submission)
        {
            if (submission == null)
            {
                throw new ArgumentNullException(nameof(submission));
            }

            return new ExecutionContext<TInput>
            {
                AdditionalCompilerArguments = submission.AdditionalCompilerArguments,
                Code = submission.Code,
                FileContent = submission.FileContent,
                AllowedFileExtensions = submission.AllowedFileExtensions,
                CompilerType = submission.CompilerType,
                MemoryLimit = submission.MemoryLimit,
                TimeLimit = submission.TimeLimit,
                Input = submission.Input,
            };
        }

        private static string GetCompilerPath(CompilerType type)
        {
            switch (type)
            {
                case CompilerType.None:
                    return null;
                case CompilerType.CSharp:
                    return Settings.CSharpCompilerPath;
                case CompilerType.MsBuild:
                case CompilerType.MsBuildLibrary:
                    return Settings.MsBuildExecutablePath;
                case CompilerType.CPlusPlusGcc:
                case CompilerType.CPlusPlusZip:
                    return Settings.CPlusPlusGccCompilerPath;
                case CompilerType.Java:
                case CompilerType.JavaZip:
                case CompilerType.JavaInPlaceCompiler:
                    return Settings.JavaCompilerPath;
                case CompilerType.DotNetCompiler:
                case CompilerType.CSharpDotNetCore:
                    return Settings.DotNetCompilerPath;
                case CompilerType.GolangCompiler:
                    return Settings.GolangCompilerPath;
                case CompilerType.SolidityCompiler:
                    return Settings.SolidityCompilerPath;
                default:
                    throw new ArgumentOutOfRangeException(nameof(type));
            }
        }
    }
}