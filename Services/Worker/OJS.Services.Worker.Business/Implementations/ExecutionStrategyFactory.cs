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
                    executionStrategy = new CompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<CompileExecuteAndCheckExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.CPlusPlusCompileExecuteAndCheckExecutionStrategy:
                    executionStrategy = new CPlusPlusCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<CPlusPlusCompileExecuteAndCheckExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.CPlusPlusZipFileExecutionStrategy:
                    executionStrategy = new CPlusPlusZipFileExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<CPlusPlusZipFileExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck:
                case ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck:
                    executionStrategy = new DotNetCoreCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<DotNetCoreCompileExecuteAndCheckExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.GolangCompileExecuteAndCheck:
                    executionStrategy = new GolangCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<GolangCompileExecuteAndCheckExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.DotNetCoreUnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5UnitTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6UnitTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<DotNetCoreUnitTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<DotNetCoreProjectExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy:
                case ExecutionStrategyType.DotNetCore6ProjectTestsExecutionStrategy:
                    executionStrategy = new DotNetCoreProjectTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<DotNetCoreProjectTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.JavaPreprocessCompileExecuteAndCheck:
                    executionStrategy = new JavaPreprocessCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<JavaPreprocessCompileExecuteAndCheckExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.JavaZipFileCompileExecuteAndCheck:
                    executionStrategy = new JavaZipFileCompileExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<JavaZipFileCompileExecuteAndCheckExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.JavaProjectTestsExecutionStrategy:
                    executionStrategy = new JavaProjectTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<JavaProjectTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.JavaUnitTestsExecutionStrategy:
                    executionStrategy = new JavaUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<JavaUnitTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.JavaSpringAndHibernateProjectExecutionStrategy:
                    executionStrategy = new JavaSpringAndHibernateProjectExecutionStrategy(
                        processExecutorFactory,
                        this.compilerFactory,
                        this.executionStrategySettingsProvider.GetSettings<JavaSpringAndHibernateProjectExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndCheck:
                    executionStrategy = new NodeJsPreprocessExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<NodeJsPreprocessExecuteAndCheckExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunUnitTestsWithMocha:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMocha:
                    executionStrategy = new NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunJsDomUnitTests:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy:
                    executionStrategy = new NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy:
                    executionStrategy = new NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.NodeJsZipExecuteHtmlAndCssStrategy:
                    executionStrategy = new NodeJsZipExecuteHtmlAndCssStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<NodeJsZipExecuteHtmlAndCssStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.RunSpaAndExecuteMochaTestsExecutionStrategy:
                    executionStrategy = new RunSpaAndExecuteMochaTestsExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<RunSpaAndExecuteMochaTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PythonExecuteAndCheck:
                    executionStrategy = new PythonExecuteAndCheckExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<PythonExecuteAndCheckExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PythonUnitTests:
                    executionStrategy = new PythonUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<PythonUnitTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PythonCodeExecuteAgainstUnitTests:
                    executionStrategy = new PythonCodeExecuteAgainstUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<PythonCodeExecuteAgainstUnitTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PythonProjectTests:
                    executionStrategy = new PythonProjectTestsExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<PythonProjectTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PythonProjectUnitTests:
                    executionStrategy = new PythonProjectUnitTestsExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<PythonProjectUnitTestsExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabasePrepareDatabaseAndRunQueries:
                    executionStrategy = new SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<SqlServerSingleDatabaseRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.MySqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new MySqlPrepareDatabaseAndRunQueriesExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<MySqlPrepareDatabaseAndRunQueriesExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.MySqlRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<MySqlRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.MySqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy = new MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.DoNothing:
                    executionStrategy = new DoNothingExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<IExecutionStrategySettings>(type));
                    break;
                case ExecutionStrategyType.CheckOnly:
                    executionStrategy = new CheckOnlyExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<CheckOnlyExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PostgreSqlPrepareDatabaseAndRunQueries:
                    executionStrategy = new PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<PostgreSqlPrepareDatabaseAndRunQueriesExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PostgreSqlRunQueriesAndCheckDatabase:
                    executionStrategy = new PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy(
                        this.executionStrategySettingsProvider.GetSettings<PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PostgreSqlRunSkeletonRunQueriesAndCheckDatabase:
                    executionStrategy =
                        new PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(
                            this.executionStrategySettingsProvider.GetSettings<PostgreSqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy.StrategySettings>(type) !);
                    break;
                case ExecutionStrategyType.PythonDjangoOrmExecutionStrategy:
                    executionStrategy = new PythonDjangoOrmExecutionStrategy(
                        processExecutorFactory,
                        this.executionStrategySettingsProvider.GetSettings<PythonDjangoOrmExecutionStrategy.StrategySettings>(type) !);
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