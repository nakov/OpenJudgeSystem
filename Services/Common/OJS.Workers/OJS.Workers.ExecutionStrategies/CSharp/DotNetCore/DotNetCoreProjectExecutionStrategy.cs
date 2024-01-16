﻿namespace OJS.Workers.ExecutionStrategies.CSharp.DotNetCore
{
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.Compilers;
    using OJS.Workers.ExecutionStrategies.Extensions;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class DotNetCoreProjectExecutionStrategy<TSettings> : CSharpProjectTestsExecutionStrategy<TSettings>
        where TSettings : DotNetCoreProjectExecutionStrategySettings
    {
        protected new const string AdditionalExecutionArguments = "--no-build --no-restore";

        public DotNetCoreProjectExecutionStrategy(
            ExecutionStrategyType type,
            IProcessExecutorFactory processExecutorFactory,
            ICompilerFactory compilerFactory,
            IExecutionStrategySettingsProvider settingsProvider)
            : base(type, processExecutorFactory, compilerFactory, settingsProvider)
        {
        }

        protected override async Task<IExecutionResult<TestResult>> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            executionContext.SanitizeContent();

            SaveZipSubmission(executionContext.FileContent, this.WorkingDirectory);

            var csProjFilePath = this.GetCsProjFilePath();

            var compilerPath = this.CompilerFactory.GetCompilerPath(executionContext.CompilerType);

            var compilerResult = this.Compile(
                executionContext.CompilerType,
                compilerPath,
                executionContext.AdditionalCompilerArguments,
                csProjFilePath);

            result.IsCompiledSuccessfully = compilerResult.IsCompiledSuccessfully;

            if (!result.IsCompiledSuccessfully)
            {
                result.CompilerComment = compilerResult.CompilerComment;
                return result;
            }

            var executor = this.CreateExecutor();

            var checker = executionContext.Input.GetChecker();

            var arguments = new string[]
            {
                compilerResult.OutputFile,
                AdditionalExecutionArguments,
            };

            foreach (var test in executionContext.Input.Tests)
            {
                var processExecutionResult = await executor.Execute(
                    compilerPath,
                    test.Input,
                    executionContext.TimeLimit,
                    executionContext.MemoryLimit,
                    arguments,
                    this.WorkingDirectory);

                var testResult = CheckAndGetTestResult(
                    test,
                    processExecutionResult,
                    checker,
                    processExecutionResult.ReceivedOutput);

                result.Results.Add(testResult);
            }

            return result;
        }
    }

#pragma warning disable SA1402
    public class DotNetCoreProjectExecutionStrategySettings : CSharpProjectTestsExecutionStrategySettings
#pragma warning restore SA1402
    {
    }
}
