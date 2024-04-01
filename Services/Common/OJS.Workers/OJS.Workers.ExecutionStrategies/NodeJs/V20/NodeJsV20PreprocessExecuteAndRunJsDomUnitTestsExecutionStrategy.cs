namespace OJS.Workers.ExecutionStrategies.NodeJs.V20;

using OJS.Workers.Common.Models;
using OJS.Workers.Executors;

public class NodeJsV20PreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy
    : NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy<NodeJsPreprocessExecuteAndRunJsDomUnitTestsExecutionStrategySettings>
{
    public NodeJsV20PreprocessExecuteAndRunJsDomUnitTestsExecutionStrategy(
        ExecutionStrategyType type,
        IProcessExecutorFactory processExecutorFactory,
        IExecutionStrategySettingsProvider settingsProvider)
        : base(type, processExecutorFactory, settingsProvider)
    {
    }

    protected override string JsCodePreevaulationCode => @"
chai.use(sinonChai);
describe('TestDOMScope', function() {
    let bgCoderConsole = {};
    before(function(done) {
    const dom = new jsdom.JSDOM(``);
    const { window } = dom;

    // define innerText manually to work as textContent
    Object.defineProperty(window.Element.prototype, 'innerText', {
        get() { return this.textContent; },
        set(value) { this.textContent = value; }
    });

    global.window = window;
    global.document = window.document;
    global.$ = jq(window);
    global.handlebars = handlebars;

    Object.getOwnPropertyNames(window)
        .filter(function(prop) {
            return prop.toLowerCase().indexOf('html') >= 0;
        }).forEach(function(prop) {
            global[prop] = window[prop];
        });

    Object.keys(console)
        .forEach(function(prop) {
            bgCoderConsole[prop] = console[prop];
            console[prop] = function() {}; // replacing new Function('') with an empty function
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