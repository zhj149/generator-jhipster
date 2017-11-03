<%#
 Copyright 2013-2017 the original author or authors from the JHipster project.

    This file is part of the JHipster project, see http://www.jhipster.tech/
    for more information.

        Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
limitations under the License.
-%>
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('./utils.js');
module.exports = options => ({
  cache: options.env !== 'production',
  resolve: {
    extensions: [
      '.js', '.jsx', '.ts', '.tsx', '.json'
    ],
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
        loaders: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]']
      },
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loaders: 'tslint-loader',
        exclude: ['node_modules']
      }
    ]
  },
  stats: {
    children: false
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(options.env),
        version: JSON.stringify(utils.parseVersion())
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['main'],
      minChunks: module => utils.isExternalLib(module)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['manifest'],
      minChunks: Infinity
    }),
    new CopyWebpackPlugin([
      {
        from: './src/main/webapp/swagger-ui/',
        to: 'swagger-ui'
      }, {
        from: './node_modules/swagger-ui/dist/css',
        to: 'swagger-ui/dist/css'
      }, {
        from: './node_modules/swagger-ui/dist/lib',
        to: 'swagger-ui/dist/lib'
      }, {
        from: './node_modules/swagger-ui/dist/swagger-ui.min.js',
        to: 'swagger-ui/dist/swagger-ui.min.js'
      }, {
        from: './src/main/webapp/static/',
        to: 'static'
      }, {
        from: './src/main/webapp/favicon.ico',
        to: 'favicon.ico'
      }, {
        from: './src/main/webapp/robots.txt',
        to: 'robots.txt'
      }
    ]),
    new HtmlWebpackPlugin({
      template: './src/main/webapp/index.html',
      chunksSortMode: 'dependency',
      inject: 'body'
    })
  ]
});