import path from 'path'
import { Compiler, Compilation, LoaderOptionsPlugin } from 'webpack'
import { Configuration } from 'webpack-dev-server'
import { getHooks } from './hooks'
import chalk from 'chalk'
import { YylWebpackPluginBaseOption, YylWebpackPluginBase } from 'yyl-webpack-plugin-base'
import { URL } from 'url'
import { LANG } from './lang'

const PLUGIN_NAME = 'yylServer'

export interface YylServerWebpackPluginOption extends Pick<YylWebpackPluginBaseOption, 'context'> {
  devServer?: Configuration

  /** https */
  https?: boolean

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

const DEFAULT_OPTIONS: YylServerWebpackPluginProperty = {
  context: process.cwd(),
  devServer: {
    noInfo: true,
    port: 5000,
    hot: false,
    writeToDisk: false,
    liveReload: false,
    publicPath: '/',
    disableHostCheck: true,
    compress: true,
    inline: true,
    host: '0.0.0.0',
    sockHost: '127.0.0.1',
    serveIndex: true,
    contentBase: path.resolve(process.cwd(), './dist')
  },
  https: false,
  homePage: '',
  proxy: {
    hosts: [],
    enable: false
  }
}

/** 插件 option 初始化 */
function initPluginOption(op?: YylServerWebpackPluginOption): YylServerWebpackPluginProperty {
  const option = {
    ...DEFAULT_OPTIONS
  }

  if (op?.context) {
    option.context = op.context
  }

  if (op?.proxy) {
    option.proxy = {
      ...option.proxy,
      ...op.proxy
    }
  }

  if (op?.homePage) {
    option.homePage = op.homePage
  }

  if (op?.devServer?.publicPath) {
    option.devServer.publicPath = op.devServer.publicPath
    if (/^\/\//.test(option.devServer.publicPath)) {
      option.devServer.publicPath = `http:${option.devServer.publicPath}`
    }
  }

  if (op?.https !== undefined) {
    option.devServer.inline = !op.https
  }

  return option
}

/** devServer 配置初始化 - 返回 */
export interface initDevServerResult {
  devServer: Configuration
}

/** 初始化 devServer plugin */
export default class YylServerWebpackPlugin extends YylWebpackPluginBase {
  /** devServer 配置初始化 */
  static initDevServerConfig(op?: YylServerWebpackPluginOption): initDevServerResult {
    const option = initPluginOption(op)

    const iHosts = option?.proxy?.hosts || []
    const hostParams = option.proxy.enable ? iHosts.map((url) => formatHost(url)) : []

    return {
      devServer: {
        ...option.devServer,
        headers: (() => {
          let r: Configuration['headers'] = {}
          if (option.proxy.enable) {
            r = {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            }
          } else {
            r = {}
          }

          if (option.devServer.headers) {
            r = {
              ...r,
              ...option.devServer.headers
            }
          }
          return r
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
        before: (app, server, compiler) => {
          const { historyApiFallback } = option.devServer
          if (historyApiFallback && historyApiFallback !== true) {
            /**
             * 由于 proxy 后通过域名访问 404 页面无法正确重定向，
             * 通过 添加 header.accept, 跳过 historyApiFallback 前置校验
             *  */
            app.use((req, res, next) => {
              const matchRewrite =
                historyApiFallback.rewrites &&
                historyApiFallback.rewrites.length &&
                historyApiFallback.rewrites.some((item) => req.url.match(item.from))
              if (
                req.method === 'GET' &&
                req.headers &&
                ([''].includes(path.extname(req.url)) || matchRewrite)
              ) {
                req.headers.accept =
                  'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
              }
              next()
            })
          }
          if (option.devServer.before) {
            option.devServer.before(app, server, compiler)
          }
        }
      }
    }
  }

  static getHooks(compilation: Compilation) {
    return getHooks(compilation)
  }

  static getName() {
    return PLUGIN_NAME
  }

  option: YylServerWebpackPluginProperty = DEFAULT_OPTIONS

  constructor(option?: YylServerWebpackPluginOption) {
    super({
      ...option,
      name: PLUGIN_NAME
    })
    this.option = initPluginOption(option)
  }

  /** proxy 操作 页面的 url 替换 */
  async apply(compiler: Compiler) {
    const { option } = this

    const iHosts = option?.proxy?.hosts || []

    const hostParams = option.proxy.enable ? iHosts.map((url) => formatHost(url)) : []

    let isWatchMode = false
    compiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      isWatchMode = true
    })
    this.initCompilation({
      compiler,
      onProcessAssets: async (compilation) => {
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
      }
    })
  }
}

module.exports = YylServerWebpackPlugin
