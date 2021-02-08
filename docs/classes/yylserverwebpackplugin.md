[yyl-server-webpack-plugin](../README.md) / [Exports](../modules.md) / YylServerWebpackPlugin

# Class: YylServerWebpackPlugin

## Hierarchy

* *YylWebpackPluginBase*

  ↳ **YylServerWebpackPlugin**

## Table of contents

### Constructors

- [constructor](yylserverwebpackplugin.md#constructor)

### Properties

- [alias](yylserverwebpackplugin.md#alias)
- [assetMap](yylserverwebpackplugin.md#assetmap)
- [context](yylserverwebpackplugin.md#context)
- [filename](yylserverwebpackplugin.md#filename)
- [name](yylserverwebpackplugin.md#name)
- [option](yylserverwebpackplugin.md#option)

### Methods

- [addDependencies](yylserverwebpackplugin.md#adddependencies)
- [apply](yylserverwebpackplugin.md#apply)
- [getFileName](yylserverwebpackplugin.md#getfilename)
- [getFileType](yylserverwebpackplugin.md#getfiletype)
- [initCompilation](yylserverwebpackplugin.md#initcompilation)
- [updateAssets](yylserverwebpackplugin.md#updateassets)
- [getHooks](yylserverwebpackplugin.md#gethooks)
- [getName](yylserverwebpackplugin.md#getname)

## Constructors

### constructor

\+ **new YylServerWebpackPlugin**(`option?`: [*YylServerWebpackPluginOption*](../interfaces/yylserverwebpackpluginoption.md)): [*YylServerWebpackPlugin*](yylserverwebpackplugin.md)

#### Parameters:

Name | Type |
------ | ------ |
`option?` | [*YylServerWebpackPluginOption*](../interfaces/yylserverwebpackpluginoption.md) |

**Returns:** [*YylServerWebpackPlugin*](yylserverwebpackplugin.md)

Defined in: [src/index.ts:76](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L76)

## Properties

### alias

• **alias**: Alias

resolve.alias 绝对路径

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:57

___

### assetMap

• **assetMap**: ModuleAssets

assetsMap

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:59

___

### context

• **context**: *string*

相对路径

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:51

___

### filename

• **filename**: *string*

输出文件格式

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:55

___

### name

• **name**: *string*

组件名称

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:53

___

### option

• **option**: *Required*<[*YylServerWebpackPluginOption*](../interfaces/yylserverwebpackpluginoption.md)\>

Defined in: [src/index.ts:65](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L65)

## Methods

### addDependencies

▸ **addDependencies**(`op`: AddDependenciesOption): *void*

添加监听文件

#### Parameters:

Name | Type |
------ | ------ |
`op` | AddDependenciesOption |

**Returns:** *void*

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:72

___

### apply

▸ **apply**(`compiler`: *Compiler*): *Promise*<*void*\>

#### Parameters:

Name | Type |
------ | ------ |
`compiler` | *Compiler* |

**Returns:** *Promise*<*void*\>

Defined in: [src/index.ts:115](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L115)

___

### getFileName

▸ **getFileName**(`name`: *string*, `cnt`: *Buffer*, `fname?`: *string*): *string*

获取文件名称

#### Parameters:

Name | Type |
------ | ------ |
`name` | *string* |
`cnt` | *Buffer* |
`fname?` | *string* |

**Returns:** *string*

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:64

___

### getFileType

▸ **getFileType**(`str`: *string*): *string*

获取文件类型

#### Parameters:

Name | Type |
------ | ------ |
`str` | *string* |

**Returns:** *string*

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:62

___

### initCompilation

▸ **initCompilation**(`compiler`: *Compiler*): *Promise*<InitEmitHooksResult\>

初始化 compilation

#### Parameters:

Name | Type |
------ | ------ |
`compiler` | *Compiler* |

**Returns:** *Promise*<InitEmitHooksResult\>

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:66

___

### updateAssets

▸ **updateAssets**(`op`: UpdateAssetsOption): *void*

更新 assets

#### Parameters:

Name | Type |
------ | ------ |
`op` | UpdateAssetsOption |

**Returns:** *void*

Defined in: node_modules/yyl-webpack-plugin-base/output/index.d.ts:70

___

### getHooks

▸ `Static`**getHooks**(`compilation`: *Compilation*): *any*

#### Parameters:

Name | Type |
------ | ------ |
`compilation` | *Compilation* |

**Returns:** *any*

Defined in: [src/index.ts:57](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L57)

___

### getName

▸ `Static`**getName**(): *string*

**Returns:** *string*

Defined in: [src/index.ts:61](https://github.com/jackness1208/yyl-server-webpack-plugin/blob/513275c/src/index.ts#L61)
