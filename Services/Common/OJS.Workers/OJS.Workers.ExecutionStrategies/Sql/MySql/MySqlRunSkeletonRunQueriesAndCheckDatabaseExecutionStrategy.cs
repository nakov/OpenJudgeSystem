namespace OJS.Workers.ExecutionStrategies.Sql.MySql
{
    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;

    public class MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy : BaseMySqlExecutionStrategy
    {
        public MySqlRunSkeletonRunQueriesAndCheckDatabaseExecutionStrategy(StrategySettings settings)
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
                    this.ExecuteNonQuery(connection, executionContext.Input.TaskSkeletonAsString);
                    this.ExecuteNonQuery(connection, executionContext.Code, executionContext.TimeLimit);
                    var sqlTestResult = this.ExecuteReader(connection, test.Input);
                    ProcessSqlResult(sqlTestResult, executionContext, test, result);
                });

        public new class StrategySettings : BaseMySqlExecutionStrategy.StrategySettings
        {
        }
    }
}
