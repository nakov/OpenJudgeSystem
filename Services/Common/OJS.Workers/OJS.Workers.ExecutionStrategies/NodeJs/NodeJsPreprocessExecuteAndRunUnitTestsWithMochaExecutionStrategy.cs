namespace OJS.Workers.ExecutionStrategies.NodeJs
{
    using System;
    using System.Collections.Generic;
    using System.IO;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    using static OJS.Workers.ExecutionStrategies.NodeJs.NodeJsConstants;

    public class NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy<TSettings>
        : NodeJsPreprocessExecuteAndCheckExecutionStrategy<TSettings>
        where TSettings : NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings
    {
        protected const string TestsPlaceholder = "#testsCode#";

        public NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            IExecutionStrategySettingsProvider settingsProvider)
            : base(processExecutorFactory, settingsProvider)
        {
            if (!File.Exists(this.Settings.MochaModulePath))
            {
                throw new ArgumentException(
                    $"Mocha not found in: {this.Settings.MochaModulePath}",
                    nameof(this.Settings.MochaModulePath));
            }

            if (!Directory.Exists(this.Settings.ChaiModulePath))
            {
                throw new ArgumentException(
                    $"Chai not found in: {this.Settings.ChaiModulePath}",
                    nameof(this.Settings.ChaiModulePath));
            }

            if (!Directory.Exists(this.Settings.SinonModulePath))
            {
                throw new ArgumentException(
                    $"Sinon not found in: {this.Settings.SinonModulePath}",
                    nameof(this.Settings.SinonModulePath));
            }

            if (!Directory.Exists(this.Settings.SinonChaiModulePath))
            {
                throw new ArgumentException(
                    $"Sinon-chai not found in: {this.Settings.SinonChaiModulePath}",
                    nameof(this.Settings.SinonChaiModulePath));
            }

            this.Settings.ChaiModulePath = FileHelpers.ProcessModulePath(this.Settings.ChaiModulePath);
            this.Settings.SinonModulePath = FileHelpers.ProcessModulePath(this.Settings.SinonModulePath);
            this.Settings.SinonChaiModulePath = FileHelpers.ProcessModulePath(this.Settings.SinonChaiModulePath);
        }

        protected override string JsCodeRequiredModules => base.JsCodeRequiredModules + @",
    chai = require('" + this.Settings.ChaiModulePath + @"'),
    sinon = require('" + this.Settings.SinonModulePath + @"'),
    sinonChai = require('" + this.Settings.SinonChaiModulePath + @"'),
	assert = chai.assert,
	expect = chai.expect,
	should = chai.should()";

        protected override string JsCodePreevaulationCode => @"
chai.use(sinonChai);
describe('TestScope', function() {
    let code = {
        run: " + UserInputPlaceholder + @"
    };

    let result = code.run;
    let bgCoderConsole = {};

    before(function() {
        Object.keys(console)
            .forEach(function (prop) {
                bgCoderConsole[prop] = console[prop];
                console[prop] = new Function('');
            });
    });

    after(function() {
        Object.keys(bgCoderConsole)
            .forEach(function (prop) {
                console[prop] = bgCoderConsole[prop];
            });
    });";

        protected override string JsCodeEvaluation => @"
	it('Test', function(done) {
		let content = '';
        process.stdin.resume();
        process.stdin.on('data', function(buf) { content += buf.toString(); });
        process.stdin.on('end', function() {
            let inputData = content.trim();

	        let testFunc = new Function('result', " + this.TestFuncVariables + @", inputData);
            testFunc.call({}, result,  " + this.TestFuncVariables.Replace("'", string.Empty) + @");

	        done();
        });
    });";

        protected override string JsCodePostevaulationCode => @"
});";

        protected virtual string TestFuncVariables => "'assert', 'expect', 'should', 'sinon'";

        protected virtual IEnumerable<string> AdditionalExecutionArguments
            => new[] { TestsReporterArgument, JsonReportName };

        protected override async Task<List<TestResult>> ProcessTests(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutor executor,
            IChecker checker,
            string codeSavePath)
        {
            var testResults = new List<TestResult>();

            var arguments = new List<string>();
            arguments.Add(this.Settings.MochaModulePath);
            arguments.Add(codeSavePath);
            arguments.AddRange(this.AdditionalExecutionArguments);

            foreach (var test in executionContext.Input.Tests)
            {
                var processExecutionResult = await executor.Execute(
                    this.Settings.NodeJsExecutablePath,
                    test.Input,
                    executionContext.TimeLimit,
                    executionContext.MemoryLimit,
                    arguments);

                var mochaResult = JsonExecutionResult.Parse(processExecutionResult.ReceivedOutput);

                var message = "yes";
                if (!string.IsNullOrEmpty(mochaResult.Error))
                {
                    message = mochaResult.Error;
                }
                else if (mochaResult.TotalPassingTests != 1)
                {
                    message = $"Unexpected error: {mochaResult.TestErrors[0]}";
                }

                var testResult = CheckAndGetTestResult(
                    test,
                    processExecutionResult,
                    checker,
                    message);
                testResults.Add(testResult);
            }

            return testResults;
        }
    }

#pragma warning disable SA1402
    public class NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings : NodeJsPreprocessExecuteAndCheckExecutionStrategySettings
#pragma warning restore SA1402
    {
        public string MochaModulePath { get; set; } = string.Empty;
        public string ChaiModulePath { get; set; } = string.Empty;
        public string SinonModulePath { get; set; } = string.Empty;
        public string SinonChaiModulePath { get; set; } = string.Empty;
    }
}
