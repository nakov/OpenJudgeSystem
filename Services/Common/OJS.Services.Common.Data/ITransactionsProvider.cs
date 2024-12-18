namespace OJS.Services.Common.Data;

using System;
using System.Data;
using System.Threading.Tasks;

public interface ITransactionsProvider
{
    Task ExecuteInTransaction(Func<Task> action);

    Task ExecuteInTransaction(Func<Task> action, IsolationLevel isolationLevel);

    Task<T> ExecuteInTransaction<T>(Func<Task<T>> action);

    Task<T> ExecuteInTransaction<T>(Func<Task<T>> action, IsolationLevel isolationLevel);
}
