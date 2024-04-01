namespace OJS.Workers.ExecutionStrategies.NodeJs.V20;

using OJS.Workers.Common.Models;
using OJS.Workers.Executors;

public class NodeJsV20PreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy
    : NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy<NodeJsPreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategySettings>
{
    public NodeJsV20PreprocessExecuteAndRunCodeAgainstUnitTestsWithMochaExecutionStrategy(
        ExecutionStrategyType type,
        IProcessExecutorFactory processExecutorFactory,
        IExecutionStrategySettingsProvider settingsProvider)
        : base(type, processExecutorFactory, settingsProvider)
    {
    }

    protected override string JsCodePreevaulationCode => @"
chai.use(sinonChai);
let bgCoderConsole = {};
before(function(done) {
        const dom = new jsdom.JSDOM('', {
            runScripts: 'dangerously',
            resources: 'usable'
        });

        global.window = dom.window;
        global.document = dom.window.document;
        global.$ = jq(dom.window);
        global.handlebars = handlebars; // Include this line only if you're using Handlebars

        Object.getOwnPropertyNames(dom.window)
            .filter(function(prop) {
                return prop.toLowerCase().indexOf('html') >= 0;
            }).forEach(function(prop) {
                global[prop] = dom.window[prop];
            });

        Object.keys(console)
            .forEach(function(prop) {
                bgCoderConsole[prop] = console[prop];
                console[prop] = new Function('');
            });

        done();
    });

after(function() {
    Object.keys(bgCoderConsole)
        .forEach(function (prop) {
            console[prop] = bgCoderConsole[prop];
        });
});";
}