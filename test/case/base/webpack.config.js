'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const IPlugin = require('../../../')

console.log(IPlugin)

// + plugin options
const iPluginOption = {
  context: __dirname,
  static: './dist',
  port: 5000,
  enable: true,
  homePage: 'http://127.0.0.1:5000/html/index.html',
  proxy: {
    enable: true,
    hosts: ['//www.yy.com']
  }
}
// - plugin options

const wConfig = merge({
  mode: 'development',
  context: __dirname,
  entry: {
    main: ['./src/entry/index/index.js']
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'js/[name]-[chunkhash:8].js',
    chunkFilename: 'js/async_component/[name]-[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    alias: {
      jsDest: './dist/js'
    }
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/entry/index/index.html',
      filename: 'html/index.html',
      chunks: 'all'
    }),
    new IPlugin(iPluginOption)
  ],
  devServer: {
    writeToDisk: true,
    contentBase: path.join(__dirname, './dist'),
    port: 5000
  }
})

module.exports = wConfig
