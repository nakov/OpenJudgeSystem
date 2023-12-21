namespace OJS.Workers.ExecutionStrategies.Golang
{
    using System;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;
    using OJS.Workers.Common.Models;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class GolangCompileExecuteAndCheckExecutionStrategy : BaseCompiledCodeExecutionStrategy
    {
        private const string CodeSaveFileName = "main.go";

        public GolangCompileExecuteAndCheckExecutionStrategy(
            Func<CompilerType, string> getCompilerPathFunc,
            IProcessExecutorFactory processExecutorFactory,
            int baseTimeUsed,
            int baseMemoryUsed)
            : base(processExecutorFactory, baseTimeUsed, baseMemoryUsed)
            => this.GetCompilerPathFunc = getCompilerPathFunc;

        protected Func<CompilerType, string> GetCompilerPathFunc { get; }

        protected override IExecutionResult<TestResult> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
            => this.CompileExecuteAndCheck(
                executionContext,
                result,
                this.GetCompilerPathFunc,
                this.CreateExecutor(),
                useSystemEncoding: true,
                dependOnExitCodeForRunTimeError: false,
                useWorkingDirectoryForProcess: true);

        protected override string SaveCodeToTempFile<TInput>(IExecutionContext<TInput> executionContext)
            => FileHelpers.SaveStringToFile(
                executionContext.Code,
                FileHelpers.BuildPath(this.WorkingDirectory, CodeSaveFileName));
    }
}