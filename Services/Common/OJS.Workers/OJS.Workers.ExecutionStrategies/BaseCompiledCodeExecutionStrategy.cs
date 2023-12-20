namespace OJS.Workers.ExecutionStrategies
{
    using System;
    using System.IO;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.Compilers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public abstract class BaseCompiledCodeExecutionStrategy : BaseCodeExecutionStrategy
    {
        protected BaseCompiledCodeExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            int baseTimeUsed,
            int baseMemoryUsed)
            : base(processExecutorFactory, baseTimeUsed, baseMemoryUsed)
        {
        }

        protected IExecutionResult<TestResult> CompileExecuteAndCheck(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result,
            Func<CompilerType, string> getCompilerPathFunc,
            IExecutor executor,
            bool useSystemEncoding = true,
            bool dependOnExitCodeForRunTimeError = false,
            bool useWorkingDirectoryForProcess = false)
        {
            // Compile the file
            var compileResult = this.ExecuteCompiling(
                executionContext,
                getCompilerPathFunc,
                result,
                useWorkingDirectoryForProcess);

            if (!compileResult.IsCompiledSuccessfully)
            {
                return result;
            }

            var outputFile = compileResult.OutputFile;

            // Execute and check each test
            var checker = executionContext.Input.GetChecker();

            foreach (var test in executionContext.Input.Tests)
            {
                var processExecutionResult = executor.Execute(
                    outputFile,
                    test.Input,
                    executionContext.TimeLimit,
                    executionContext.MemoryLimit,
                    null,
                    null,
                    false,
                    useSystemEncoding,
                    dependOnExitCodeForRunTimeError);

                var testResult = CheckAndGetTestResult(
                    test,
                    processExecutionResult,
                    checker,
                    processExecutionResult.ReceivedOutput);

                result.Results.Add(testResult);
            }

            return result;
        }

        protected CompileResult ExecuteCompiling<TInput, TResult>(
            IExecutionContext<TInput> executionContext,
            Func<CompilerType, string> getCompilerPathFunc,
            IExecutionResult<TResult> result,
            bool useWorkingDirectoryForProcess = false)
            where TResult : ISingleCodeRunResult, new()
        {
            var submissionFilePath = this.SaveCodeToTempFile(executionContext);

            var compilerPath = getCompilerPathFunc(executionContext.CompilerType);

            var compileResult = this.Compile(
                executionContext.CompilerType,
                compilerPath,
                executionContext.AdditionalCompilerArguments,
                submissionFilePath,
                useWorkingDirectoryForProcess);

            result.IsCompiledSuccessfully = compileResult.IsCompiledSuccessfully;
            result.CompilerComment = compileResult.CompilerComment;

            return compileResult;
        }

        protected virtual CompileResult Compile(
            CompilerType compilerType,
            string compilerPath,
            string compilerArguments,
            string submissionFilePath,
            bool useWorkingDirectoryForProcess = false)
        {
            if (compilerType == CompilerType.None)
            {
                return new CompileResult(true, null) { OutputFile = submissionFilePath };
            }

            if (!File.Exists(compilerPath))
            {
                throw new ArgumentException($"Compiler not found in: {compilerPath}", nameof(compilerPath));
            }

            var compiler = Compiler.CreateCompiler(compilerType, this.Type);
            var compilerResult = compiler.Compile(compilerPath, submissionFilePath, compilerArguments, useWorkingDirectoryForProcess);

            return compilerResult;
        }
    }
}
