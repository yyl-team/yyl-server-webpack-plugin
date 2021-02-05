import path from 'path'
import { Compiler } from 'webpack'
import { LocalserverConfig, CommitConfig, YylConfigAlias, Env } from 'yyl-config-types'
import {
  AssetsInfo,
  YylWebpackPluginBaseOption,
  YylWebpackPluginBase
} from 'yyl-webpack-plugin-base'

const PLUGIN_NAME = 'yylServer'

export interface YylServerWebpackPluginOption extends Pick<YylWebpackPluginBaseOption, 'context'> {
  localserver: Pick<LocalserverConfig, 'port'>
  commit: Pick<CommitConfig, 'hostname' | 'mainHost' | 'staticHost'>
  alias: Pick<YylConfigAlias, 'root'>
  env: Env
}

export class YylServerWebpackPlugin extends YylWebpackPluginBase {
  localserver: YylServerWebpackPluginOption['localserver'] = {
    port: 5000
  }

  commit: YylServerWebpackPluginOption['commit'] = {
    hostname: ''
  }

  alias: YylServerWebpackPluginOption['alias'] = {
    root: './dist'
  }

  constructor(option?: YylServerWebpackPluginOption) {
    super({
      ...option,
      name: PLUGIN_NAME
    })
    if (option?.localserver) {
      this.localserver = {
        ...this.localserver,
        ...option.localserver
      }
    }

    if (option?.commit) {
      this.commit = {
        ...this.commit,
        ...option.commit
      }
    }
  }

  async apply(compiler: Compiler) {
    const { localserver, commit } = this
    const { options } = compiler

    options.devServer = {
      ...options.devServer,
      port: localserver.port,
      public: alias
    }
    // TODO:
  }
}
