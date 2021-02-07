import path from 'path'
import { Compiler, EnvironmentPlugin } from 'webpack'
import { LocalserverConfig, CommitConfig, YylConfigAlias, Env } from 'yyl-config-types'
import {
  AssetsInfo,
  YylWebpackPluginBaseOption,
  YylWebpackPluginBase
} from 'yyl-webpack-plugin-base'
import { URL } from 'url'

const PLUGIN_NAME = 'yylServer'

export interface YylServerWebpackPluginOption extends Pick<YylWebpackPluginBaseOption, 'context'> {
  /** 本地服务根目录 */
  static: string
  /** 本地服务端口 */
  port: number
  /** 是否启动热更新 */
  hmr: boolean
  /** 需要代理的域名 */
  proxy?: {
    hosts: string[]
    enable: boolean
  }
  /** 是否启动插件 */
  enable?: boolean
}

export type YylServerWebpackPluginProperty = Required<YylServerWebpackPluginOption>

export interface ProxyProps {
  target: string
  changeOrigin: boolean
  pathRewrite: {
    [reg: string]: string
  }
}

function getHost(url: string) {
  const iUrl = `http:${url.replace(/^https?:/, '')}`
  return new URL(iUrl).hostname
}

export class YylServerWebpackPlugin extends YylWebpackPluginBase {
  option: YylServerWebpackPluginProperty = {
    context: process.cwd(),
    port: 5000,
    hmr: true,
    static: path.resolve(process.cwd(), './dist'),
    enable: false,
    proxy: {
      hosts: [],
      enable: false
    }
  }

  constructor(option?: YylServerWebpackPluginOption) {
    super({
      ...option,
      name: PLUGIN_NAME
    })
    if (option?.port) {
      this.option.port = option.port
    }

    if (option?.context) {
      this.option.context = option.context
    }

    if (option?.static) {
      this.option.static = path.resolve(this.option.context, option.static)
    }

    if (option?.proxy) {
      this.option.proxy = {
        ...this.option.proxy,
        ...option.proxy
      }
    }

    if (option?.enable !== undefined) {
      this.option.enable = option.enable
    }

    if (option?.hmr !== undefined) {
      this.option.hmr = option.hmr
    }
  }

  async apply(compiler: Compiler) {
    const { option } = this
    const { options } = compiler

    const proxyhosts: string[] = []

    if (!option.enable) {
      return
    }

    options.devServer = {
      ...options.devServer,
      port: option.port,
      public: option.static,
      headers: (() => {
        if (option.proxy.enable) {
          return {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
          }
        } else {
          return {}
        }
      })(),
      proxy: (() => {
        const r: {
          [path: string]: ProxyProps
        } = {}

        if (option.proxy.enable) {
          proxyhosts.map(host => getHost(host)).forEach((host) => {
            const replaceStr = `/proxy_${host.replace(/\./g, '_')}`
            r[replaceStr] = {
              target: `http://${host}`,
              changeOrigin: true,
              pathRewrite: (() => {
                const r2: ProxyProps['pathRewrite'] = {}
                r2[`^${replaceStr}`] = ''
                return r2
              })()
            }
          })
        }
        return r
      })()
    }
  }
}

module.exports = YylServerWebpackPlugin
