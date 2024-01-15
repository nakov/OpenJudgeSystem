#nullable disable
namespace OJS.Workers.ExecutionStrategies.NodeJs
{
    using FluentExtensions.Extensions;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Text.RegularExpressions;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    public class NodeJsZipExecuteHtmlAndCssStrategy<TSettings> : NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategy<TSettings>
        where TSettings : NodeJsZipExecuteHtmlAndCssStrategySettings
    {
        protected const string EntryFileName = "*.html";
        protected const string UserBaseDirectoryPlaceholder = "#userBaseDirectoryPlaceholder#";

        public NodeJsZipExecuteHtmlAndCssStrategy(
            IProcessExecutorFactory processExecutorFactory,
            IExecutionStrategySettingsProvider settingsProvider)
            : base(processExecutorFactory, settingsProvider)
        {
            if (!Directory.Exists(this.Settings.JsDomModulePath))
            {
                throw new ArgumentException(
                    $"jsDom not found in: {this.Settings.JsDomModulePath}",
                    nameof(this.Settings.JsDomModulePath));
            }

            if (!Directory.Exists(this.Settings.JQueryModulePath))
            {
                throw new ArgumentException(
                    $"jQuery not found in: {this.Settings.JQueryModulePath}",
                    nameof(this.Settings.JQueryModulePath));
            }

            if (!File.Exists(this.Settings.BootstrapModulePath))
            {
                throw new ArgumentException(
                    $"Bootstrap Module not found in: {this.Settings.BootstrapModulePath}",
                    nameof(this.Settings.BootstrapModulePath));
            }

            if (!File.Exists(this.Settings.BootstrapCssPath))
            {
                throw new ArgumentException(
                    $"Bootstrap CSS not found in: {this.Settings.BootstrapCssPath}",
                    nameof(this.Settings.BootstrapCssPath));
            }

            this.Settings.JsDomModulePath = FileHelpers.ProcessModulePath(this.Settings.JsDomModulePath);
            this.Settings.JQueryModulePath = FileHelpers.ProcessModulePath(this.Settings.JQueryModulePath);
            this.Settings.BootstrapModulePath = FileHelpers.ProcessModulePath(this.Settings.BootstrapModulePath);
            this.Settings.BootstrapCssPath = FileHelpers.ProcessModulePath(this.Settings.BootstrapCssPath);
        }

        protected string ProgramEntryPath { get; set; }

        protected override string JsNodeDisableCode => base.JsNodeDisableCode + @"
fs = undefined;";

        protected override string JsCodeRequiredModules => base.JsCodeRequiredModules + $@",
    fs = require('fs'),
    jsdom = require('{this.Settings.JsDomModulePath}'),
    jq = require('{this.Settings.JQueryModulePath}'),
    bootstrap = fs.readFileSync('{this.Settings.BootstrapModulePath}','utf-8'),
    bootstrapCss = fs.readFileSync('{this.Settings.BootstrapCssPath}','utf-8'),
    userCode = fs.readFileSync('{UserInputPlaceholder}','utf-8')";

        protected override string JsCodeTemplate =>
            RequiredModules + ";" +
            PreevaluationPlaceholder +
            EvaluationPlaceholder +
            PostevaluationPlaceholder;

        protected override string JsCodePreevaulationCode => $@"
describe('TestDOMScope', function() {{
    let bgCoderConsole = {{}};
    before(function(done) {{
        jsdom.env({{
            html: userCode,
            src:[bootstrap],
            done: function(errors, window) {{
                global.window = window;
                global.document = window.document;
                global.$ = global.jQuery = jq(window);
                Object.getOwnPropertyNames(window)
                    .filter(function (prop) {{
                        return prop.toLowerCase().indexOf('html') >= 0;
                    }}).forEach(function (prop) {{
                        global[prop] = window[prop];
                    }});

                let head = $(document.head);
                let style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = bootstrapCss;
                head.append(style);

                let links = head.find('link');
                links.each((index, el)=>{{
                    let style = document.createElement('style');
                    style.type = 'test/css';
                    let path = '{UserBaseDirectoryPlaceholder}/' + el.href;
                    let css = fs.readFileSync(path, 'utf-8');
                    style.innerHTML = css;
                    head.append(style);
                }});

                links.remove();

                Object.keys(console)
                    .forEach(function (prop) {{
                        bgCoderConsole[prop] = console[prop];
                        console[prop] = new Function('');
                    }});

{NodeDisablePlaceholder}

                done();
            }}
        }});
    }});

    after(function() {{
        Object.keys(bgCoderConsole)
            .forEach(function (prop) {{
                console[prop] = bgCoderConsole[prop];
            }});
    }});";

        protected override string JsCodeEvaluation => TestsPlaceholder;

        protected override async Task<IExecutionResult<TestResult>> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            SaveZipSubmission(executionContext.FileContent, this.WorkingDirectory);
            this.ProgramEntryPath = FileHelpers.FindFileMatchingPattern(this.WorkingDirectory, EntryFileName);

            var codeToExecute = this.PreprocessJsSubmission(
                this.JsCodeTemplate,
                executionContext,
                this.ProgramEntryPath);

            var codeSavePath = FileHelpers.SaveStringToTempFile(this.WorkingDirectory, codeToExecute);
            var executor = this.CreateExecutor();

            result.Results.AddRange(await this.ProcessTests(
                executionContext,
                executor,
                executionContext.Input.GetChecker(),
                codeSavePath));

            File.Delete(codeSavePath);

            return result;
        }

        protected virtual string BuildTests(IEnumerable<TestContext> tests)
        {
            var testsCode = string.Empty;
            var testsCount = 1;
            foreach (var test in tests)
            {
                var code = Regex.Replace(test.Input, "([\\\\`$])", "\\$1");

                testsCode += $@"
                it('Test{testsCount++}', function(done) {{
                    this.timeout(10000);
            	    let content = `{code}`;

                    let testFunc = new Function({this.TestFuncVariables}, content);
                    testFunc.call({{}},{this.TestFuncVariables.Replace("'", string.Empty)});

                    done();
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

        protected virtual string PreprocessJsSubmission(
            string template,
            IExecutionContext<TestsInputModel> context,
            string pathToFile)
        {
            var userBaseDirectory = FileHelpers.FindFileMatchingPattern(this.WorkingDirectory, EntryFileName);
            userBaseDirectory = FileHelpers.ProcessModulePath(Path.GetDirectoryName(userBaseDirectory));

            var processedCode =
                template.Replace(RequiredModules, this.JsCodeRequiredModules)
                    .Replace(PreevaluationPlaceholder, this.JsCodePreevaulationCode)
                    .Replace(EvaluationPlaceholder, this.JsCodeEvaluation)
                    .Replace(PostevaluationPlaceholder, this.JsCodePostevaulationCode)
                    .Replace(NodeDisablePlaceholder, this.JsNodeDisableCode)
                    .Replace(UserInputPlaceholder, pathToFile)
                    .Replace(UserBaseDirectoryPlaceholder, userBaseDirectory)
                    .Replace(TestsPlaceholder, this.BuildTests(context.Input.Tests));

            return processedCode;
        }
    }

#pragma warning disable SA1402
    public class NodeJsZipExecuteHtmlAndCssStrategySettings : NodeJsPreprocessExecuteAndRunUnitTestsWithMochaExecutionStrategySettings
#pragma warning restore SA1402
    {
        public string JsDomModulePath { get; set; } = string.Empty;
        public string JQueryModulePath { get; set; } = string.Empty;
        public string BootstrapModulePath { get; set; } = string.Empty;
        public string BootstrapCssPath { get; set; } = string.Empty;
    }
}
