/*!
 * yyl-server-webpack-plugin cjs 1.2.4
 * (c) 2020 - 2021 
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var tapable = require('tapable');
var chalk = require('chalk');
var yylWebpackPluginBase = require('yyl-webpack-plugin-base');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var httpProxyMiddleware = require('http-proxy-middleware');
var url = require('url');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var HtmlWebpackPlugin__default = /*#__PURE__*/_interopDefaultLegacy(HtmlWebpackPlugin);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const iWeakMap = new WeakMap();
function createHooks() {
    return {
        emit: new tapable.AsyncSeriesWaterfallHook(['pluginArgs'])
    };
}
function getHooks(compilation) {
    let hooks = iWeakMap.get(compilation);
    if (hooks === undefined) {
        hooks = createHooks();
        iWeakMap.set(compilation, hooks);
    }
    return hooks;
}

const LANG = {
    UPDATE_FILE: '更新',
    REPLACE: '替换',
    PROXY_IS_NOT_OBJECT: 'devServer.proxy 仅支持 object',
    PORT_INFO: '端口',
    DIST_INFO: '目录',
    PROXY_INFO: '代理信息',
    PROXY_DETAIL: '->',
    HOME_PAGE: '主页',
    REPLACE_INFO: '文件替換',
    REPLACE_NONE: '暂无',
    INIT_PROXY_MIDDLEWARE_START: '初始化 代理中间件 开始',
    INIT_PROXY_MIDDLEWARE_FINISHED: '初始化 代理中间件 完成'
};

