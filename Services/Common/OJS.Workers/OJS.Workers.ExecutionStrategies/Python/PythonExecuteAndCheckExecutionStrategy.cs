#nullable disable
namespace OJS.Workers.ExecutionStrategies.Python
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Extensions;
    using OJS.Workers.Common.Helpers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    using static OJS.Workers.ExecutionStrategies.Python.PythonConstants;

    public class PythonExecuteAndCheckExecutionStrategy : BaseInterpretedCodeExecutionStrategy
    {
#pragma warning disable SA1401
        protected readonly string PythonExecutablePath;
#pragma warning restore SA1401

        public PythonExecuteAndCheckExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            string pythonExecutablePath,
            int baseTimeUsed,
            int baseMemoryUsed)
            : base(processExecutorFactory, baseTimeUsed, baseMemoryUsed)
        {
            if (!FileHelpers.FileExists(pythonExecutablePath))
            {
                throw new ArgumentException($"Python not found in: {pythonExecutablePath}", nameof(pythonExecutablePath));
            }

            this.PythonExecutablePath = pythonExecutablePath;
        }

        protected virtual IEnumerable<string> ExecutionArguments
            => new[] { IsolatedModeArgument, OptimizeAndDiscardDocstringsArgument };

        protected override IExecutionResult<TestResult> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            var codeSavePath = this.SaveCodeToTempFile(executionContext);

            var executor = this.CreateExecutor();

            var checker = executionContext.Input.GetChecker();

            return this.RunTests(codeSavePath, executor, checker, executionContext, result);
        }

        protected override IExecutionResult<OutputResult> ExecuteAgainstSimpleInput(
            IExecutionContext<SimpleInputModel> executionContext,
            IExecutionResult<OutputResult> result)
        {
            var codeSavePath = this.SaveCodeToTempFile(executionContext);

            var executor = this.CreateExecutor();

            var processExecutionResult = this.Execute(
                executionContext,
                executor,
                codeSavePath,
                executionContext.Input.Input);

            result.Results.Add(GetOutputResult(processExecutionResult));

            return result;
        }

        protected virtual IExecutionResult<TestResult> RunTests(
            string codeSavePath,
            IExecutor executor,
            IChecker checker,
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            result.Results.AddRange(
                executionContext.Input.Tests
                    .Select(test => this.RunIndividualTest(
                        codeSavePath,
                        executor,
                        checker,
                        executionContext,
                        test)));

            return result;
        }

        protected virtual TestResult RunIndividualTest(
            string codeSavePath,
            IExecutor executor,
            IChecker checker,
            IExecutionContext<TestsInputModel> executionContext,
            TestContext test)
        {
            var testInput = PrepareTestInput(test.Input);
            var processExecutionResult = this.Execute(executionContext, executor, codeSavePath, testInput);

            var testResult = CheckAndGetTestResult(
                test,
                processExecutionResult,
                checker,
                processExecutionResult.ReceivedOutput);

            return testResult;
        }

        protected virtual ProcessExecutionResult Execute<TInput>(
            IExecutionContext<TInput> executionContext,
            IExecutor executor,
            string codeSavePath,
            string input,
            string directory = null)
            => executor.Execute(
                this.PythonExecutablePath,
                input,
                executionContext.TimeLimit,
                executionContext.MemoryLimit,
                this.ExecutionArguments.Concat(new[] { codeSavePath }),
                directory,
                false,
                true);
    }
}
