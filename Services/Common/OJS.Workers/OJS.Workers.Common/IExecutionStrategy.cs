namespace OJS.Workers.Common
{
    public interface IExecutionStrategy
    {
        Task<IExecutionResult<TResult>> SafeExecute<TInput, TResult>(IExecutionContext<TInput> executionContext)
            where TResult : ISingleCodeRunResult, new();
    }
}