namespace OJS.Workers.ExecutionStrategies
{
    using System;
    using OJS.Workers.Common;
    using OJS.Workers.Executors;

    using static OJS.Workers.Common.Constants;

    public class BaseInterpretedCodeExecutionStrategy<TSettings> : BaseCodeExecutionStrategy<TSettings>
        where TSettings : BaseInterpretedCodeExecutionStrategySettings
    {
        protected BaseInterpretedCodeExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            IExecutionStrategySettingsProvider settingsProvider)
            : base(processExecutorFactory, settingsProvider)
        {
        }

        protected static string PrepareTestInput(string testInput)
            => string.Join(
                Environment.NewLine,
                testInput.Split(new[] { NewLineUnix, NewLineWin }, StringSplitOptions.None));

        protected override Task<IExecutionResult<TResult>> InternalExecute<TInput, TResult>(
            IExecutionContext<TInput> executionContext,
            IExecutionResult<TResult> result)
        {
            result.IsCompiledSuccessfully = true;

            return base.InternalExecute(executionContext, result);
        }
    }

#pragma warning disable SA1402
    public class BaseInterpretedCodeExecutionStrategySettings : BaseCodeExecutionStrategySettings
#pragma warning restore SA1402
    {
    }
}
