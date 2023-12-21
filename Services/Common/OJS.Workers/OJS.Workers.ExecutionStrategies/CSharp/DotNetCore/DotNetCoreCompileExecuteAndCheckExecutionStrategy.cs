#nullable disable
namespace OJS.Workers.ExecutionStrategies.CSharp.DotNetCore
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Models;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;
    using static OJS.Workers.Common.Constants;

    public class DotNetCoreCompileExecuteAndCheckExecutionStrategy : BaseCompiledCodeExecutionStrategy
    {
        private const string DotNetCoreCodeStringTemplate = "{0}{1}{2}";
        private readonly string dotNetCoreRuntimeVersion;

        public DotNetCoreCompileExecuteAndCheckExecutionStrategy(
            Func<CompilerType, string> getCompilerPathFunc,
            IProcessExecutorFactory processExecutorFactory,
            string dotNetCoreRuntimeVersion,
            int baseTimeUsed,
            int baseMemoryUsed)
            : base(processExecutorFactory, baseTimeUsed, baseMemoryUsed)
        {
            this.GetCompilerPathFunc = getCompilerPathFunc;
            this.dotNetCoreRuntimeVersion = dotNetCoreRuntimeVersion;
        }

        protected Func<CompilerType, string> GetCompilerPathFunc { get; }

        private static IEnumerable<string> DotNetSixDefaultUsingNamespaces
            => new List<string>
            {
                "using System;",
                "using System.IO;",
                "using System.Collections.Generic;",
                "using System.Linq;",
                "using System.Net.Http;",
                "using System.Threading;",
                "using System.Threading.Tasks;",
            };

        private string RuntimeConfigJsonTemplate => $@"
            {{
	            ""runtimeOptions"": {{
                    ""framework"": {{
                        ""name"": ""Microsoft.NETCore.App"",
                        ""version"": ""{this.dotNetCoreRuntimeVersion}""
                    }}
                }}
            }}";

        protected override IExecutionResult<TestResult> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            var compileResult = this.ExecuteCompiling(
                executionContext,
                this.GetCompilerPathFunc,
                result);

            if (!compileResult.IsCompiledSuccessfully)
            {
                return result;
            }

            var executor = this.PrepareExecutor(
                compileResult,
                executionContext,
                out var arguments,
                out var compilerPath);

            var checker = executionContext.Input.GetChecker();

            foreach (var test in executionContext.Input.Tests)
            {
                var processExecutionResult = executor.Execute(
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

        protected override IExecutionResult<OutputResult> ExecuteAgainstSimpleInput(
            IExecutionContext<SimpleInputModel> executionContext,
            IExecutionResult<OutputResult> result)
        {
            var compileResult = this.ExecuteCompiling(
                executionContext,
                this.GetCompilerPathFunc,
                result);

            if (!compileResult.IsCompiledSuccessfully)
            {
                return result;
            }

            var executor = this.PrepareExecutor(
                compileResult,
                executionContext,
                out var arguments,
                out var compilerPath);

            var processExecutionResult = executor.Execute(
                compilerPath,
                executionContext.Input?.Input ?? string.Empty,
                executionContext.TimeLimit,
                executionContext.MemoryLimit,
                arguments,
                this.WorkingDirectory);

            var outputResult = GetOutputResult(processExecutionResult);

            result.Results.Add(outputResult);

            return result;
        }

        protected override string PreprocessCode<TInput>(IExecutionContext<TInput> executionContext)
        {
            if (this.Type != ExecutionStrategyType.DotNetCore6CompileExecuteAndCheck ||
                string.IsNullOrWhiteSpace(executionContext.Code))
            {
                return base.PreprocessCode(executionContext);
            }

            return string.Format(
                DotNetCoreCodeStringTemplate,
                string.Join(
                    Environment.NewLine,
                    DotNetSixDefaultUsingNamespaces.Select(
                        ns => GetNamespaceIfNotExist(ns, executionContext.Code))),
                Environment.NewLine,
                executionContext.Code);
        }

        private static void CreateRuntimeConfigJsonFile(string directory, string text)
        {
            var compiledFileName = Directory
                .GetFiles(directory)
                .Select(Path.GetFileNameWithoutExtension)
                .First();

            var jsonFileName = $"{compiledFileName}.runtimeconfig{JsonFileExtension}";

            var jsonFilePath = Path.Combine(directory, jsonFileName);

            File.WriteAllText(jsonFilePath, text);
        }

        private static string GetNamespaceIfNotExist(string usingNamespace, string code)
            => code.Contains(usingNamespace)
                ? string.Empty
                : usingNamespace;

        private IExecutor PrepareExecutor<TInput>(
            CompileResult compileResult,
            IExecutionContext<TInput> executionContext,
            out string[] arguments,
            out string compilerPath)
        {
            var executor = this.CreateExecutor();

            arguments = new[]
            {
                compileResult.OutputFile,
            };

            compilerPath = this.GetCompilerPathFunc(executionContext.CompilerType);

            CreateRuntimeConfigJsonFile(this.WorkingDirectory, this.RuntimeConfigJsonTemplate);

            return executor;
        }
    }
}
