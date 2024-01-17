#nullable disable
namespace OJS.Workers.ExecutionStrategies
{
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;

    public class DoNothingExecutionStrategy<TSettings> : BaseExecutionStrategy<TSettings>
        where TSettings : DoNothingExecutionStrategySettings
    {
        public DoNothingExecutionStrategy(
            ExecutionStrategyType type,
            IExecutionStrategySettingsProvider settingsProvider)
            : base(type, settingsProvider)
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

#pragma warning disable SA1402
    public class DoNothingExecutionStrategySettings : BaseExecutionStrategySettings
#pragma warning restore SA1402
    {
    }
}
