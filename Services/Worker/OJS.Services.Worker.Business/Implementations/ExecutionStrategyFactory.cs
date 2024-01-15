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
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy:
                    executionStrategy = new CPlusPlusCompileExecuteAndCheckExecutionStrategy<CPlusPlusCompileExecuteAndCheckExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy:
                    executionStrategy = new CPlusPlusZipFileExecutionStrategy<CPlusPlusZipFileExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck:
                    executionStrategy = new DotNetCoreCompileExecuteAndCheckExecutionStrategy<DotNetCoreCompileExecuteAndCheckExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.GolangCompileExecuteAndCheck:
                    executionStrategy = new GolangCompileExecuteAndCheckExecutionStrategy<GolangCompileExecuteAndCheckExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreUnitTestsExecutionStrategy<DotNetCoreUnitTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectExecutionStrategy<DotNetCoreProjectExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectTestsExecutionStrategy<DotNetCoreProjectTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                    executionStrategy = new JavaPreprocessCompileExecuteAndCheckExecutionStrategy<JavaPreprocessCompileExecuteAndCheckExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck:
                    executionStrategy = new JavaZipFileCompileExecuteAndCheckExecutionStrategy<JavaZipFileCompileExecuteAndCheckExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaProjectTestsExecutionStrategy:
                    executionStrategy = new JavaProjectTestsExecutionStrategy<JavaProjectTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaUnitTestsExecutionStrategy:
                    executionStrategy = new JavaUnitTestsExecutionStrategy<JavaUnitTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy:
                    executionStrategy = new JavaSpringAndHibernateProjectExecutionStrategy<JavaSpringAndHibernateProjectExecutionStrategySettings>(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                    executionStrategy = new NodeJsPreprocessExecuteAndCheckExecutionStrategy<NodeJsPreprocessExecuteAndCheckExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMocha:
                    executionStrategy = new NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategy<NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy<NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy:
                    executionStrategy = new NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy<NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy:
                    executionStrategy = new NodeJsZipExecuteHtmlAndCssStrategy<NodeJsZipExecuteHtmlAndCssStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategy<RunSpaAndExecuteMochaTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonExecuteAndCheck:
                    executionStrategy = new PythonExecuteAndCheckExecutionStrategy<PythonExecuteAndCheckExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonUnitTests:
                    executionStrategy = new PythonUnitTestsExecutionStrategy<PythonUnitTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests:
                    executionStrategy = new PythonCodeExecuteAgainstUnitTestsExecutionStrategy<PythonCodeExecuteAgainstUnitTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonProjectTests:
                    executionStrategy = new PythonProjectTestsExecutionStrategy<PythonProjectTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonProjectUnitTests:
                    executionStrategy = new PythonProjectUnitTestsExecutionStrategy<PythonProjectUnitTestsExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries:
                    executionStrategy = new SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy<SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new MySqlPrepareDatabaseAndRunQueriesExecutionStrategy<MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.DoNothing:
                    executionStrategy = new DoNothingExecutionStrategy<DoNothingExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.CheckOnly:
                    executionStrategy = new CheckOnlyExecutionStrategy<CheckOnlyExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy<PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase:
                    executionStrategy = new PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy<PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategySettings>(
                            this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.PythonDjangoOrmExecutionStrategy:
                    executionStrategy = new PythonDjangoOrmExecutionStrategy<PythonDjangoOrmExecutionStrategySettings>(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider);
                    break;
                case ExecutionStrategyType.NotFound:
                default:
                    throw new ArgumentOutOfRangeException(nameof(executionStrategy), "Invalid execution strategy type.");
            }

            executionStrategy.Type = type;

            return executionStrategy;
        }
    }
}