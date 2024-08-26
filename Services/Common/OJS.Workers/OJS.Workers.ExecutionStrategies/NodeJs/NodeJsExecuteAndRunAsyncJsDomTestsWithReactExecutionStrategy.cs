namespace OJS.Workers.ExecutionStrategies.NodeJs
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text.RegularExpressions;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;
    using Microsoft.Extensions.Logging;
    using OJS.Workers.Common.Models;

    public class NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy<TSettings>
        : NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy<TSettings>
        where TSettings : NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategySettings
    {
        public NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy(
            IOjsSubmission submission,
            IProcessExecutorFactory processExecutorFactory,
            IExecutionStrategySettingsProvider settingsProvider,
            ILogger<BaseExecutionStrategy<TSettings>> logger)
            : base(submission, processExecutorFactory, settingsProvider, logger)
        {
            // if (!File.Exists(sinonJsDomModulePath))
            // {
            //     throw new ArgumentException(
            //         $"SinonPackaged not found in: {sinonJsDomModulePath}",
            //         nameof(sinonJsDomModulePath));
            // }
            //
            // if (!Directory.Exists(babelCoreModulePath))
            // {
            //     throw new ArgumentException(
            //         $"Babel-Core not found in: {babelCoreModulePath}",
            //         nameof(babelCoreModulePath));
            // }
            //
            // if (!Directory.Exists(reactJsxPluginPath))
            // {
            //     throw new ArgumentException(
            //         $"React JSX Plugin not found in: {reactJsxPluginPath}",
            //         nameof(reactJsxPluginPath));
            // }
            //
            // if (!Directory.Exists(reactModulePath))
            // {
            //     throw new ArgumentException(
            //         $"React Module not found in: {reactModulePath}",
            //         nameof(reactModulePath));
            // }
            //
            // if (!Directory.Exists(reactDomModulePath))
            // {
            //     throw new ArgumentException(
            //         $"ReactDOM Module not found in: {reactDomModulePath}",
            //         nameof(reactDomModulePath));
            // }
            //
            // if (!Directory.Exists(nodeFetchModulePath))
            // {
            //     throw new ArgumentException(
            //         $"node-fetch Module not found in: {nodeFetchModulePath}",
            //         nameof(nodeFetchModulePath));
            // }

            // this.SinonJsDomModulePath = FileHelpers.ProcessModulePath(sinonJsDomModulePath);
            // this.BabelCoreModulePath = FileHelpers.ProcessModulePath(babelCoreModulePath);
            // this.ReactJsxPluginPath = FileHelpers.ProcessModulePath(reactJsxPluginPath);
            // this.ReactModulePath = FileHelpers.ProcessModulePath(reactModulePath);
            // this.ReactDomModulePath = FileHelpers.ProcessModulePath(reactDomModulePath);
            // this.NodeFetchModulePath = FileHelpers.ProcessModulePath(nodeFetchModulePath);
        }

        protected override string JsCodeTemplate =>
    RequiredModules + $@";
    let code =  `{NodeJsConstants.UserInputPlaceholder}`;

    code = babel.transform(code, {{plugins: [reactJsxPlugin]}});
    code = code.code;
    code = `let result = ${{code}}\n`;" +
    NodeJsConstants.UserInputPlaceholder +
    PreevaluationPlaceholder +
    EvaluationPlaceholder +
    PostevaluationPlaceholder;

        protected override string JsCodeRequiredModules => base.JsCodeRequiredModules + @",
    fs = require('fs'),
    sinonJsDom = fs.readFileSync('" + this.Settings.SinonJsDomModulePath + @"','utf-8'),
    React = require('" + this.Settings.ReactModulePath + @"'),
    ReactDOM = require('" + this.Settings.ReactDomModulePath + @"'),
    babel = require('" + this.Settings.BabelCoreModulePath + @"'),
    reactJsxPlugin = require('" + this.Settings.ReactJsxPluginPath + @"'),
    fetch = require('" + this.Settings.NodeFetchModulePath + @"')";

        protected override string JsNodeDisableCode => base.JsNodeDisableCode + @"
fs = undefined;";

        protected string JsCodePreevaulationCode => $@"
chai.use(sinonChai);

describe('TestDOMScope', function() {{
    let bgCoderConsole = {{}};

    before(function(done) {{
        jsdom.env({{
            html: '',
            src:[sinonJsDom],
            done: function(errors, window) {{
                global.window = window;
                global.document = window.document;
                global.$ = jq(window);
                global.handlebars = handlebars;
                global.fetch = fetch;
                Object.getOwnPropertyNames(window)
                    .filter(function (prop) {{
                        return prop.toLowerCase().indexOf('html') >= 0;
                    }}).forEach(function (prop) {{
                        global[prop] = window[prop];
                    }});

                Object.keys(console)
                    .forEach(function (prop) {{
                        bgCoderConsole[prop] = console[prop];
                        console[prop] = new Function('');
                    }});

                done();
            }}
        }});
    }});

    beforeEach(function(){{
        window.XMLHttpRequest = window.sinon.useFakeXMLHttpRequest();
        global.server = window.sinon.fakeServer.create();
        server.autoRespond = true;
    }});

    afterEach(function(){{
        server.restore();
    }});

    after(function() {{
        Object.keys(bgCoderConsole)
            .forEach(function (prop) {{
                console[prop] = bgCoderConsole[prop];
            }});
    }});";

        protected override string TestFuncVariables => base.TestFuncVariables + ", 'React', 'ReactDOM'";

        protected override string BuildTests(IEnumerable<TestContext> tests)
        {
            var testsCode = string.Empty;
            var testsCount = 1;
            foreach (var test in tests)
            {
                var code = Regex.Replace(test.Input, "([\\\\`$])", "\\$1");

                testsCode +=
                    $@"
it('Test{testsCount++}', function(done) {{
    let content = `{code}`;
    let inputData = content.trim();

    let testFunc = new Function('done', {this.TestFuncVariables}, code + inputData);
    testFunc.call({{}}, done, {this.TestFuncVariables.Replace("'", string.Empty)});
}});";
            }

            return testsCode;
        }

        protected async override Task<List<TestResult>> ProcessTests(
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

            var processExecutionResult = await executor.Execute(
                this.Settings.NodeJsExecutablePath,
                0,
                executionContext.TimeLimit,
                executionContext.MemoryLimit.ToString(),
                arguments);

            var mochaResult = JsonExecutionResult.Parse(processExecutionResult.ReceivedOutput);
            var currentTest = 0;

            foreach (var test in executionContext.Input.Tests)
            {
                var message = "yes";
                if (!string.IsNullOrEmpty(mochaResult.Error))
                {
                    message = mochaResult.Error;
                }
                else if (mochaResult.TestErrors[currentTest] != null)
                {
                    message = $"Unexpected error: {mochaResult.TestErrors[currentTest]}";
                }

                var testResult = CheckAndGetTestResult(
                    test,
                    processExecutionResult,
                    checker,
                    message);
                currentTest++;
                testResults.Add(testResult);
            }

            return testResults;
        }

        protected override string PreprocessJsSubmission<TInput>(string template, IExecutionContext<TInput> context)
        {
            var code = context.Code.Trim(';');
            code = Regex.Replace(code, "([\\\\`$])", "\\$1");

            var processedCode = template
                .Replace(RequiredModules, this.JsCodeRequiredModules)
                .Replace(PreevaluationPlaceholder, this.JsCodePreevaulationCode)
                .Replace(EvaluationPlaceholder, this.JsCodeEvaluation)
                .Replace(PostevaluationPlaceholder, this.JsCodePostevaulationCode)
                .Replace(NodeJsConstants.NodeDisablePlaceholder, this.JsNodeDisableCode)
                .Replace(TestsPlaceholder, this.BuildTests((context.Input as TestsInputModel)?.Tests!))
                .Replace(NodeJsConstants.NodeDisablePlaceholder, code);
            return processedCode;
        }
    }

    public record NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategySettings(
        int BaseTimeUsed,
        int BaseMemoryUsed,
        string NodeJsExecutablePath,
        string UnderscoreModulePath,
        string MochaModulePath,
        string ChaiModulePath,
        string SinonModulePath,
        string SinonChaiModulePath,
        string SinonJsDomModulePath,
        string JsdomModulePath,
        string JqueryModulePath,
        string HandlebarsModulePath,
        string BabelCoreModulePath,
        string ReactJsxPluginPath,
        string ReactModulePath,
        string ReactDomModulePath,
        string NodeFetchModulePath)
        : NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings(
            BaseTimeUsed,
            BaseMemoryUsed,
            NodeJsExecutablePath,
            UnderscoreModulePath,
            MochaModulePath,
            ChaiModulePath,
            SinonModulePath,
            SinonChaiModulePath,
            JsdomModulePath,
            JqueryModulePath,
            HandlebarsModulePath);
}