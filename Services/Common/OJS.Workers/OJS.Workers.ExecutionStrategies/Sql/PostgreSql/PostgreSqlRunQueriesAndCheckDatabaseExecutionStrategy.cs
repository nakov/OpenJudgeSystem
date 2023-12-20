﻿namespace OJS.Workers.ExecutionStrategies.Sql.PostgreSql
{
    using System.Data;
    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;

    public class PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy : BasePostgreSqlExecutionStrategy
    {
        public PostgreSqlRunQueriesAndCheckDatabaseExecutionStrategy(
            string masterDbConnectionString,
            string restrictedUserId,
            string restrictedUserPassword,
            string submissionProcessorIdentifier)
            : base(masterDbConnectionString, restrictedUserId, restrictedUserPassword, submissionProcessorIdentifier)
        {
        }

        protected override IExecutionResult<TestResult> ExecuteAgainstTestsInput(
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
    }
}
