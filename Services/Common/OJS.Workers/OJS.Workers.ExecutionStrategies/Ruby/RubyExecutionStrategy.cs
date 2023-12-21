namespace OJS.Workers.ExecutionStrategies.Ruby
{
    using System.IO;

    using OJS.Workers.Common;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class RubyExecutionStrategy : BaseInterpretedCodeExecutionStrategy
    {
        public RubyExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            string rubyPath,
            int baseTimeUsed,
            int baseMemoryUsed)
            : base(processExecutorFactory, baseTimeUsed, baseMemoryUsed)
            => this.RubyPath = rubyPath;

        public string RubyPath { get; set; }

        protected override IExecutionResult<TestResult> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            var submissionFilePath = this.SaveCodeToTempFile(executionContext);

            var arguments = new[] { submissionFilePath };

            var executor = this.CreateExecutor();

            var checker = executionContext.Input.GetChecker();

            foreach (var test in executionContext.Input.Tests)
            {
                var processExecutionResult = executor.Execute(
                    this.RubyPath,
                    test.Input,
                    executionContext.TimeLimit,
                    executionContext.MemoryLimit,
                    arguments);

                var testResult = CheckAndGetTestResult(
                    test,
                    processExecutionResult,
                    checker,
                    processExecutionResult.ReceivedOutput);

                result.Results.Add(testResult);
            }

            if (File.Exists(submissionFilePath))
            {
                File.Delete(submissionFilePath);
            }

            return result;
        }
    }
}
