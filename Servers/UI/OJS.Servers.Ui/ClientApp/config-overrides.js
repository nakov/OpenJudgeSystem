const path = require('path');

module.exports = {
    paths: (paths) => {
        const appHtml = path.join(__dirname, '../Views/Home/Index.template.html');
        console.log(appHtml);
        return {
            ...paths,
            appHtml,
        };
    },
    webpack: (config) => {
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
    },
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
