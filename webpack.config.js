var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: './src/settings.js',
    output: {
        path: path.join(__dirname, 'dist/'),
        publicPath: '',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/, loader: ExtractTextPlugin.extract(
                'style', 'css?sass!jsontosass?path=./src/sass/shema.json')
            },
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
            {test: /\.png$/, loader: 'file-loader'},
            {test: /\.png$/, loader: "url-loader?prefix=img/&limit=8192"},
            {test: /\.jpg$/, loader: "url-loader?prefix=img/&limit=8192"},
            {test: /\.gif$/, loader: "url-loader?prefix=img/&limit=8192"},
            {test: /\.woff$/, loader: "url-loader?prefix=font/&limit=8192"},
            {test: /\.eot$/, loader: "file-loader?prefix=font/"},
            {test: /\.ttf$/, loader: "file-loader?prefix=font/"},
            {test: /\.svg$/, loader: "file-loader?prefix=font/"}
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css')
    ]
};
