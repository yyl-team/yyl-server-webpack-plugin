/* eslint-disable node/no-extraneous-require */
const extOs = require('yyl-os')
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const util = require('yyl-util')
const extFs = require('yyl-fs')
const request = require('supertest')

jest.setTimeout(30000)

test('case base test', async () => {
  const targetPath = path.join(__dirname, '../case/middleware')
  const distPath = path.join(targetPath, 'dist')

  await extFs.removeFiles(distPath)
  await extFs.mkdirSync(distPath)

  if (!fs.existsSync(path.join(targetPath, 'node_modules'))) {
    await extOs.runSpawn('yarn install', targetPath)
  }

  process.chdir(targetPath)
  const start = require(path.join(targetPath, 'compiler.js'))

  const { app, compiler } = await start()

  request(app)
    .get('/proxy_www_yy_com/yyweb/module/data/header')
    .expect(200)
    .end((err) => {
      if (err) {
        throw err
      }
    })

  await new Promise((resolve) => {
    compiler.close(() => {
      resolve()
    })
  })
})