const PLUGIN_NAME = 'yylServer';
function formatHost(url$1) {
    const iUrl = `http:${url$1.replace(/^https?:/, '')}`;
    const { hostname, pathname } = new url.URL(iUrl);
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
    };
}
const DEFAULT_OPTIONS = {
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
        contentBase: path__default['default'].resolve(process.cwd(), './dist')
    },
    https: false,
    homePage: '',
    HtmlWebpackPlugin: HtmlWebpackPlugin__default['default'],
    proxy: {
        hosts: [],
        enable: false,
        logLevel: 0
    }
};
/** 插件 option 初始化 */
function initPluginOption(op) {
    var _a, _b;
    const option = Object.assign({}, DEFAULT_OPTIONS);
    if (op === null || op === void 0 ? void 0 : op.context) {
        option.context = op.context;
    }
    if (op === null || op === void 0 ? void 0 : op.proxy) {
        option.proxy = Object.assign(Object.assign({}, option.proxy), op.proxy);
    }
    if (op === null || op === void 0 ? void 0 : op.devServer) {
        option.devServer = Object.assign(Object.assign({}, option.devServer), op.devServer);
    }
    if ((_a = op === null || op === void 0 ? void 0 : op.devServer) === null || _a === void 0 ? void 0 : _a.publicPath) {
        option.devServer.publicPath = op.devServer.publicPath;
        if (/^\/\//.test(option.devServer.publicPath)) {
            option.devServer.publicPath = `http:${option.devServer.publicPath}`;
        }
    }
    if (typeof ((_b = op === null || op === void 0 ? void 0 : op.devServer) === null || _b === void 0 ? void 0 : _b.contentBase) === 'string') {
        option.devServer.contentBase = path__default['default'].resolve(option.context, op.devServer.contentBase);
    }
    if ((op === null || op === void 0 ? void 0 : op.https) !== undefined) {
        option.devServer.inline = !op.https;
    }
    if (op === null || op === void 0 ? void 0 : op.homePage) {
        option.homePage = op.homePage;
        option.devServer.open = true;
        option.devServer.openPage = op.homePage;
    }
    if (op === null || op === void 0 ? void 0 : op.HtmlWebpackPlugin) {
        option.HtmlWebpackPlugin = op.HtmlWebpackPlugin;
    }
    return option;
}
/** 初始化 devServer plugin */
class YylServerWebpackPlugin extends yylWebpackPluginBase.YylWebpackPluginBase {
    constructor(option) {
        super(Object.assign(Object.assign({}, option), { name: PLUGIN_NAME }));
        this.option = DEFAULT_OPTIONS;
        this.option = initPluginOption(option);
    }
    /** 初始化 proxy 中间件 */
    static initProxyMiddleware(op) {
        var _a;
        const { proxy, app } = op;
        const logger = op.logger || (() => undefined);
        if ((proxy === null || proxy === void 0 ? void 0 : proxy.enable) && ((_a = proxy.hosts) === null || _a === void 0 ? void 0 : _a.length)) {
            logger('msg', 'info', [LANG.INIT_PROXY_MIDDLEWARE_START]);
            const hostParams = proxy.hosts.map((url) => formatHost(url));
            logger('msg', 'info', [LANG.PROXY_INFO]);
            hostParams.forEach((obj) => {
                app.use(obj.localProxyPath, httpProxyMiddleware.createProxyMiddleware({
                    target: obj.target,
                    changeOrigin: true,
                    pathRewrite: (() => {
                        const r = {};
                        r[obj.localProxyPath] = '';
                        return r;
                    })(),
                    logLevel: op.logLevel === 2 ? 'debug' : 'silent'
                }));
                logger('msg', 'info', [`${obj.localProxyPath} -> ${obj.target}`]);
            });
            logger('msg', 'info', [LANG.INIT_PROXY_MIDDLEWARE_FINISHED]);
        }
    }
    /** devServer 配置初始化 */
    static initDevServerConfig(op) {
        var _a;
        const option = initPluginOption(op);
        const iHosts = ((_a = option === null || option === void 0 ? void 0 : option.proxy) === null || _a === void 0 ? void 0 : _a.hosts) || [];
        const hostParams = option.proxy.enable ? iHosts.map((url) => formatHost(url)) : [];
        const r = Object.assign(Object.assign({}, option.devServer), { headers: (() => {
                let r = {};
                if (option.proxy.enable) {
                    r = {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
                    };
                }
                else {
                    r = {};
                }
                if (option.devServer.headers) {
                    r = Object.assign(Object.assign({}, r), option.devServer.headers);
                }
                return r;
            })(), proxy: (() => {
                const r = {};
                hostParams.forEach((hostObj) => {
                    r[hostObj.localProxyPath] = {
                        target: hostObj.target,
                        changeOrigin: true,
                        pathRewrite: (() => {
                            const r2 = {};
                            r2[`^${hostObj.localProxyPath}`] = '';
                            return r2;
                        })(),
                        logLevel: option.proxy.logLevel === 2 ? 'debug' : 'silent'
                    };
                });
                if (typeof option.devServer.proxy === 'object') {
                    Object.keys(option.devServer.proxy).forEach((key) => {
                        var _a, _b;
                        if (((_a = option === null || option === void 0 ? void 0 : option.devServer) === null || _a === void 0 ? void 0 : _a.proxy) && key in ((_b = option === null || option === void 0 ? void 0 : option.devServer) === null || _b === void 0 ? void 0 : _b.proxy)) {
                            r[key] = option.devServer.proxy[key];
                        }
                    });
                }
                return r;
            })(), before: (app, server, compiler) => {
                var _a;
                const historyApiFallback = (_a = compiler.options.devServer) === null || _a === void 0 ? void 0 : _a.historyApiFallback;
                if (historyApiFallback && historyApiFallback !== true) {
                    /**
                     * 由于 proxy 后通过域名访问 404 页面无法正确重定向，
                     * 通过 添加 header.accept, 跳过 historyApiFallback 前置校验
                     *  */
                    app.use((req, res, next) => {
                        const matchRewrite = historyApiFallback.rewrites &&
                            historyApiFallback.rewrites.length &&
                            historyApiFallback.rewrites.some((item) => req.url.match(item.from));
                        if (req.method === 'GET' &&
                            req.headers &&
                            ([''].includes(path__default['default'].extname(req.url)) || matchRewrite)) {
                            req.headers.accept =
                                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';
                        }
                        next();
                    });
                }
                if (option.devServer.before) {
                    option.devServer.before(app, server, compiler);
                }
            } });
        return r;
    }
    static getHooks(compilation) {
        return getHooks(compilation);
    }
    static getName() {
        return PLUGIN_NAME;
    }
    /** proxy 操作 页面的 url 替换 */
    apply(compiler) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { option } = this;
            const { options } = compiler;
            const iHosts = ((_a = option === null || option === void 0 ? void 0 : option.proxy) === null || _a === void 0 ? void 0 : _a.hosts) || [];
            const hostParams = option.proxy.enable ? iHosts.map((url) => formatHost(url)) : [];
            let changed = false;
            let isWatching = false;
            compiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
                isWatching = true;
            });
            const replaceHandle = (ctx) => {
                let content = ctx;
                const replaceLogs = [];
                hostParams.forEach((hostObj) => {
                    hostObj.remoteProxyPaths.forEach((mathPath) => {
                        if (content.match(mathPath)) {
                            replaceLogs.push(`${LANG.REPLACE}: ${mathPath} -> ${chalk__default['default'].cyan(hostObj.localProxyPath)}`);
                            content = content.split(mathPath).join(hostObj.localProxyPath);
                        }
                    });
                });
                return {
                    content,
                    replaceLogs
                };
            };
            // html-webpack-config
            const { HtmlWebpackPlugin } = option;
            if (HtmlWebpackPlugin) {
                compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
                    if (!isWatching) {
                        return;
                    }
                    const logger = compilation.getLogger(PLUGIN_NAME);
                    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(PLUGIN_NAME, (info, cb) => __awaiter(this, void 0, void 0, function* () {
                        const { content, replaceLogs } = replaceHandle(info.html);
                        if (replaceLogs.length) {
                            changed = true;
                            logger.info(`${LANG.UPDATE_FILE}: ${chalk__default['default'].magenta(info.outputName)}`);
                            replaceLogs.forEach((str) => {
                                logger.info(str);
                            });
                            info.html = content;
                        }
                        cb(null, info);
                    }));
                });
            }
            this.initCompilation({
                compiler,
                onProcessAssets: (compilation) => __awaiter(this, void 0, void 0, function* () {
                    var _b, _c, _d, _e;
                    if (!isWatching) {
                        return;
                    }
                    const iHooks = getHooks(compilation);
                    const logger = compilation.getLogger(PLUGIN_NAME);
                    logger.group(PLUGIN_NAME);
                    if (options.devServer) {
                        logger.info(`${chalk__default['default'].yellow(LANG.PORT_INFO)}: ${chalk__default['default'].cyan(options.devServer.port)}`);
                        logger.info(`${chalk__default['default'].yellow(LANG.DIST_INFO)}: ${chalk__default['default'].cyan(options.devServer.contentBase)}`);
                        if ((_b = options.devServer) === null || _b === void 0 ? void 0 : _b.proxy) {
                            logger.info(`${chalk__default['default'].yellow(LANG.PROXY_INFO)}:`);
                            const iProxy = (_c = options.devServer) === null || _c === void 0 ? void 0 : _c.proxy;
                            Object.keys(iProxy).forEach((key) => {
                                const proxyInfo = iProxy[key];
                                if (typeof proxyInfo === 'string') {
                                    logger.info(`${key} -> ${chalk__default['default'].cyan(proxyInfo)}`);
                                }
                                else {
                                    logger.info(`${key} -> ${chalk__default['default'].cyan(proxyInfo.target)}`);
                                }
                            });
                        }
                        if ((_d = options.devServer) === null || _d === void 0 ? void 0 : _d.openPage) {
                            logger.info(`${chalk__default['default'].yellow(LANG.HOME_PAGE)}: ${chalk__default['default'].cyan((_e = options.devServer) === null || _e === void 0 ? void 0 : _e.openPage)}`);
                        }
                    }
                    if (hostParams.length) {
                        logger.info(`${chalk__default['default'].yellow(LANG.REPLACE_INFO)}:`);
                        Object.keys(compilation.assets)
                            .filter((key) => {
                            return ['.js', '.css', '.html', '.map'].includes(path__default['default'].extname(key));
                        })
                            .forEach((key) => {
                            const asset = compilation.assets[key];
                            const { content, replaceLogs } = replaceHandle(asset.source().toString());
                            if (replaceLogs.length) {
                                changed = true;
                                logger.info(`${LANG.UPDATE_FILE}: ${chalk__default['default'].magenta(key)}`);
                                replaceLogs.forEach((str) => {
                                    logger.info(str);
                                });
                                this.updateAssets({
                                    compilation,
                                    assetsInfo: {
                                        dist: key,
                                        source: Buffer.from(content)
                                    }
                                });
                            }
                        });
                        if (!changed) {
                            logger.info(chalk__default['default'].gray(LANG.REPLACE_NONE));
                        }
                    }
                    yield iHooks.emit.promise();
                    logger.groupEnd();
                })
            });
        });
    }
}
module.exports = YylServerWebpackPlugin;

exports.default = YylServerWebpackPlugin;
