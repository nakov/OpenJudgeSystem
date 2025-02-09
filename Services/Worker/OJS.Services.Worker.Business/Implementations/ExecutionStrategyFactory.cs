#nullable disable
namespace OJS.Services.Worker.Business.Implementations
{
    using Microsoft.Extensions.Logging;
    using OJS.Services.Worker.Business.Extensions;
    using System;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.Compilers;
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
    using OJS.Workers.Executors.Implementations;
    using OJS.Workers.Executors;

    public class ExecutionStrategyFactory : IExecutionStrategyFactory
    {
        private readonly ICompilerFactory compilerFactory;
        private readonly IExecutionStrategySettingsProvider executionStrategySettingsProvider;
        private readonly ILoggerFactory loggerFactory;

        public ExecutionStrategyFactory(
            ICompilerFactory compilerFactory,
            IExecutionStrategySettingsProvider executionStrategySettingsProvider,
            ILoggerFactory loggerFactory)
        {
            this.compilerFactory = compilerFactory;
            this.executionStrategySettingsProvider = executionStrategySettingsProvider;
            this.loggerFactory = loggerFactory;
        }

        public IExecutionStrategy CreateExecutionStrategy(IOjsSubmission submission)
        {
            IExecutionStrategy executionStrategy;
            var submissionId = submission.Id.ToString()!;
            var verbosely = submission.Verbosely;
            var tasksService = new TasksService();
            var processExecutorFactory = new ProcessExecutorFactory(
                tasksService,
                this.loggerFactory.CreateLogger<StandardProcessExecutor>());

            switch (submission.ExecutionStrategyType)
            {
                case ExecutionStrategyType.CompileExecuteAndCheck:
                    executionStrategy = new CompileExecuteAndCheckExecutionStrategy<CompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<CompileExecuteAndCheckExecutionStrategy<CompileExecuteAndCheckExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy:
                    executionStrategy = new CPlusPlusCompileExecuteAndCheckExecutionStrategy<CPlusPlusCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<CPlusPlusCompileExecuteAndCheckExecutionStrategy<CPlusPlusCompileExecuteAndCheckExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy:
                    executionStrategy = new CPlusPlusZipFileExecutionStrategy<CPlusPlusZipFileExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<CPlusPlusZipFileExecutionStrategy<CPlusPlusZipFileExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck:
                    executionStrategy = new DotNetCoreCompileExecuteAndCheckExecutionStrategy<DotNetCoreCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<DotNetCoreCompileExecuteAndCheckExecutionStrategy<DotNetCoreCompileExecuteAndCheckExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.GolangCompileExecuteAndCheck:
                    executionStrategy = new GolangCompileExecuteAndCheckExecutionStrategy<GolangCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<GolangCompileExecuteAndCheckExecutionStrategy<GolangCompileExecuteAndCheckExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreUnitTestsExecutionStrategy<DotNetCoreUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<DotNetCoreUnitTestsExecutionStrategy<DotNetCoreUnitTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.DotNetCoreProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectExecutionStrategy<DotNetCoreProjectExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<DotNetCoreProjectExecutionStrategy<DotNetCoreProjectExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectTestsExecutionStrategy<DotNetCoreProjectTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<DotNetCoreProjectTestsExecutionStrategy<DotNetCoreProjectTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                case ExecutionStrategyType.Java21PreprocessCompileExecuteAndCheck:
                    executionStrategy = new JavaPreprocessCompileExecuteAndCheckExecutionStrategy<JavaPreprocessCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<JavaPreprocessCompileExecuteAndCheckExecutionStrategy<JavaPreprocessCompileExecuteAndCheckExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck:
                case ExecutionStrategyType.Java21ZipFileCompileExecuteAndCheck:
                    executionStrategy = new JavaZipFileCompileExecuteAndCheckExecutionStrategy<JavaZipFileCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<JavaZipFileCompileExecuteAndCheckExecutionStrategy<JavaZipFileCompileExecuteAndCheckExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.JavaProjectTestsExecutionStrategy:
                case ExecutionStrategyType.Java21ProjectTestsExecutionStrategy:
                    executionStrategy = new JavaProjectTestsExecutionStrategy<JavaProjectTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<JavaProjectTestsExecutionStrategy<JavaProjectTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.JavaUnitTestsExecutionStrategy:
                case ExecutionStrategyType.Java21UnitTestsExecutionStrategy:
                    executionStrategy = new JavaUnitTestsExecutionStrategy<JavaUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<JavaUnitTestsExecutionStrategy<JavaUnitTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy:
                case ExecutionStrategyType.Java21SpringAndHibernateProjectExecution:
                    executionStrategy = new JavaSpringAndHibernateProjectExecutionStrategy<JavaSpringAndHibernateProjectExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<JavaSpringAndHibernateProjectExecutionStrategy<JavaSpringAndHibernateProjectExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndCheck:
                    executionStrategy = new NodeJsPreprocessExecuteAndCheckExecutionStrategy<NodeJsPreprocessExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<NodeJsPreprocessExecuteAndCheckExecutionStrategy<NodeJsPreprocessExecuteAndCheckExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha:
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndRunUnitTestsWithMocha:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests:
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndRunJsDomUnitTests:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy<NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy<NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy:
                    executionStrategy = new NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy<NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy<NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy:
                case ExecutionStrategyType.NodeJsV20ZipExecuteHtmlAndCssStrategy:
                    executionStrategy = new NodeJsZipExecuteHtmlAndCssStrategy<NodeJsZipExecuteHtmlAndCssStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<NodeJsZipExecuteHtmlAndCssStrategy<NodeJsZipExecuteHtmlAndCssStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategy<RunSpaAndExecuteMochaTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<RunSpaAndExecuteMochaTestsExecutionStrategy<RunSpaAndExecuteMochaTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.NodeJsV20RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests:
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests<RunSpaAndExecuteMochaTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests<RunSpaAndExecuteMochaTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PythonExecuteAndCheck:
                    executionStrategy = new PythonExecuteAndCheckExecutionStrategy<PythonExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<PythonExecuteAndCheckExecutionStrategy<PythonExecuteAndCheckExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PythonUnitTests:
                    executionStrategy = new PythonUnitTestsExecutionStrategy<PythonUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<PythonUnitTestsExecutionStrategy<PythonUnitTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests:
                    executionStrategy = new PythonCodeExecuteAgainstUnitTestsExecutionStrategy<PythonCodeExecuteAgainstUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<PythonCodeExecuteAgainstUnitTestsExecutionStrategy<PythonCodeExecuteAgainstUnitTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PythonProjectTests:
                    executionStrategy = new PythonProjectTestsExecutionStrategy<PythonProjectTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<PythonProjectTestsExecutionStrategy<PythonProjectTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PythonProjectUnitTests:
                    executionStrategy = new PythonProjectUnitTestsExecutionStrategy<PythonProjectUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<PythonProjectUnitTestsExecutionStrategy<PythonProjectUnitTestsExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries:
                    executionStrategy = new SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy<SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy<SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new MySqlPrepareDatabaseAndRunQueriesExecutionStrategy<MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<MySqlPrepareDatabaseAndRunQueriesExecutionStrategy<MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<MySqlRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunQueriesAndCheckDatabaseExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.DoNothing:
                    executionStrategy = new DoNothingExecutionStrategy<DoNothingExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<DoNothingExecutionStrategy<DoNothingExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.CheckOnly:
                    executionStrategy = new CheckOnlyExecutionStrategy<CheckOnlyExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<CheckOnlyExecutionStrategy<CheckOnlyExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy<PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy<PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase:
                    executionStrategy = new PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                            submission,
                            this.executionStrategySettingsProvider,
                            this.loggerFactory.CreateStrategyLogger<PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.PythonDjangoOrmExecutionStrategy:
                    executionStrategy = new PythonDjangoOrmExecutionStrategy<PythonDjangoOrmExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider,
                        this.loggerFactory.CreateStrategyLogger<PythonDjangoOrmExecutionStrategy<PythonDjangoOrmExecutionStrategySettings>>(submissionId, verbosely));
                    break;
                case ExecutionStrategyType.NotFound:
                default:
                    throw new ArgumentOutOfRangeException(nameof(executionStrategy), "Invalid execution strategy type.");
            }

            return executionStrategy;
        }
    }
}