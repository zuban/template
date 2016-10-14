'use strict'

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// The development server
gulp.task('default', ['webpack:build']);

gulp.task('webpack:build', (callback) => {

    let pathToJsonSass = './src/sass/shema.json';
    let pathToMainPugTemplate = './src/pugs/body.pug';
    let pathToFavicon = './src/favicon.ico';
    let jsonPug = {
        field: 'this is string from json'
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
        new ExtractTextPlugin('styles.css')
    );

    config.module.loaders = config.module.loaders || [];
    config.module.loaders = config.module.loaders.concat([
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract(
                'style',
                'css!sass!jsontosass?path=' + pathToJsonSass)
        }, {
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
        callback();
    });
});
