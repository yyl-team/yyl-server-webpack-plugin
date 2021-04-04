import path from 'path'
import { Compiler, Compilation } from 'webpack'
import { Configuration, ProxyConfigMap } from 'webpack-dev-server'
import { getHooks } from './hooks'
import chalk from 'chalk'
import { YylWebpackPluginBaseOption, YylWebpackPluginBase } from 'yyl-webpack-plugin-base'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { Logger } from 'yyl-seed-base'
import { Express } from 'express'
import { URL } from 'url'
import { LANG } from './const'

const PLUGIN_NAME = 'yylServer'

export { Options as HttpProxyMiddlewareOption } from 'http-proxy-middleware'

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

  /** html-webpack-plugin 插件 */
  HtmlWebpackPlugin?: typeof HtmlWebpackPlugin
}

export type YylServerWebpackPluginProperty = Required<
  Omit<YylServerWebpackPluginOption, 'HtmlWebpackPlugin'>
> & {
  HtmlWebpackPlugin?: typeof HtmlWebpackPlugin
}

/** 初始化 proxy 中间件 - 配置 */
export interface InitProxyMiddlewareOption {
  proxy: YylServerWebpackPluginOption['proxy']
  app: Express
  logger?: Logger
  logLevel?: 0 | 1 | 2
}

export interface ProxyProps {
  target: string
  changeOrigin: boolean
  pathRewrite: {
    [reg: string]: string
  }
}

