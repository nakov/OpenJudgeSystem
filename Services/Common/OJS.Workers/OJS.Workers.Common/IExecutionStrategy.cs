namespace OJS.Workers.Common
{
    using OJS.Workers.Common.Models;

    public interface IExecutionStrategy
    {
        ExecutionStrategyType Type { get; set; }

        Task<IExecutionResult<TResult>> SafeExecute<TInput, TResult>(IExecutionContext<TInput> executionContext)
            where TResult : ISingleCodeRunResult, new();
    }
}