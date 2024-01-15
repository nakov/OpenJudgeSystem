namespace OJS.Workers.ExecutionStrategies.Sql.PostgreSql
{
    using System.Data;
    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;

    public class PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy : BasePostgreSqlExecutionStrategy
    {
        public PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy(StrategySettings settings)
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
                    var sqlTestResult = this.ExecuteReader(connection, test.Input);
                    ProcessSqlResult(sqlTestResult, executionContext, test, result);
                });

        protected override void ExecuteBeforeTests(IDbConnection connection, IExecutionContext<TestsInputModel>
            executionContext)
            => this.ExecuteNonQuery(connection, executionContext.Code, executionContext.TimeLimit);

        public new class StrategySettings : BasePostgreSqlExecutionStrategy.StrategySettings
        {
        }
    }
}
