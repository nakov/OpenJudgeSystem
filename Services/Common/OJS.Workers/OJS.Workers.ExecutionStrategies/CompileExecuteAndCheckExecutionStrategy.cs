namespace OJS.Workers.ExecutionStrategies
{
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.Compilers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class CompileExecuteAndCheckExecutionStrategy<TSettings> : BaseCompiledCodeExecutionStrategy<TSettings>
        where TSettings : CompileExecuteAndCheckExecutionStrategySettings
    {
        public CompileExecuteAndCheckExecutionStrategy(
            ExecutionStrategyType type,
            IProcessExecutorFactory processExecutorFactory,
            ICompilerFactory compilerFactory,
            IExecutionStrategySettingsProvider settingsProvider)
            : base(type, processExecutorFactory, compilerFactory, settingsProvider)
        {
        }

        protected override Task<IExecutionResult<TestResult>> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
            => this.CompileExecuteAndCheck(
                executionContext,
                result,
                this.CreateExecutor());

        protected override async Task<IExecutionResult<OutputResult>> ExecuteAgainstSimpleInput(
            IExecutionContext<SimpleInputModel> executionContext,
            IExecutionResult<OutputResult> result)
        {
            var compileResult = this.ExecuteCompiling(
                executionContext,
                result);

            if (!compileResult.IsCompiledSuccessfully)
            {
                return result;
            }

            var executor = this.CreateExecutor();

            var processExecutionResult = await executor.Execute(
                compileResult.OutputFile,
                executionContext.Input?.Input ?? string.Empty,
                executionContext.TimeLimit,
                executionContext.MemoryLimit,
                null,
                this.WorkingDirectory);

            result.Results.Add(GetOutputResult(processExecutionResult));

            return result;
        }
    }

#pragma warning disable SA1402
    public class CompileExecuteAndCheckExecutionStrategySettings : BaseCompiledCodeExecutionStrategySettings
#pragma warning restore SA1402
    {
    }
}
