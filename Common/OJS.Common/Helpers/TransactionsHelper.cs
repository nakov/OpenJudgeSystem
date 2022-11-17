namespace OJS.Common.Helpers
{
    using System.Transactions;

    using IsolationLevel = System.Transactions.IsolationLevel;

    public static class TransactionsHelper
    {
        public static TransactionScope CreateTransactionScope() => new TransactionScope();

        public static TransactionScope CreateTransactionScope(
            IsolationLevel isolationLevel,
            TransactionScopeAsyncFlowOption asyncFlowOption)
        {
            var transactionOptions = new TransactionOptions
            {
                IsolationLevel = isolationLevel,
            };

            return new TransactionScope(TransactionScopeOption.Required, transactionOptions, asyncFlowOption);
        }

        public static TransactionScope CreateLongRunningTransactionScope(
            IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
        {
            var transactionOptions = new TransactionOptions
            {
                IsolationLevel = isolationLevel,
                Timeout = TransactionManager.MaximumTimeout,
            };

            return new TransactionScope(TransactionScopeOption.Required, transactionOptions);
        }
    }
}