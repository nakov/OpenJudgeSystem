module.exports = {
    devServer: function (configFunction) {
        return function (proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost);
            console.log(JSON.stringify(config));
            config.writeToDisk = true;
            config.historyApiFallback = {
                ...config.historyApiFallback,
                "index": "/home/index",
            };
            return config;
        };
    },
}