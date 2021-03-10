[yyl-server-webpack-plugin](../README.md) / [Exports](../modules.md) / YylServerWebpackPluginOption

# Interface: YylServerWebpackPluginOption

## Hierarchy

- _Pick_<YylWebpackPluginBaseOption, _context_\>

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

• `Optional` **context**: _undefined_ \| _string_

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:15

---

### hmr

• `Optional` **hmr**: _undefined_ \| _boolean_

是否启动热更新

Defined in: src/index.ts:21

---

### homePage

• `Optional` **homePage**: _undefined_ \| _string_

构建成功后打开的页面

Defined in: src/index.ts:30

---

### port

• `Optional` **port**: _undefined_ \| _number_

本地服务端口

Defined in: src/index.ts:19

---

### proxy

• `Optional` **proxy**: _undefined_ \| { `enable?`: _undefined_ \| _boolean_ ; `hosts?`: _undefined_ \| _string_[] }

需要代理的域名

Defined in: src/index.ts:23

---

### static

• `Optional` **static**: _undefined_ \| _string_

本地服务根目录

Defined in: src/index.ts:17
