const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        globalObject: 'this',
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    target: 'node',
    externals: [nodeExternals(),{"../config/config.json":"commonjs ./config/config.json","./config/config.json":"commonjs ./config/config.json"}],
    module: {
        rules: [
            {
                test: /\.css/,
                use: ["ignore-loader"]
            }
        ]
    },
}