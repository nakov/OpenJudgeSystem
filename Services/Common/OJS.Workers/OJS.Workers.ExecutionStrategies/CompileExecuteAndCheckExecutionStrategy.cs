namespace OJS.Workers.ExecutionStrategies
{
    using OJS.Workers.Common;
    using OJS.Workers.Compilers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class CompileExecuteAndCheckExecutionStrategy : BaseCompiledCodeExecutionStrategy
    {
        public CompileExecuteAndCheckExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            ICompilerFactory compilerFactory,
            int baseTimeUsed,
            int baseMemoryUsed)
            : base(processExecutorFactory, compilerFactory, baseTimeUsed, baseMemoryUsed)
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
}
