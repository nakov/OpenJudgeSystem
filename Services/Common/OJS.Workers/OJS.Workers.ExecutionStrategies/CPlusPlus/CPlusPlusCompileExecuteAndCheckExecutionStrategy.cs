namespace OJS.Workers.ExecutionStrategies.CPlusPlus
{
    using OJS.Workers.Common;
    using OJS.Workers.Compilers;
    using OJS.Workers.ExecutionStrategies.Extensions;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class CPlusPlusCompileExecuteAndCheckExecutionStrategy<TSettings> : CompileExecuteAndCheckExecutionStrategy<TSettings>
        where TSettings : CPlusPlusCompileExecuteAndCheckExecutionStrategySettings
    {
        public CPlusPlusCompileExecuteAndCheckExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            ICompilerFactory compilerFactory,
            IExecutionStrategySettingsProvider settingsProvider)
            : base(processExecutorFactory, compilerFactory, settingsProvider)
        {
        }

        protected override Task<IExecutionResult<TestResult>> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            executionContext.SanitizeContent();

            return this.CompileExecuteAndCheck(
                executionContext,
                result,
                this.CreateExecutor(),
                useSystemEncoding: false,
                dependOnExitCodeForRunTimeError: true);
        }
    }

#pragma warning disable SA1402
    public class CPlusPlusCompileExecuteAndCheckExecutionStrategySettings : CompileExecuteAndCheckExecutionStrategySettings
#pragma warning restore SA1402
    {
    }
}
