#nullable disable
namespace OJS.Workers.ExecutionStrategies
{
    using OJS.Workers.Common;

    public class DoNothingExecutionStrategy : BaseExecutionStrategy
    {
        protected override IExecutionResult<TResult> InternalExecute<TInput, TResult>(
            IExecutionContext<TInput> executionContext,
            IExecutionResult<TResult> result)
        {
            result.CompilerComment = null;
            result.IsCompiledSuccessfully = true;

            return result;
        }
    }
}
