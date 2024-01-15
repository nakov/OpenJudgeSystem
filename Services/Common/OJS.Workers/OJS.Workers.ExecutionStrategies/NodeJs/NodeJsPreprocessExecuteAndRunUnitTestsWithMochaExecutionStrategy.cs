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

    public class NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy
        : NodeJsPreprocessExecuteAndCheckExecutionStrategy
    {
        protected const string TestsPlaceholder = "#testsCode#";

        public NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            StrategySettings settings)
            : base(processExecutorFactory, settings)
        {
            if (!File.Exists(settings.MochaModulePath))
            {
                throw new ArgumentException(
                    $"Mocha not found in: {settings.MochaModulePath}",
                    nameof(settings.MochaModulePath));
            }

            if (!Directory.Exists(settings.ChaiModulePath))
            {
                throw new ArgumentException(
                    $"Chai not found in: {settings.ChaiModulePath}",
                    nameof(settings.ChaiModulePath));
            }

            if (!Directory.Exists(settings.SinonModulePath))
            {
                throw new ArgumentException(
                    $"Sinon not found in: {settings.SinonModulePath}",
                    nameof(settings.SinonModulePath));
            }

            if (!Directory.Exists(settings.SinonChaiModulePath))
            {
                throw new ArgumentException(
                    $"Sinon-chai not found in: {settings.SinonChaiModulePath}",
                    nameof(settings.SinonChaiModulePath));
            }

            settings.ChaiModulePath = FileHelpers.ProcessModulePath(settings.ChaiModulePath);
            settings.SinonModulePath = FileHelpers.ProcessModulePath(settings.SinonModulePath);
            settings.SinonChaiModulePath = FileHelpers.ProcessModulePath(settings.SinonChaiModulePath);

            this.Settings = settings;
        }

        protected override StrategySettings Settings { get; }

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

        public new class StrategySettings : NodeJsPreprocessExecuteAndCheckExecutionStrategy.StrategySettings
        {
            public string MochaModulePath { get; set; } = string.Empty;
            public string ChaiModulePath { get; set; } = string.Empty;
            public string SinonModulePath { get; set; } = string.Empty;
            public string SinonChaiModulePath { get; set; } = string.Empty;
        }
    }
}
