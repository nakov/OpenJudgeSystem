namespace OJS.Workers.ExecutionStrategies.CSharp.DotNetFramework
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;
    using Microsoft.Build.Evaluation;
    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;
    using OJS.Workers.Common.Models;
    using OJS.Workers.ExecutionStrategies.Extensions;
    using OJS.Workers.ExecutionStrategies.Helpers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class CSharpUnitTestsExecutionStrategy : CSharpProjectTestsExecutionStrategy
    {
        private const string NUnitFrameworkPackageName = "nunit.framework";

        public CSharpUnitTestsExecutionStrategy(
            Func<CompilerType, string> getCompilerPathFunc,
            IProcessExecutorFactory processExecutorFactory,
            string nUnitConsoleRunnerPath,
            int baseTimeUsed,
            int baseMemoryUsed)
            : base(getCompilerPathFunc, processExecutorFactory, nUnitConsoleRunnerPath, baseTimeUsed, baseMemoryUsed)
        {
        }

        protected override IExecutionResult<TestResult> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            SaveZipSubmission(executionContext.FileContent, this.WorkingDirectory);

            var csProjFilePath = this.GetCsProjFilePath();

            var project = new Project(csProjFilePath);

            this.SaveSetupFixture(project.DirectoryPath);

            this.CorrectProjectReferences(project);

            var executor = this.CreateExecutor(ProcessExecutorType.Restricted);

            return this.RunUnitTests(
                this.NUnitConsoleRunnerPath,
                executionContext,
                executor,
                executionContext.Input.GetChecker(),
                result,
                csProjFilePath,
                AdditionalExecutionArguments);
        }

        protected override IExecutionResult<TestResult> RunUnitTests(
            string consoleRunnerPath,
            IExecutionContext<TestsInputModel> executionContext,
            IExecutor executor,
            IChecker checker,
            IExecutionResult<TestResult> result,
            string csProjFilePath,
            string additionalExecutionArguments)
        {
            var projectDirectory = Path.GetDirectoryName(csProjFilePath);
            var testedCodePath =
                $"{projectDirectory}\\{UnitTestStrategiesHelper.testedCodeFileNameWithExtension}";
            var originalTestsPassed = -1;
            var count = 0;

            var compilerPath = this.GetCompilerPathFunc(executionContext.CompilerType);

            var tests = executionContext.Input.Tests.OrderBy(x => x.IsTrialTest).ThenBy(x => x.OrderBy);

            foreach (var test in tests)
            {
                File.WriteAllText(this.SetupFixturePath, SetupFixtureTemplate);

                File.WriteAllText(testedCodePath, test.Input);

                // Compiling
                var compilerResult = this.Compile(
                    executionContext.CompilerType,
                    compilerPath,
                    executionContext.AdditionalCompilerArguments,
                    csProjFilePath);

                result.IsCompiledSuccessfully = compilerResult.IsCompiledSuccessfully;
                result.CompilerComment = compilerResult.CompilerComment;

                if (!compilerResult.IsCompiledSuccessfully)
                {
                    return result;
                }

                // Delete tests before execution so the user can't acces them
                FileHelpers.DeleteFiles(testedCodePath, this.SetupFixturePath);

                var arguments = new List<string> { compilerResult.OutputFile };
                arguments.AddRange(additionalExecutionArguments.Split(' '));

                var processExecutionResult = executor.Execute(
                    consoleRunnerPath,
                    string.Empty,
                    executionContext.TimeLimit,
                    executionContext.MemoryLimit,
                    arguments,
                    null,
                    false,
                    true);

                var testResultsRegex = new Regex(TestResultsRegex);

                var processExecutionTestResult = UnitTestStrategiesHelper.GetTestResult(
                    processExecutionResult.ReceivedOutput,
                    testResultsRegex,
                    originalTestsPassed,
                    count == 0,
                    ExtractTotalAndPassedTestsCount);

                var message = processExecutionTestResult.message;
                originalTestsPassed = processExecutionTestResult.originalTestsPassed;

                var testResult = CheckAndGetTestResult(test, processExecutionResult, checker, message);
                result.Results.Add(testResult);
                count++;
            }

            return result;
        }

        protected override void CorrectProjectReferences(Project project)
        {
            var additionalCompileItems = new[]
            {
                UnitTestStrategiesHelper.TestedCodeFileName,
                SetupFixtureFileName,
            };

            project.AddCompileItems(additionalCompileItems);

            project.EnsureAssemblyNameIsCorrect();

            // Remove the first Project Reference (this should be the reference to the tested project)
            var projectReference = project.GetItems("ProjectReference").FirstOrDefault();
            if (projectReference != null)
            {
                project.RemoveItem(projectReference);
            }

            project.SetProperty("OutputType", "Library");

            project.RemoveItemByName(NUnitFrameworkPackageName);

            // Add our NUnit Reference
            project.AddReferences(NUnitReference);

            // If we use NUnit we don't really need the VSTT, it will save us copying of the .dll
            project.RemoveItemByName(VsttPackageName);

            project.Save(project.FullPath);
            project.ProjectCollection.UnloadAllProjects();

            project.RemoveNuGetPackageImportsTarget();
        }
    }
}
