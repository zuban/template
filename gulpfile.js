'use strict'

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const template = require('./src/template.jade');
const pug = require('pug');
var sass = require('gulp-sass');

var jsonSass = require('gulp-json-sass'),
    concat = require('gulp-concat');


// const scr = require('./src/styles');
// var favicon = require('./src/favicon.ico');
// The development server
gulp.task('default', ['webpack:build']);

// Production build
gulp.task('build', ['webpack:build']);


const sassTask = (jsonShema, file, fileName) => {
    return gulp
        .src([jsonShema, file])
        .pipe(jsonSass({
            sass: true
        }))
        .pipe(concat(fileName))
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./out/'));
};

gulp.task('webpack:build', (callback) => {
    const config = Object.create(webpackConfig);
    config.plugins = config.plugins || [];
    config.plugins = config.plugins.concat(
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: './src/favicon.ico',
            template: './src/template.html',
            title: 'Jade demo',
        }),
        new ExtractTextPlugin('styles.css')
    );

    config.module.loaders = config.module.loaders || [];
    config.module.loaders = config.module.loaders.concat(
        {
            test: /\.scss$/, loader: ExtractTextPlugin.extract(
            "style",
            "css!sass!jsontosass?path=./sass/example.json")
        }
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

gulp.task('webpack-dev-server', () => {
    // // modify some webpack config options
    // const config = Object.create(webpackConfig);
    // const domain = 'localhost';
    // const port = '8080';
    //
    // config.devtool = 'eval';
    // config.debug = true;
    // config.plugins = config.plugins || [];
    // config.plugins.push(new webpack.DefinePlugin({
    //     __DEVELOPMENT__: true,
    //     __USE_MOCK__: !!process.env.USE_MOCK,
    // }));
    //
    // // Start a webpack-dev-server
    // new WebpackDevServer(webpack(config), {
    //     contentBase: 'public',
    //     publicPath: '/static/scripts',
    //     historyApiFallback: true,
    //     quite: false,
    //     stats: {
    //         assets: false,
    //         colors: true,
    //         version: false,
    //         hash: false,
    //         timings: false,
    //         chunks: false,
    //         chunkModules: false,
    //     },
    // }).listen(port, domain, err => {
    //     if (err) {
    //         throw new gutil.PluginError('webpack-dev-server', err);
    //     }
    //     gutil.log('[webpack-dev-server]', 'http://localhost:8080/');
    // });


});
