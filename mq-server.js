'use strict'

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssNano = require('cssnano');
const amqp = require('amqplib/callback_api');


//start processing template
const pathToJsonSass = './src/sass/shema.json';
const pathToMainPugTemplate = './src/pugs/body.pug';
const pathToFavicon = './src/favicon.ico';


amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        const q = 'rpc_build-template';

        ch.assertQueue(q, {durable: false});
        ch.prefetch(1);
        console.log(' [x] Awaiting RPC requests');
        ch.consume(q, function reply(msg) {
            // var n = parseInt(msg.content.toString());

            console.log(" [.] fib() " + JSON.stringify(msg.content.toString()));


            let jsonPug = {
                field: 'Print Film Instagram Contact'
            };
            let title = 'Jade demo';

            const config = Object.create(webpackConfig);
            config.plugins = config.plugins || [];
            config.plugins = config.plugins.concat(
                new HtmlWebpackPlugin({
                    filename: 'index.html',
                    favicon: pathToFavicon,
                    template: pathToMainPugTemplate,
                    title: title,
                }),
                new ExtractTextPlugin('styles.css'),
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
                })
            );


            config.module.loaders = config.module.loaders || [];
            config.module.loaders = config.module.loaders.concat([
                {
                    test: /\.pug$/,
                    loader: 'pug-html-loader',
                    query: {
                        data: jsonPug,
                        pretty: true
                    }
                }]
            );

            // run webpack
            webpack(config, (err, stats) => {
                if (err) {
                    throw new gutil.PluginError('webpack:build', err);
                }
                gutil.log('[webpack:build]', stats.toString({
                    colors: true,
                }));
                console.log(' [x] server done');
                var r = ' [x] server done';
                ch.sendToQueue(msg.properties.replyTo,
                    new Buffer(r.toString()),
                    {correlationId: msg.properties.correlationId});

                ch.ack(msg);
            });
            //end processing template

        });
    });
});

