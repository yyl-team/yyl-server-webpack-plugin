[yyl-server-webpack-plugin](../README.md) / [Exports](../modules.md) / YylServerWebpackPluginOption

# Interface: YylServerWebpackPluginOption

## Hierarchy

* *Pick*<YylWebpackPluginBaseOption, *context*\>

  ↳ **YylServerWebpackPluginOption**

## Table of contents

### Properties

- [context](yylserverwebpackpluginoption.md#context)
- [enable](yylserverwebpackpluginoption.md#enable)
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

### enable

• `Optional` **enable**: *undefined* \| *boolean*

是否启动插件

Defined in: [src/index.ts:30](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L30)

___

### hmr

• **hmr**: *boolean*

是否启动热更新

Defined in: [src/index.ts:21](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L21)

___

### homePage

• `Optional` **homePage**: *undefined* \| *string*

构建成功后打开的页面

Defined in: [src/index.ts:28](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L28)

___

### port

• **port**: *number*

本地服务端口

Defined in: [src/index.ts:19](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L19)

___

### proxy

• `Optional` **proxy**: *undefined* \| { `enable`: *boolean* ; `hosts`: *string*[]  }

需要代理的域名

Defined in: [src/index.ts:23](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L23)

___

### static

• **static**: *string*

本地服务根目录

Defined in: [src/index.ts:17](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L17)
