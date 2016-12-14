'use strict';

const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssNano = require('cssnano');
const amqp = require('amqplib/callback_api');

var callback = function (err, stats, ch, msg) {
    console.log(stats.toString({colors: true}));
    let response = 'Done';
    ch.sendToQueue(msg.properties.replyTo,
        new Buffer(response.toString()),
        {correlationId: msg.properties.correlationId});

    ch.ack(msg);
};

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        const q = 'rpc_build-template';

        ch.assertQueue(q, {durable: false});
        ch.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        ch.consume(q, function reply(msg) {

            let jsonPug = JSON.parse(msg.content.toString());
            let pathToMainPugTemplate = './src/pugs/body.pug';
            let pathToFavicon = './src/favicon.ico';

            let title = 'Jade demo';

            let webpackConfig =
            {
                entry: './src/settings.js',
                output: {
                    path: path.join(__dirname, 'dist/'),
                    publicPath: '',
                    filename: 'bundle.js'
                },

                module: {
                    loaders: [
                        {
                            test: /\.pug$/,
                            loader: 'pug-html-loader',
                            query: {
                                data: jsonPug,
                                pretty: true
                            }
                        },
                        {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
                        {test: /\.png$/, loader: 'file-loader?name=[name].[ext]'},
                        {test: /\.png$/, loader: "url-loader?prefix=img/&limit=8192"},
                        {test: /\.jpg$/, loader: "url-loader?prefix=img/&limit=8192",},
                        {test: /\.gif$/, loader: "url-loader?prefix=img/&limit=8192"},
                        {test: /\.woff$/, loader: "url-loader?prefix=font/&limit=8192"},
                        {test: /\.eot$/, loader: "file-loader?prefix=font/"},
                        {test: /\.ttf$/, loader: "file-loader?prefix=font/"},
                        {test: /\.svg$/, loader: "file-loader?prefix=font/"}
                    ]
                },
                plugins: [
                    new ExtractTextPlugin('styles.css'),
                    new HtmlWebpackPlugin({
                        filename: 'index.html',
                        favicon: pathToFavicon,
                        template: pathToMainPugTemplate,
                        title: title,
                    }),
                    new webpack.optimize.DedupePlugin(),
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false,
                        },
                    }),
                    new OptimizeCssAssetsPlugin({
                        assetNameRegExp: /\.optimize\.css$/g,
                        cssProcessor: CssNano,
                        cssProcessorOptions: {discardComments: {removeAll: true}},
                        canPrint: true
                    }),
                    new CopyWebpackPlugin([
                        {from: 'static'}
                    ])
                ]
            };
            webpack(webpackConfig, (err, stats) => callback(err, stats, ch, msg));
        });
    });
});
