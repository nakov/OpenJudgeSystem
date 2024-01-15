namespace OJS.Workers.ExecutionStrategies.Sql.SqlServerSingleDatabase
{
    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;

    public class SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy : BaseSqlServerSingleDatabaseExecutionStrategy
    {
        public SqlServerSingleDatabasePrepareDatabaseAndRunQueriesExecutionStrategy(StrategySettings settings)
            : base(settings)
            => this.Settings = settings;

        protected override StrategySettings Settings { get; }

        protected override Task<IExecutionResult<TestResult>> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
            => this.Execute(
                executionContext,
                result,
                (connection, test) =>
                {
                    this.ExecuteNonQuery(connection, test.Input);
                    var sqlTestResult = this.ExecuteReader(connection, executionContext.Code, executionContext.TimeLimit);
                    ProcessSqlResult(sqlTestResult, executionContext, test, result);
                });

        public new class StrategySettings : BaseSqlServerSingleDatabaseExecutionStrategy.StrategySettings
        {
        }
    }
}
