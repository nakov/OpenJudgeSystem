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
    using OJS.Workers.ExecutionStrategies.NodeJs.V20;

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

        public IExecutionStrategy CreateExecutionStrategy(
            ExecutionStrategyType type)
        {
            IExecutionStrategy executionStrategy;
            var tasksService = new TasksService();
            var processExecutorFactory = new ProcessExecutorFactory(tasksService);

            switch (type)
            {
                case ExecutionStrategyType.CompileExecuteAndCheck:
                    executionStrategy = new CompileExecuteAndCheckExecutionStrategy<CompileExecuteAndCheckExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy:
                    executionStrategy = new CPlusPlusCompileExecuteAndCheckExecutionStrategy<CPlusPlusCompileExecuteAndCheckExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy:
                    executionStrategy = new CPlusPlusZipFileExecutionStrategy<CPlusPlusZipFileExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck:
                    executionStrategy = new DotNetCoreCompileExecuteAndCheckExecutionStrategy<DotNetCoreCompileExecuteAndCheckExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.GolangCompileExecuteAndCheck:
                    executionStrategy = new GolangCompileExecuteAndCheckExecutionStrategy<GolangCompileExecuteAndCheckExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreUnitTestsExecutionStrategy<DotNetCoreUnitTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectExecutionStrategy<DotNetCoreProjectExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectTestsExecutionStrategy<DotNetCoreProjectTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                case ExecutionStrategyType.Java21PreprocessCompileExecuteAndCheck:
                    executionStrategy = new JavaPreprocessCompileExecuteAndCheckExecutionStrategy<JavaPreprocessCompileExecuteAndCheckExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck:
                case ExecutionStrategyType.Java21ZipFileCompileExecuteAndCheck:
                    executionStrategy = new JavaZipFileCompileExecuteAndCheckExecutionStrategy<JavaZipFileCompileExecuteAndCheckExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaProjectTestsExecutionStrategy:
                case ExecutionStrategyType.Java21ProjectTestsExecutionStrategy:
                    executionStrategy = new JavaProjectTestsExecutionStrategy<JavaProjectTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaUnitTestsExecutionStrategy:
                case ExecutionStrategyType.Java21UnitTestsExecutionStrategy:
                    executionStrategy = new JavaUnitTestsExecutionStrategy<JavaUnitTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy:
                case ExecutionStrategyType.Java21SpringAndHibernateProjectExecution:
                    executionStrategy = new JavaSpringAndHibernateProjectExecutionStrategy<JavaSpringAndHibernateProjectExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                    executionStrategy = new NodeJsPreprocessExecuteAndCheckExecutionStrategy<NodeJsPreprocessExecuteAndCheckExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy<NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsV20PreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                    executionStrategy = new NodeJsV20PreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy:
                    executionStrategy = new NodeJsZipExecuteHtmlAndCssStrategy<NodeJsZipExecuteHtmlAndCssStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategy<RunSpaAndExecuteMochaTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategySeparateTests<RunSpaAndExecuteMochaTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonExecuteAndCheck:
                    executionStrategy = new PythonExecuteAndCheckExecutionStrategy<PythonExecuteAndCheckExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonUnitTests:
                    executionStrategy = new PythonUnitTestsExecutionStrategy<PythonUnitTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests:
                    executionStrategy = new PythonCodeExecuteAgainstUnitTestsExecutionStrategy<PythonCodeExecuteAgainstUnitTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonProjectTests:
                    executionStrategy = new PythonProjectTestsExecutionStrategy<PythonProjectTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonProjectUnitTests:
                    executionStrategy = new PythonProjectUnitTestsExecutionStrategy<PythonProjectUnitTestsExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries:
                    executionStrategy = new SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy<SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new MySqlPrepareDatabaseAndRunQueriesExecutionStrategy<MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DoNothing:
                    executionStrategy = new DoNothingExecutionStrategy<DoNothingExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CheckOnly:
                    executionStrategy = new CheckOnlyExecutionStrategy<CheckOnlyExecutionStrategySettings>(
                        type,
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy<PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase:
                    executionStrategy = new PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        type,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                            type,
                            this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonDjangoOrmExecutionStrategy:
                    executionStrategy = new PythonDjangoOrmExecutionStrategy<PythonDjangoOrmExecutionStrategySettings>(
                        type,
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