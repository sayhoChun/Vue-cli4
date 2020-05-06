const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src/')
            }
        }
    },
    chainWebpack: config => {
        config.performance
            .maxEntrypointSize(400000)
            .maxAssetSize(400000)
    }
}