import path from 'path'
import { Compiler, WebpackOptionsNormalized, Compilation } from 'webpack'
import { getHooks } from './hooks'
import chalk from 'chalk'
import {
  AssetsInfo,
  YylWebpackPluginBaseOption,
  YylWebpackPluginBase
} from 'yyl-webpack-plugin-base'
import { URL } from 'url'
import { LANG } from './lang'

const PLUGIN_NAME = 'yylServer'

export interface YylServerWebpackPluginOption extends Pick<YylWebpackPluginBaseOption, 'context'> {
  /** 本地服务根目录 */
  static?: string
  /** 本地服务端口 */
  port?: number
  /** 是否启动热更新 */
  hmr?: boolean
  /** 需要代理的域名 */
  proxy?: {
    /** 代理的 host 列表 */
    hosts?: string[]
    /** 是否激活 */
    enable?: boolean
  }
  /** 构建成功后打开的页面 */
  homePage?: string
}

export type YylServerWebpackPluginProperty = Required<YylServerWebpackPluginOption>

export interface ProxyProps {
  target: string
  changeOrigin: boolean
  pathRewrite: {
    [reg: string]: string
  }
}

function formatHost(url: string) {
  const iUrl = `http:${url.replace(/^https?:/, '')}`
  const { hostname } = new URL(iUrl)
  return {
    hostname,
    replaceStr: `/proxy_${hostname.replace(/\./g, '_')}`
  }
}

export interface InitConfigResult {
  devServer: WebpackOptionsNormalized['devServer']
}

export default class YylServerWebpackPlugin extends YylWebpackPluginBase {
  static getHooks(compilation: Compilation) {
    return getHooks(compilation)
  }

  static getName() {
    return PLUGIN_NAME
  }

  option: YylServerWebpackPluginProperty = {
    context: process.cwd(),
    homePage: '',
    port: 5000,
    hmr: true,
    static: path.resolve(process.cwd(), './dist'),
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

    if (option?.homePage) {
      this.option.homePage = option.homePage
    }

    if (option?.hmr !== undefined) {
      this.option.hmr = option.hmr
    }
  }

  async apply(compiler: Compiler) {
    const { option } = this
    const { options } = compiler

    const iHosts = option?.proxy?.hosts || []

    const hostParams = option.proxy.enable ? iHosts.map((url) => formatHost(url)) : []

    options.devServer = {
      port: option.port,
      static: option.static,
      open: !!option.homePage,
      openPage: option.homePage,
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

        hostParams.forEach((hostObj) => {
          r[hostObj.replaceStr] = {
            target: `http://${hostObj.hostname}`,
            changeOrigin: true,
            pathRewrite: (() => {
              const r2: ProxyProps['pathRewrite'] = {}
              r2[`^${hostObj.replaceStr}`] = ''
              return r2
            })()
          }
        })

        return r
      })(),
      useLocalIp: true,
      ...options.devServer
    }

    let isWatchMode = false
    compiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      isWatchMode = true
    })
    const { compilation, done } = await this.initCompilation(compiler)
    const iHooks = getHooks(compilation)
    const logger = compilation.getLogger(PLUGIN_NAME)
    logger.group(PLUGIN_NAME)
    if (hostParams.length && isWatchMode) {
      Object.keys(compilation.assets)
        .filter((key) => {
          return ['.js', '.css', '.html', '.map'].includes(path.extname(key))
        })
        .forEach((key) => {
          const asset = compilation.assets[key]
          const replaceLogs: string[] = []
          let r = asset.source().toString()
          hostParams.forEach((hostObj) => {
            ;[
              `http://${hostObj.hostname}`,
              `https://${hostObj.hostname}`,
              `//${hostObj.hostname}`
            ].forEach((mathPath) => {
              if (r.match(mathPath)) {
                replaceLogs.push(
                  `> ${LANG.REPLACE}: ${chalk.yellow(mathPath)} -> ${chalk.cyan(
                    hostObj.replaceStr
                  )}`
                )
                r = r.split(mathPath).join(hostObj.replaceStr)
              }
            })
          })

          if (replaceLogs.length) {
            logger.info(`${chalk.red('*')} ${LANG.UPDATE_FILE}: ${chalk.magenta(key)}`)
            replaceLogs.forEach((str) => {
              logger.info(str)
            })
            this.updateAssets({
              compilation,
              assetsInfo: {
                dist: key,
                source: Buffer.from(r)
              }
            })
          }
        })
    }

    await iHooks.emit.promise()
    logger.groupEnd()
    done()
  }
}

module.exports = YylServerWebpackPlugin
