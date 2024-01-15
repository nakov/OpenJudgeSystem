namespace OJS.Workers.ExecutionStrategies.Sql.SqlServerSingleDatabase
{
    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;

    public class SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy<TSettings> : BaseSqlServerSingleDatabaseExecutionStrategy<TSettings>
        where TSettings : SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings
    {
        public SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategy(IExecutionStrategySettingsProvider settingsProvider)
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
                    this.ExecuteNonQuery(connection, executionContext.Code, executionContext.TimeLimit);
                    var sqlTestResult = this.ExecuteReader(connection, test.Input);
                    ProcessSqlResult(sqlTestResult, executionContext, test, result);
                });
    }

#pragma warning disable SA1402
    public class SqlServerSingleDatabaseRunQueriesAndCheckDatabaseExecutionStrategySettings : BaseSqlServerSingleDatabaseExecutionStrategySettings
#pragma warning restore SA1402
    {
    }
}
