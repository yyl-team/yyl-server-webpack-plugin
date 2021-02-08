[yyl-server-webpack-plugin](../README.md) / [Exports](../modules.md) / YylServerWebpackPluginOption

# Interface: YylServerWebpackPluginOption

## Hierarchy

* *Pick*<YylWebpackPluginBaseOption, *context*\>

  ↳ **YylServerWebpackPluginOption**

## Table of contents

### Properties

- [context](yylserverwebpackpluginoption.md#context)
- [hmr](yylserverwebpackpluginoption.md#hmr)
- [homePage](yylserverwebpackpluginoption.md#homepage)
- [port](yylserverwebpackpluginoption.md#port)
- [proxy](yylserverwebpackpluginoption.md#proxy)
- [static](yylserverwebpackpluginoption.md#static)

## Properties

### context

• `Optional` **context**: *undefined* \| *string*

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:21

___

### hmr

• `Optional` **hmr**: *undefined* \| *boolean*

是否启动热更新

Defined in: [src/index.ts:21](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/bb0cae6/src/index.ts#L21)

___

### homePage

• `Optional` **homePage**: *undefined* \| *string*

构建成功后打开的页面

Defined in: [src/index.ts:30](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/bb0cae6/src/index.ts#L30)

___

### port

• `Optional` **port**: *undefined* \| *number*

本地服务端口

Defined in: [src/index.ts:19](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/bb0cae6/src/index.ts#L19)

___

### proxy

• `Optional` **proxy**: *undefined* \| { `enable?`: *undefined* \| *boolean* ; `hosts?`: *undefined* \| *string*[]  }

需要代理的域名

Defined in: [src/index.ts:23](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/bb0cae6/src/index.ts#L23)

___

### static

• `Optional` **static**: *undefined* \| *string*

本地服务根目录

Defined in: [src/index.ts:17](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/bb0cae6/src/index.ts#L17)
