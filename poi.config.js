/*
 * @Author: 卓文理
 * @Email: 531840344@qq.com
 * @Date: 2017-08-22 15:05:24
 */

'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (options, req) => ({
    entry: 'src/index.js',
    host: '0.0.0.0',
    filename: {
        js: '[name].js',
        css: '[name].css',
        static: 'static/[name]-[hash].[ext]'
    },
    html: {
        title: 'New Tabs',
        template: 'index.html'
    },
    resolve: true,
    sourceMap: !!options.dev,
    extendWebpack(cfg) {
        // Disable progress bar while building
        // cfg.plugins.delete('progress-bar');
    },
    webpack(cfg) {
        cfg.resolve.modules.push(path.resolve('src'));
        cfg.resolve.alias.vue$ = 'vue/dist/vue.js';

        // 添加复制静态文件的插件
        cfg.plugins.push(
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, 'static'),
                    to: path.resolve(__dirname, 'dist'),
                    ignore: ['.*']
                }
            ])
        );

        if (!options.dev) {
            cfg.devtool = false;
            cfg.bail = true;
        } else {
            cfg.devtool = 'source-map';
        }

        return cfg;
    },
    vendor: options.mode === 'test' ? false : Object.keys(require('./package.json').dependencies)
});

