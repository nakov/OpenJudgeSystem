namespace OJS.Services.Common.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using System;
    using System.Data;
    using System.Threading.Tasks;

    public class TransactionsProvider<TDbContext> : ITransactionsProvider
        where TDbContext : DbContext
    {
        public TransactionsProvider(TDbContext db) => this.Db = db;

        private DbContext Db { get; set; }

        public async Task ExecuteInTransaction(Func<Task> action)
        {
            await using var transaction = await this.Db.Database.BeginTransactionAsync();
            await action();
            await transaction.CommitAsync();
        }

        public async Task ExecuteInTransaction(Func<Task> action, IsolationLevel isolationLevel)
        {
            await using var transaction = await this.Db.Database.BeginTransactionAsync(isolationLevel);
            await action();
            await transaction.CommitAsync();
        }

        public async Task<T> ExecuteInTransaction<T>(Func<Task<T>> action)
        {
            await using var transaction = await this.Db.Database.BeginTransactionAsync();
            var result = await action();
            await transaction.CommitAsync();
            return result;
        }

        public async Task<T> ExecuteInTransaction<T>(Func<Task<T>> action, IsolationLevel isolationLevel)
        {
            await using var transaction = await this.Db.Database.BeginTransactionAsync(isolationLevel);
            var result = await action();
            await transaction.CommitAsync();
            return result;
        }
    }
}