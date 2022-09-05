const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const fixHtmlPlugin = (config) => {
    const [ htmlPlugin, ...rest ] = config.plugins;
    const filename = path.join(__dirname, '../Views/Home/Index.cshtml');

    htmlPlugin.options = {
        ...htmlPlugin.options,
        filename,
    };

    return {
        ...config,
        plugins: [
            htmlPlugin,
            ...rest,
        ],
    };
};

const addMonacoPlugin = (config) => ({
    ...config,
    plugins: [
        ...config.plugins,
        new MonacoWebpackPlugin({
            languages: [
                'python',
                'javascript',
                'csharp',
                'java',
                'cpp',
                'go',
                'php',
            ],
        }),
    ],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const smp = new SpeedMeasurePlugin();

const decorateWebpack = (config, ...funcs) => funcs
    .reduce((c, func) => func(c), config);

module.exports = {
    paths: (paths) => {
        const appHtml = path.join(__dirname, '../Views/Home/Index.template.html');

        return {
            ...paths,
            appHtml,
        };
    },
    webpack: (config) => decorateWebpack(config, fixHtmlPlugin, addMonacoPlugin),
    devServer(configFunction) {
        return function (proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost);
            const { historyApiFallback } = config;

            return {
                ...config,
                writeToDisk: true,
                historyApiFallback: {
                    ...historyApiFallback,
                    index: '/',
                },
            };
        };
    },
};
