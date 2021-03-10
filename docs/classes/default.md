[yyl-server-webpack-plugin](../README.md) / [Exports](../modules.md) / default

# Class: default

## Hierarchy

- _YylWebpackPluginBase_

  ↳ **default**

## Table of contents

### Constructors

- [constructor](default.md#constructor)

### Properties

- [assetMap](default.md#assetmap)
- [context](default.md#context)
- [filename](default.md#filename)
- [name](default.md#name)
- [option](default.md#option)

### Methods

- [addDependencies](default.md#adddependencies)
- [apply](default.md#apply)
- [getFileName](default.md#getfilename)
- [getFileType](default.md#getfiletype)
- [initCompilation](default.md#initcompilation)
- [updateAssets](default.md#updateassets)
- [getHooks](default.md#gethooks)
- [getName](default.md#getname)

## Constructors

### constructor

\+ **new default**(`option?`: [_YylServerWebpackPluginOption_](../interfaces/yylserverwebpackpluginoption.md)): [_default_](default.md)

#### Parameters:

| Name      | Type                                                                            |
| --------- | ------------------------------------------------------------------------------- |
| `option?` | [_YylServerWebpackPluginOption_](../interfaces/yylserverwebpackpluginoption.md) |

**Returns:** [_default_](default.md)

Defined in: src/index.ts:75

## Properties

### assetMap

• **assetMap**: ModuleAssets

assetsMap

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:55

---

### context

• **context**: _string_

相对路径

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:49

---

### filename

• **filename**: _string_

输出文件格式

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:53

---

### name

• **name**: _string_

组件名称

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:51

---

### option

• **option**: _Required_<[_YylServerWebpackPluginOption_](../interfaces/yylserverwebpackpluginoption.md)\>

Defined in: src/index.ts:65

## Methods

### addDependencies

▸ **addDependencies**(`op`: AddDependenciesOption): _void_

添加监听文件

#### Parameters:

| Name | Type                  |
| ---- | --------------------- |
| `op` | AddDependenciesOption |

**Returns:** _void_

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:68

---

### apply

▸ **apply**(`compiler`: _Compiler_): _Promise_<_void_\>

#### Parameters:

| Name       | Type       |
| ---------- | ---------- |
| `compiler` | _Compiler_ |

**Returns:** _Promise_<_void_\>

Defined in: src/index.ts:110

---

### getFileName

▸ **getFileName**(`name`: _string_, `cnt`: _Buffer_, `fname?`: _string_): _string_

获取文件名称

#### Parameters:

| Name     | Type     |
| -------- | -------- |
| `name`   | _string_ |
| `cnt`    | _Buffer_ |
| `fname?` | _string_ |

**Returns:** _string_

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:60

---

### getFileType

▸ **getFileType**(`str`: _string_): _string_

获取文件类型

#### Parameters:

| Name  | Type     |
| ----- | -------- |
| `str` | _string_ |

**Returns:** _string_

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:58

---

### initCompilation

▸ **initCompilation**(`op`: YylWebpackPluginBaseInitCompilationOption): _void_

初始化 compilation

#### Parameters:

| Name | Type                                      |
| ---- | ----------------------------------------- |
| `op` | YylWebpackPluginBaseInitCompilationOption |

**Returns:** _void_

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:62

---

### updateAssets

▸ **updateAssets**(`op`: UpdateAssetsOption): _void_

更新 assets

#### Parameters:

| Name | Type               |
| ---- | ------------------ |
| `op` | UpdateAssetsOption |

**Returns:** _void_

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:66

---

### getHooks

▸ `Static`**getHooks**(`compilation`: _Compilation_): _any_

#### Parameters:

| Name          | Type          |
| ------------- | ------------- |
| `compilation` | _Compilation_ |

**Returns:** _any_

Defined in: src/index.ts:57

---

### getName

▸ `Static`**getName**(): _string_

**Returns:** _string_

Defined in: src/index.ts:61
