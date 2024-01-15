namespace OJS.Workers.ExecutionStrategies
{
    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class CheckOnlyExecutionStrategy<TSettings> : BaseCodeExecutionStrategy<TSettings>
        where TSettings : CheckOnlyExecutionStrategySettings
    {
        public CheckOnlyExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            IExecutionStrategySettingsProvider settingsProvider)
            : base(processExecutorFactory, settingsProvider)
        {
        }

        protected override Task<IExecutionResult<TestResult>> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            result.IsCompiledSuccessfully = true;

            var processExecutionResult = new ProcessExecutionResult
            {
                Type = ProcessExecutionResultType.Success,
                ReceivedOutput = executionContext.Code,
            };

            var checker = executionContext.Input.GetChecker();

            foreach (var test in executionContext.Input.Tests)
            {
                var testResult = CheckAndGetTestResult(
                    test,
                    processExecutionResult,
                    checker,
                    processExecutionResult.ReceivedOutput);

                result.Results.Add(testResult);
            }

            return Task.FromResult(result);
        }
    }

#pragma warning disable SA1402
    public class CheckOnlyExecutionStrategySettings : BaseCodeExecutionStrategySettings
#pragma warning restore SA1402
    {
    }
}
