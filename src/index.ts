import path from 'path'
import { Compiler, Compilation } from 'webpack'
import { Configuration, ProxyConfigMap } from 'webpack-dev-server'
import { getHooks } from './hooks'
import chalk from 'chalk'
import { YylWebpackPluginBaseOption, YylWebpackPluginBase } from 'yyl-webpack-plugin-base'
import { URL } from 'url'
import { LANG } from './const'

const PLUGIN_NAME = 'yylServer'

export type LoggerType = 'warn' | 'info' | 'success' | 'warn' | 'error'

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

  /** 日志监听 */
  logger?: (type: LoggerType, args: any[]) => any
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
  logger: () => undefined,
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

  if (op?.devServer) {
    option.devServer = {
      ...option.devServer,
      ...op.devServer
    }
  }

  if (op?.devServer?.publicPath) {
    option.devServer.publicPath = op.devServer.publicPath
    if (/^\/\//.test(option.devServer.publicPath)) {
      option.devServer.publicPath = `http:${option.devServer.publicPath}`
    }
  }

  if (typeof op?.devServer?.contentBase === 'string') {
    option.devServer.contentBase = path.resolve(option.context, op.devServer.contentBase)
  }

  if (op?.https !== undefined) {
    option.devServer.inline = !op.https
  }

  if (op?.logger) {
    option.logger = op.logger
  }

  if (op?.homePage) {
    option.homePage = op.homePage
    option.devServer.open = true
    option.devServer.openPage = op.homePage
  }

  return option
}

/** 初始化 devServer plugin */
export default class YylServerWebpackPlugin extends YylWebpackPluginBase {
  /** devServer 配置初始化 */
  static initDevServerConfig(op?: YylServerWebpackPluginOption): Configuration {
    const option = initPluginOption(op)

    const iHosts = option?.proxy?.hosts || []
    const hostParams = option.proxy.enable ? iHosts.map((url) => formatHost(url)) : []

    if (option.devServer.proxy && typeof option.devServer.proxy !== 'object') {
      option.logger('warn', [LANG.PROXY_IS_NOT_OBJECT])
    }

    const r: Configuration = {
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

        if (typeof option.devServer.proxy === 'object') {
          Object.keys(option.devServer.proxy).forEach((key) => {
            if (option?.devServer?.proxy && key in option?.devServer?.proxy) {
              r[key] = (option.devServer.proxy as any)[key]
            }
          })
        }

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

    return r
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
    const { options } = compiler

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

        if (options.devServer) {
          logger.info(
            `${chalk.red('*')} ${LANG.PORT_INFO}: ${chalk.yellow(options.devServer.port)}`
          )
          logger.info(
            `${chalk.red('*')} ${LANG.DIST_INFO}: ${chalk.yellow(options.devServer.contentBase)}`
          )

          if (options.devServer?.proxy) {
            logger.info(`${chalk.red('*')} ${LANG.PROXY_INFO}:`)
            const iProxy = options.devServer?.proxy as ProxyConfigMap
            Object.keys(iProxy).forEach((key: keyof ProxyConfigMap) => {
              const proxyInfo = iProxy[key]
              if (typeof proxyInfo === 'string') {
                logger.info(`> ${chalk.yellow(key)} -> ${proxyInfo}`)
              } else {
                logger.info(`> ${chalk.yellow(key)} -> ${proxyInfo.target}`)
              }
            })
          }
        }

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