function formatHost(url: string) {
  const iUrl = `http:${url.replace(/^https?:/, '')}`
  const { hostname, pathname } = new URL(iUrl)
  return {
    hostname,
    /** 替换成本地路径 */
    localProxyPath: `/proxy_${hostname.replace(/\./g, '_')}${pathname}`,
    /** 代理的目标路径 */
    target: `http://${hostname}${pathname}`,
    /** 远程有可能命中的路径 */
    remoteProxyPaths: [
      `http://${hostname}${pathname}`,
      `https://${hostname}${pathname}`,
      `//${hostname}${pathname}`
    ]
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
  HtmlWebpackPlugin,
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

  if (op?.homePage) {
    option.homePage = op.homePage
    option.devServer.open = true
    option.devServer.openPage = op.homePage
  }

  if (op?.HtmlWebpackPlugin) {
    option.HtmlWebpackPlugin = op.HtmlWebpackPlugin
  }

  return option
}

/** 初始化 devServer plugin */
export default class YylServerWebpackPlugin extends YylWebpackPluginBase {
  /** 初始化 proxy 中间件 */
  static initProxyMiddleware(op: InitProxyMiddlewareOption) {
    const { proxy, app } = op
    const logger: Logger = op.logger || (() => undefined)
    if (proxy?.enable && proxy.hosts?.length) {
      logger('msg', 'info', [LANG.INIT_PROXY_MIDDLEWARE_START])
      const hostParams = proxy.hosts.map((url) => formatHost(url))
      logger('msg', 'info', [LANG.PROXY_INFO])

      hostParams.forEach((obj) => {
        app.use(
          obj.localProxyPath,
          createProxyMiddleware({
            target: obj.target,
            changeOrigin: true,
            pathRewrite: (() => {
              const r: ProxyProps['pathRewrite'] = {}
              r[obj.localProxyPath] = ''
              return r
            })(),
            logLevel: op.logLevel === 2 ? 'debug' : 'silent'
          })
        )
        logger('msg', 'info', [`${obj.localProxyPath} -> ${obj.target}`])
      })
      logger('msg', 'info', [LANG.INIT_PROXY_MIDDLEWARE_FINISHED])
    }
  }

  /** devServer 配置初始化 */
  static initDevServerConfig(op?: YylServerWebpackPluginOption): Configuration {
    const option = initPluginOption(op)

    const iHosts = option?.proxy?.hosts || []
    const hostParams = option.proxy.enable ? iHosts.map((url) => formatHost(url)) : []

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
          r[hostObj.localProxyPath] = {
            target: hostObj.target,
            changeOrigin: true,
            pathRewrite: (() => {
              const r2: ProxyProps['pathRewrite'] = {}
              r2[`^${hostObj.localProxyPath}`] = ''
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
        const historyApiFallback = compiler.options.devServer
          ?.historyApiFallback as Configuration['historyApiFallback']

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

    let changed = false

    let isWatching = false
    compiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
      isWatching = true
    })

    const replaceHandle = (
      ctx: string
    ): {
      content: string
      replaceLogs: string[]
    } => {
      let content = ctx
      const replaceLogs: string[] = []
      hostParams.forEach((hostObj) => {
        hostObj.remoteProxyPaths.forEach((mathPath) => {
          if (content.match(mathPath)) {
            replaceLogs.push(
              `${LANG.REPLACE}: ${mathPath} -> ${chalk.cyan(hostObj.localProxyPath)}`
            )
            content = content.split(mathPath).join(hostObj.localProxyPath)
          }
        })
      })

      return {
        content,
        replaceLogs
      }
    }

    // html-webpack-config
    const { HtmlWebpackPlugin } = option
    if (HtmlWebpackPlugin) {
      compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
        if (!isWatching) {
          return
        }
        const logger = compilation.getLogger(PLUGIN_NAME)
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          PLUGIN_NAME,
          async (info, cb) => {
            const { content, replaceLogs } = replaceHandle(info.html)

            if (replaceLogs.length) {
              changed = true
              logger.info(`${LANG.UPDATE_FILE}: ${chalk.magenta(info.outputName)}`)
              replaceLogs.forEach((str) => {
                logger.info(str)
              })
              info.html = content
            }
            cb(null, info)
          }
        )
      })
    }
    this.initCompilation({
      compiler,
      onProcessAssets: async (compilation) => {
        if (!isWatching) {
          return
        }
        const iHooks = getHooks(compilation)
        const logger = compilation.getLogger(PLUGIN_NAME)
        logger.group(PLUGIN_NAME)

        if (options.devServer) {
          logger.info(`${chalk.yellow(LANG.PORT_INFO)}: ${chalk.cyan(options.devServer.port)}`)
          logger.info(
            `${chalk.yellow(LANG.DIST_INFO)}: ${chalk.cyan(options.devServer.contentBase)}`
          )

          if (options.devServer?.proxy) {
            logger.info(`${chalk.yellow(LANG.PROXY_INFO)}:`)
            const iProxy = options.devServer?.proxy as ProxyConfigMap
            Object.keys(iProxy).forEach((key: keyof ProxyConfigMap) => {
              const proxyInfo = iProxy[key]
              if (typeof proxyInfo === 'string') {
                logger.info(`${key} -> ${chalk.cyan(proxyInfo)}`)
              } else {
                logger.info(`${key} -> ${chalk.cyan(proxyInfo.target)}`)
              }
            })
          }

          if (options.devServer?.openPage) {
            logger.info(
              `${chalk.yellow(LANG.HOME_PAGE)}: ${chalk.cyan(options.devServer?.openPage)}`
            )
          }
        }

        if (hostParams.length) {
          logger.info(`${chalk.yellow(LANG.REPLACE_INFO)}:`)
          Object.keys(compilation.assets)
            .filter((key) => {
              return ['.js', '.css', '.html', '.map'].includes(path.extname(key))
            })
            .forEach((key) => {
              const asset = compilation.assets[key]
              const { content, replaceLogs } = replaceHandle(asset.source().toString())

              if (replaceLogs.length) {
                changed = true
                logger.info(`${LANG.UPDATE_FILE}: ${chalk.magenta(key)}`)
                replaceLogs.forEach((str) => {
                  logger.info(str)
                })
                this.updateAssets({
                  compilation,
                  assetsInfo: {
                    dist: key,
                    source: Buffer.from(content)
                  }
                })
              }
            })

          if (!changed) {
            logger.info(chalk.gray(LANG.REPLACE_NONE))
          }
        }

        await iHooks.emit.promise()
        logger.groupEnd()
      }
    })
  }
}

module.exports = YylServerWebpackPlugin
