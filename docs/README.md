yyl-server-webpack-plugin / [Exports](modules.md)

# yyl-server-webpack-plugin

## 安装

```
yarn add yyl-server-webpack-plugin
```

## 使用

```typescript
// webpack.config.js
import YylServerWebpackPlugin from 'yyl-server-webpack-plugin'

module.exports = {
  plugins: [
    new YylServerWebpackPlugin({
      context: __dirname,
      static: './dist',
      port: 5000,
      enable: true,
      homePage: 'http://127.0.0.1:5000/html/index.html',
      proxy: {
        enable: true,
        hosts: ['//www.yy.com']
      }
    })
  ]
}
```

## types

[这里](./docs/modules.md)
