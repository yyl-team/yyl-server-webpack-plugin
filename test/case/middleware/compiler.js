const webpack = require('webpack')
const path = require('path')
const IPlugin = require('../../../')
const express = require('express')
const serveStatic = require('serve-static')
const wConfig = require('./webpack.config')

module.exports = function start() {
  return new Promise((resolve) => {
    const compiler = webpack(wConfig)
    const app = express()
    app.use(serveStatic(path.join(__dirname, 'dist')))
    IPlugin.initProxyMiddleware({
      app,
      proxy: {
        enable: true,
        hosts: ['//9u9ntpb8xp.api.quickmocker.com/']
      },
      logger(...args) {
        console.log(...args)
      }
    })
    // compiler.run((err, result) => {
    //   console.log(result.toString())
    //   resolve({
    //     app,
    //     compiler
    //   })
    // })
    compiler.watch({}, (err, result) => {
      console.log(result.toString())
      resolve({
        app,
        compiler
      })
    })
  })
}
