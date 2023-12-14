const { composePlugins, withNx } = require('@nx/webpack');
const { merge } = require('webpack-merge');

module.exports = composePlugins(withNx(), (config) => {
    return merge(config, {
        ignoreWarnings: [/Failed to parse source map/]
    });
});
