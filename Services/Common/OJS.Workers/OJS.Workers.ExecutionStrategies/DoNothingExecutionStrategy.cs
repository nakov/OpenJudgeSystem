#nullable disable
namespace OJS.Workers.ExecutionStrategies
{
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;

    public class DoNothingExecutionStrategy : BaseExecutionStrategy
    {
        public DoNothingExecutionStrategy(IExecutionStrategySettings settings)
            : base(settings)
        {
        }

        protected override Task<IExecutionResult<TResult>> InternalExecute<TInput, TResult>(
            IExecutionContext<TInput> executionContext,
            IExecutionResult<TResult> result)
        {
            result.CompilerComment = null;
            result.IsCompiledSuccessfully = true;

            return Task.FromResult(result);
        }
    }
}
