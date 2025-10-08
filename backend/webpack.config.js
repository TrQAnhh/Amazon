const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function (options) {
    return {
        ...options,
        plugins: [
            ...(options.plugins || []),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'libs/common/src/email/templates',
                        to: 'libs/common/email/templates',
                    },
                ],
            }),
        ],
    };
};