﻿#nullable disable
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

    public class NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy :
        NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy
    {
        public NodeJsExecuteAndRunAsyncJsDomTestsWithReactExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            StrategySettings settings)
            : base(processExecutorFactory, settings)
        {
            if (!File.Exists(settings.SinonJsDomModulePath))
            {
                throw new ArgumentException(
                    $"SinonPackaged not found in: {settings.SinonJsDomModulePath}",
                    nameof(settings.SinonJsDomModulePath));
            }

            if (!Directory.Exists(settings.BabelCoreModulePath))
            {
                throw new ArgumentException(
                    $"Babel-Core not found in: {settings.BabelCoreModulePath}",
                    nameof(settings.BabelCoreModulePath));
            }

            if (!Directory.Exists(settings.ReactJsxPluginPath))
            {
                throw new ArgumentException(
                    $"React JSX Plugin not found in: {settings.ReactJsxPluginPath}",
                    nameof(settings.ReactJsxPluginPath));
            }

            if (!Directory.Exists(settings.ReactModulePath))
            {
                throw new ArgumentException(
                    $"React Module not found in: {settings.ReactModulePath}",
                    nameof(settings.ReactModulePath));
            }

            if (!Directory.Exists(settings.ReactDomModulePath))
            {
                throw new ArgumentException(
                    $"ReactDOM Module not found in: {settings.ReactDomModulePath}",
                    nameof(settings.ReactDomModulePath));
            }

            if (!Directory.Exists(settings.NodeFetchModulePath))
            {
                throw new ArgumentException(
                    $"node-fetch Module not found in: {settings.NodeFetchModulePath}",
                    nameof(settings.NodeFetchModulePath));
            }

            settings.SinonJsDomModulePath = FileHelpers.ProcessModulePath(settings.SinonJsDomModulePath);
            settings.BabelCoreModulePath = FileHelpers.ProcessModulePath(settings.BabelCoreModulePath);
            settings.ReactJsxPluginPath = FileHelpers.ProcessModulePath(settings.ReactJsxPluginPath);
            settings.ReactModulePath = FileHelpers.ProcessModulePath(settings.ReactModulePath);
            settings.ReactDomModulePath = FileHelpers.ProcessModulePath(settings.ReactDomModulePath);
            settings.NodeFetchModulePath = FileHelpers.ProcessModulePath(settings.NodeFetchModulePath);

            this.Settings = settings;
        }

        protected override StrategySettings Settings { get; }

        protected override string JsCodeTemplate =>
    RequiredModules + $@";
    let code =  `{UserInputPlaceholder}`;

    code = babel.transform(code, {{plugins: [reactJsxPlugin]}});
    code = code.code;
    code = `let result = ${{code}}\n`;" +
    NodeDisablePlaceholder +
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

        protected override string JsCodePreevaulationCode => $@"
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

            var processExecutionResult = await executor.Execute(
                this.Settings.NodeJsExecutablePath,
                string.Empty,
                executionContext.TimeLimit,
                executionContext.MemoryLimit,
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
                .Replace(NodeDisablePlaceholder, this.JsNodeDisableCode)
                .Replace(TestsPlaceholder, this.BuildTests((context.Input as TestsInputModel)?.Tests))
                .Replace(UserInputPlaceholder, code);
            return processedCode;
        }

        public new class StrategySettings : NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy.StrategySettings
        {
            public string SinonJsDomModulePath { get; set; } = string.Empty;
            public string BabelCoreModulePath { get; set; } = string.Empty;
            public string ReactJsxPluginPath { get; set; } = string.Empty;
            public string ReactModulePath { get; set; } = string.Empty;
            public string ReactDomModulePath { get; set; } = string.Empty;
            public string NodeFetchModulePath { get; set; } = string.Empty;
        }
    }
}
