namespace OJS.Workers.Common
{
    public interface IExecutionStrategy
    {
        Task<IExecutionResult<TResult>> SafeExecute<TInput, TResult>(
            IExecutionContext<TInput> executionContext,
            int submissionId)
            where TResult : ISingleCodeRunResult, new();
    }
}