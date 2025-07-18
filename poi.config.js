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

        // 添加路径别名以支持性能优化
        cfg.resolve.alias['@'] = path.resolve(__dirname, 'src');
        cfg.resolve.alias['@utils'] = path.resolve(__dirname, 'src/utils');
        cfg.resolve.alias['@components'] = path.resolve(__dirname, 'src/components');

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

        // 性能优化配置
        if (!options.dev) {
            cfg.devtool = false;
            cfg.bail = true;

            // 生产环境优化
            cfg.optimization = cfg.optimization || {};
            cfg.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10,
                        reuseExistingChunk: true
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            };

            // 启用模块连接优化
            cfg.optimization.concatenateModules = true;

            // 启用副作用标记
            cfg.optimization.sideEffects = false;
        } else {
            cfg.devtool = 'source-map';
        }

        return cfg;
    },
    vendor: options.mode === 'test' ? false : Object.keys(require('./package.json').dependencies)
});

