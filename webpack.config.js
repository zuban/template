var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: './src/styles.js',
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
            {test: /\.png$/, loader: 'file-loader'},
            {test: /\.jade$/, loader: 'jade'},
        ]
    },
    plugins: []
};
