#nullable disable
namespace OJS.Services.Worker.Business.Implementations
{
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

    public class ExecutionStrategyFactory : IExecutionStrategyFactory
    {
        private readonly ICompilerFactory compilerFactory;
        private readonly IExecutionStrategySettingsProvider executionStrategySettingsProvider;

        public ExecutionStrategyFactory(
            ICompilerFactory compilerFactory,
            IExecutionStrategySettingsProvider executionStrategySettingsProvider)
        {
            this.compilerFactory = compilerFactory;
            this.executionStrategySettingsProvider = executionStrategySettingsProvider;
        }

        public IExecutionStrategy CreateExecutionStrategy(IOjsSubmission submission)
        {
            IExecutionStrategy executionStrategy;
            var tasksService = new TasksService();
            var processExecutorFactory = new ProcessExecutorFactory(tasksService);

            switch (submission.ExecutionStrategyType)
            {
                case ExecutionStrategyType.CompileExecuteAndCheck:
                    executionStrategy = new CompileExecuteAndCheckExecutionStrategy<CompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy:
                    executionStrategy = new CPlusPlusCompileExecuteAndCheckExecutionStrategy<CPlusPlusCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy:
                    executionStrategy = new CPlusPlusZipFileExecutionStrategy<CPlusPlusZipFileExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck:
                    executionStrategy = new DotNetCoreCompileExecuteAndCheckExecutionStrategy<DotNetCoreCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.GolangCompileExecuteAndCheck:
                    executionStrategy = new GolangCompileExecuteAndCheckExecutionStrategy<GolangCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreUnitTestsExecutionStrategy<DotNetCoreUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectExecutionStrategy<DotNetCoreProjectExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectTestsExecutionStrategy<DotNetCoreProjectTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                case ExecutionStrategyType.Java21PreprocessCompileExecuteAndCheck:
                    executionStrategy = new JavaPreprocessCompileExecuteAndCheckExecutionStrategy<JavaPreprocessCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck:
                case ExecutionStrategyType.Java21ZipFileCompileExecuteAndCheck:
                    executionStrategy = new JavaZipFileCompileExecuteAndCheckExecutionStrategy<JavaZipFileCompileExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaProjectTestsExecutionStrategy:
                case ExecutionStrategyType.Java21ProjectTestsExecutionStrategy:
                    executionStrategy = new JavaProjectTestsExecutionStrategy<JavaProjectTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaUnitTestsExecutionStrategy:
                case ExecutionStrategyType.Java21UnitTestsExecutionStrategy:
                    executionStrategy = new JavaUnitTestsExecutionStrategy<JavaUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy:
                case ExecutionStrategyType.Java21SpringAndHibernateProjectExecution:
                    executionStrategy = new JavaSpringAndHibernateProjectExecutionStrategy<JavaSpringAndHibernateProjectExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndCheck:
                    executionStrategy = new NodeJsPreprocessExecuteAndCheckExecutionStrategy<NodeJsPreprocessExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha:
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndRunUnitTestsWithMocha:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests:
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndRunJsDomUnitTests:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy<NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy:
                case ExecutionStrategyType.NodeJsV20ZipExecuteHtmlAndCssStrategy:
                    executionStrategy = new NodeJsZipExecuteHtmlAndCssStrategy<NodeJsZipExecuteHtmlAndCssStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategy<RunSpaAndExecuteMochaTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests<RunSpaAndExecuteMochaTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonExecuteAndCheck:
                    executionStrategy = new PythonExecuteAndCheckExecutionStrategy<PythonExecuteAndCheckExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonUnitTests:
                    executionStrategy = new PythonUnitTestsExecutionStrategy<PythonUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests:
                    executionStrategy = new PythonCodeExecuteAgainstUnitTestsExecutionStrategy<PythonCodeExecuteAgainstUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonProjectTests:
                    executionStrategy = new PythonProjectTestsExecutionStrategy<PythonProjectTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonProjectUnitTests:
                    executionStrategy = new PythonProjectUnitTestsExecutionStrategy<PythonProjectUnitTestsExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries:
                    executionStrategy = new SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy<SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new MySqlPrepareDatabaseAndRunQueriesExecutionStrategy<MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DoNothing:
                    executionStrategy = new DoNothingExecutionStrategy<DoNothingExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CheckOnly:
                    executionStrategy = new CheckOnlyExecutionStrategy<CheckOnlyExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy<PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase:
                    executionStrategy = new PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        submission,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                            submission,
                            this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonDjangoOrmExecutionStrategy:
                    executionStrategy = new PythonDjangoOrmExecutionStrategy<PythonDjangoOrmExecutionStrategySettings>(
                        submission,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NotFound:
                default:
                    throw new ArgumentOutOfRangeException(nameof(executionStrategy), "Invalid execution strategy type.");
            }

            return executionStrategy;
        }
    }
}