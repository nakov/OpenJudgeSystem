#nullable disable
namespace OJS.Workers.ExecutionStrategies.NodeJs
{
    using FluentExtensions.Extensions;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;
    using OJS.Workers.ExecutionStrategies.Models;
    using OJS.Workers.Executors;

    using static OJS.Workers.ExecutionStrategies.NodeJs.NodeJsConstants;

    public class NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategy :
        NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy
    {
        protected const string AppJsFileName = "app.js";

        public NodeJsZipPreprocessExecuteAndRunUnitTestsWithDomAndMochaExecutionStrategy(
            IProcessExecutorFactory processExecutorFactory,
            StrategySettings settings)
            : base(processExecutorFactory, settings)
        {
            if (!Directory.Exists(settings.BrowserifyModulePath))
            {
                throw new ArgumentException(
                    $"Browsrify not found in: {settings.BrowserifyModulePath}",
                    nameof(settings.BrowserifyModulePath));
            }

            if (!Directory.Exists(settings.BabelifyModulePath))
            {
                throw new ArgumentException(
                    $"Babel not found in: {settings.BabelifyModulePath}",
                    nameof(settings.BabelifyModulePath));
            }

            if (!Directory.Exists(settings.EcmaScriptImportPluginPath))
            {
                throw new ArgumentException(
                    $"ECMAScript2015ImportPluginPath not found in: {settings.EcmaScriptImportPluginPath}",
                    nameof(settings.EcmaScriptImportPluginPath));
            }

            settings.BrowserifyModulePath = FileHelpers.ProcessModulePath(settings.BrowserifyModulePath);
            settings.BabelifyModulePath = FileHelpers.ProcessModulePath(settings.BabelifyModulePath);
            settings.EcmaScriptImportPluginPath = FileHelpers.ProcessModulePath(settings.EcmaScriptImportPluginPath);

            this.Settings = settings;
        }

        protected override StrategySettings Settings { get; }

        protected string ProgramEntryPath { get; set; }

        protected override IEnumerable<string> AdditionalExecutionArguments
            => new[] { DelayFlag }.Concat(base.AdditionalExecutionArguments);

        protected override string JsCodeRequiredModules => base.JsCodeRequiredModules + @",
    browserify = require('" + this.Settings.BrowserifyModulePath + @"'),
    streamJs = require('stream'),
    stream = new streamJs.PassThrough();";

        protected override string JsCodeTemplate =>
            RequiredModules + @";" +
            PreevaluationPlaceholder +
            EvaluationPlaceholder +
            PostevaluationPlaceholder;

        protected override string JsCodePreevaulationCode => @"
chai.use(sinonChai);
let userBundleCode = '';
stream.on('data', function (x) {
    userBundleCode += x;
});
stream.on('end', function(){
    afterBundling(userBundleCode);
    run();
});
browserify('" + UserInputPlaceholder + @"')
    .transform('" + this.Settings.BabelifyModulePath + @"', { plugins: ['" + this.Settings.EcmaScriptImportPluginPath + @"']})
    .bundle()
    .pipe(stream);

function afterBundling() {
    describe('TestDOMScope', function() {
    let bgCoderConsole = {};
        before(function(done) {" +
            NodeDisablePlaceholder + @"
            jsdom.env({
                html: '',
                done: function(errors, window) {
                    global.window = window;
                    global.document = window.document;
                    global.$ = jq(window);
                    global.handlebars = handlebars;
                    Object.getOwnPropertyNames(window)
                        .filter(function (prop) {
                            return prop.toLowerCase().indexOf('html') >= 0;
                        }).forEach(function (prop) {
                            global[prop] = window[prop];
                        });

                    Object.keys(console)
                        .forEach(function (prop) {
                            bgCoderConsole[prop] = console[prop];
                            console[prop] = new Function('');
                        });

                    done();
                }
            });
        });

        after(function() {
            Object.keys(bgCoderConsole)
                .forEach(function (prop) {
                    console[prop] = bgCoderConsole[prop];
                });
        });";

        protected override string JsCodeEvaluation => @"
            " + TestsPlaceholder;

        protected override string JsCodePostevaulationCode => @"
    });
}";

        protected override async Task<IExecutionResult<TestResult>> ExecuteAgainstTestsInput(
            IExecutionContext<TestsInputModel> executionContext,
            IExecutionResult<TestResult> result)
        {
            // Copy and unzip the file (save file to WorkingDirectory)
            SaveZipSubmission(executionContext.FileContent, this.WorkingDirectory);
            this.ProgramEntryPath = FileHelpers.FindFileMatchingPattern(this.WorkingDirectory, AppJsFileName);

            // Replace the placeholders in the JS Template with the real values
            var codeToExecute = this.PreprocessJsSubmission(
                this.JsCodeTemplate,
                executionContext,
                this.ProgramEntryPath);

            // Save code to file
            var codeSavePath = FileHelpers.SaveStringToTempFile(this.WorkingDirectory, codeToExecute);

            // Create a Restricted Process Executor
            var executor = this.CreateExecutor();

            // Process tests
            result.Results.AddRange(await this.ProcessTests(
                executionContext,
                executor,
                executionContext.Input.GetChecker(),
                codeSavePath));

            // Clean up
            File.Delete(codeSavePath);

            return result;
        }

        protected override string BuildTests(IEnumerable<TestContext> tests)
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

                    let testFunc = new Function({this.TestFuncVariables},'code', content);
                    testFunc.call({{}},{this.TestFuncVariables.Replace("'", string.Empty)}, userBundleCode);

                    done();
                }});";
            }

            return testsCode;
        }

        protected string PreprocessJsSubmission(
            string template,
            IExecutionContext<TestsInputModel> context,
            string pathToFile)
        {
            var processedCode =
                template.Replace(RequiredModules, this.JsCodeRequiredModules)
                    .Replace(PreevaluationPlaceholder, this.JsCodePreevaulationCode)
                    .Replace(EvaluationPlaceholder, this.JsCodeEvaluation)
                    .Replace(PostevaluationPlaceholder, this.JsCodePostevaulationCode)
                    .Replace(NodeDisablePlaceholder, this.JsNodeDisableCode)
                    .Replace(UserInputPlaceholder, pathToFile)
                    .Replace(TestsPlaceholder, this.BuildTests(context.Input.Tests));

            return processedCode;
        }

        public new class StrategySettings : NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy.StrategySettings
        {
            public string BrowserifyModulePath { get; set; } = string.Empty;
            public string BabelifyModulePath { get; set; } = string.Empty;
            public string EcmaScriptImportPluginPath { get; set; } = string.Empty;
        }
    }
}
