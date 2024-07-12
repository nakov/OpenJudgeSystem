#nullable disable
namespace OJS.Workers.ExecutionStrategies
{
    using Microsoft.Extensions.Logging;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;

    public class DoNothingExecutionStrategy<TSettings> : BaseExecutionStrategy<TSettings>
        where TSettings : DoNothingExecutionStrategySettings
    {
        public DoNothingExecutionStrategy(
            ExecutionStrategyType type,
            IExecutionStrategySettingsProvider settingsProvider,
            ILogger<BaseExecutionStrategy<TSettings>> logger)
            : base(type, settingsProvider, logger)
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

    public record DoNothingExecutionStrategySettings : BaseExecutionStrategySettings
    {
    }
}
