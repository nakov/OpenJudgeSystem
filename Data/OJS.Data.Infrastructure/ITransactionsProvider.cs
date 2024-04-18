namespace OJS.Data.Infrastructure;

using System;
using System.Threading.Tasks;

public interface ITransactionsProvider
{
    Task ExecuteInTransaction(Func<Task> action);

    Task<T> ExecuteInTransaction<T>(Func<Task<T>> action);
}
