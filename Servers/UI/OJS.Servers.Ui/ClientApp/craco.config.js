const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const fixHtmlPlugin = (config) => {
    const [ htmlPlugin, ...rest ] = config.plugins;
    const filename = path.join(__dirname, '../Views/Home/Index.cshtml');
    const template = path.join(__dirname, '../Views/Home/Index.template.html');
    htmlPlugin.options = {
        ...htmlPlugin.options,
        filename,
        template,
    };
    
    htmlPlugin.userOptions = {
        ...htmlPlugin.userOptions,
        filename,
        template,        
    };
    
    console.log(filename);
    console.log(htmlPlugin);
    console.log(JSON.stringify(htmlPlugin));

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

// const decorateWebpack = (config, ...funcs) => smp.wrap(funcs
//     .reduce((c, func) => func(c), config));

const decorateWebpack = (config, ...funcs) => funcs
    .reduce((c, func) => func(c), config);


module.exports = {
    reactScriptsVersion: 'react-scripts',
    eslint: { enable: false },
    webpack: {
        configure: (webpackConfig) => decorateWebpack(
            webpackConfig,
            fixHtmlPlugin,
            addMonacoPlugin,
        ),
    },
    devServer: (config) => {
        const { historyApiFallback } = config;

        return {
            ...config,
            devMiddleware: {
                ...config.devMiddleware,
                writeToDisk: true,
            },
            historyApiFallback: {
                ...historyApiFallback,
                index: '/',
            },
        };
    },

};
