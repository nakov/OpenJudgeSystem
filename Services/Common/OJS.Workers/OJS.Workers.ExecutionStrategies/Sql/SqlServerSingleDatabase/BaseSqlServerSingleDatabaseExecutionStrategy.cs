#nullable disable
namespace OJS.Workers.ExecutionStrategies.Sql.SqlServerSingleDatabase
{
    using System.Data;
    using System.Data.SqlClient;
    using System.Transactions;

    using OJS.Workers.ExecutionStrategies.Sql.SqlServerLocalDb;

#pragma warning disable CA1001
    public abstract class BaseSqlServerSingleDatabaseExecutionStrategy : BaseSqlServerLocalDbExecutionStrategy
#pragma warning restore CA1001
    {
        private readonly string databaseNameForSubmissionProcessor;

        private TransactionScope transactionScope;

        protected BaseSqlServerSingleDatabaseExecutionStrategy(
            string masterDbConnectionString,
            string restrictedUserId,
            string restrictedUserPassword,
            string submissionProcessorIdentifier)
            : base(masterDbConnectionString, restrictedUserId, restrictedUserPassword)
            => this.databaseNameForSubmissionProcessor = $"worker_{submissionProcessorIdentifier}_DO_NOT_DELETE";

        protected override string RestrictedUserId => $"{this.GetDatabaseName()}_{base.RestrictedUserId}";

        private string WorkerDbConnectionString { get; set; }

        public override IDbConnection GetOpenConnection(string databaseName)
        {
            this.EnsureDatabaseIsSetup();

            this.transactionScope = new TransactionScope();
            var createdDbConnection = new SqlConnection(this.WorkerDbConnectionString);
            createdDbConnection.Open();

            return createdDbConnection;
        }

        public override void DropDatabase(string databaseName)
        {
            if (this.transactionScope != null)
            {
                this.transactionScope.Dispose();
            }
            else
            {
                base.DropDatabase(databaseName);
            }
        }

        public override string GetDatabaseName() => this.databaseNameForSubmissionProcessor;

        private void EnsureDatabaseIsSetup()
        {
            var databaseName = this.GetDatabaseName();

            using (var connection = new SqlConnection(this.MasterDbConnectionString))
            {
                connection.Open();

                var setupDatabaseQuery =
                    $@"IF DB_ID('{databaseName}') IS NULL
                    BEGIN
                    CREATE DATABASE [{databaseName}];
                    IF NOT EXISTS
                        (SELECT name
                         FROM master.sys.server_principals
                         WHERE name = '{this.RestrictedUserId}')
                        BEGIN
                            CREATE LOGIN [{this.RestrictedUserId}] WITH PASSWORD=N'{this.RestrictedUserPassword}',
                            DEFAULT_DATABASE=[master],
                            DEFAULT_LANGUAGE=[us_english],
                            CHECK_EXPIRATION=OFF,
                            CHECK_POLICY=ON;
                        END
                    END";

                var setupUserAsOwnerQuery = $@"
                    USE [{databaseName}];
                    IF IS_ROLEMEMBER('db_owner', '{this.RestrictedUserId}') = 0 OR IS_ROLEMEMBER('db_owner', '{this.RestrictedUserId}') is NULL
                    BEGIN
                    CREATE USER [{this.RestrictedUserId}] FOR LOGIN [{this.RestrictedUserId}];
                    ALTER ROLE [db_owner] ADD MEMBER [{this.RestrictedUserId}];
                    END";

                this.ExecuteNonQuery(connection, setupDatabaseQuery);
                this.ExecuteNonQuery(connection, setupUserAsOwnerQuery);
            }

            this.WorkerDbConnectionString = this.BuildWorkerDbConnectionString(databaseName);
        }
    }
}