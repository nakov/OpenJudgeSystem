#nullable disable
namespace OJS.Workers.ExecutionStrategies.NodeJs
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Extensions;
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
            string nodeJsExecutablePath,
            string mochaModulePath,
            string chaiModulePath,
            string jsdomModulePath,
            string jqueryModulePath,
            string handlebarsModulePath,
            string sinonModulePath,
            string sinonChaiModulePath,
            string underscoreModulePath,
            string browserifyModulePath,
            string babelifyModulePath,
            string ecmaScriptImportPluginPath,
            int baseTimeUsed,
            int baseMemoryUsed)
            : base(
                processExecutorFactory,
                nodeJsExecutablePath,
                mochaModulePath,
                chaiModulePath,
                jsdomModulePath,
                jqueryModulePath,
                handlebarsModulePath,
                sinonModulePath,
                sinonChaiModulePath,
                underscoreModulePath,
                baseTimeUsed,
                baseMemoryUsed)
        {
            if (!Directory.Exists(browserifyModulePath))
            {
                throw new ArgumentException(
                    $"Browsrify not found in: {browserifyModulePath}",
                    nameof(browserifyModulePath));
            }

            if (!Directory.Exists(babelifyModulePath))
            {
                throw new ArgumentException(
                    $"Babel not found in: {babelifyModulePath}",
                    nameof(babelifyModulePath));
            }

            if (!Directory.Exists(ecmaScriptImportPluginPath))
            {
                throw new ArgumentException(
                    $"ECMAScript2015ImportPluginPath not found in: {ecmaScriptImportPluginPath}",
                    nameof(ecmaScriptImportPluginPath));
            }

            this.BrowserifyModulePath = FileHelpers.ProcessModulePath(browserifyModulePath);
            this.BabelifyModulePath = FileHelpers.ProcessModulePath(babelifyModulePath);
            this.EcmaScriptImportPluginPath = FileHelpers.ProcessModulePath(ecmaScriptImportPluginPath);
        }

        protected string BrowserifyModulePath { get; }

        protected string BabelifyModulePath { get; }

        protected string EcmaScriptImportPluginPath { get; }

        protected string ProgramEntryPath { get; set; }

        protected override IEnumerable<string> AdditionalExecutionArguments
            => new[] { DelayFlag }.Concat(base.AdditionalExecutionArguments);

        protected override string JsCodeRequiredModules => base.JsCodeRequiredModules + @",
    browserify = require('" + this.BrowserifyModulePath + @"'),
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
    .transform('" + this.BabelifyModulePath + @"', { plugins: ['" + this.EcmaScriptImportPluginPath + @"']})
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

        protected override IExecutionResult<TestResult> ExecuteAgainstTestsInput(
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
            var executor = this.CreateExecutor(ProcessExecutorType.Restricted);

            // Process tests
            result.Results.AddRange(this.ProcessTests(
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

        protected virtual string PreprocessJsSubmission(
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
    }
}
