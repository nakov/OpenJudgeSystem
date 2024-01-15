namespace OJS.Workers.ExecutionStrategies.Sql.MySql
{
    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;

    public class MySqlPrepareDatabaseAndRunQueriesExecutionStrategy<TSettings> : BaseMySqlExecutionStrategy<TSettings>
        where TSettings : MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings
    {
        public MySqlPrepareDatabaseAndRunQueriesExecutionStrategy(IExecutionStrategySettingsProvider settingsProvider)
            : base(settingsProvider)
        {
        }

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
    }

#pragma warning disable SA1402
    public class MySqlPrepareDatabaseAndRunQueriesExecutionStrategySettings : BaseMySqlExecutionStrategySettings
#pragma warning restore SA1402
    {
    }
}
