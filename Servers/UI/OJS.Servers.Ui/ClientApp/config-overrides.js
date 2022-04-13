const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const fixHtmlPlugin = (config) => {
    console.log(' --- Fixing HTML ---');
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

const addMonacoPlugin = (config) => {
    console.log(' --- Adding Monaco ---');
    const monacoPlugin = new MonacoWebpackPlugin({
        languages: [
            'python',
            'javascript',
            'csharp',
            'java',
            'cpp',
            'go',
            'php',
        ],
    });

    return {
        ...config,
        plugins: [
            ...config.plugins,
            monacoPlugin,
        ],
    };
};

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
    webpack: (config) => decorateWebpack(
        config,
        // addMonacoPlugin,
        fixHtmlPlugin,
        addMonacoPlugin,
    ),
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
