import { Compiler, Compilation } from 'webpack';
import { Configuration } from 'webpack-dev-server';
import { YylWebpackPluginBaseOption, YylWebpackPluginBase } from 'yyl-webpack-plugin-base';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Logger } from 'yyl-seed-base';
import { Express } from 'express';
export { Options as HttpProxyMiddlewareOption } from 'http-proxy-middleware';
export interface YylServerWebpackPluginOption extends Pick<YylWebpackPluginBaseOption, 'context'> {
    devServer?: Configuration;
    /** https */
    https?: boolean;
    /** 需要代理的域名 */
    proxy?: {
        /** 代理的 host 列表 */
        hosts?: string[];
        /** 是否激活 */
        enable?: boolean;
        /** 日志类型 */
        logLevel?: 0 | 1 | 2;
    };
    /** 构建成功后打开的页面 */
    homePage?: string;
    /** html-webpack-plugin 插件 */
    HtmlWebpackPlugin?: typeof HtmlWebpackPlugin;
}
export declare type YylServerWebpackPluginProperty = Required<Omit<YylServerWebpackPluginOption, 'HtmlWebpackPlugin'>> & {
    HtmlWebpackPlugin?: typeof HtmlWebpackPlugin;
};
/** 初始化 proxy 中间件 - 配置 */
export interface InitProxyMiddlewareOption {
    proxy: YylServerWebpackPluginOption['proxy'];
    app: Express;
    logger?: Logger;
    logLevel?: Required<YylServerWebpackPluginOption>['proxy']['logLevel'];
}
export interface ProxyProps {
    target: string;
    changeOrigin: boolean;
    pathRewrite: {
        [reg: string]: string;
    };
    logLevel?: 'info' | 'debug' | 'error' | 'warn' | 'silent';
}
/** 初始化 devServer plugin */
export default class YylServerWebpackPlugin extends YylWebpackPluginBase {
    /** 初始化 proxy 中间件 */
    static initProxyMiddleware(op: InitProxyMiddlewareOption): void;
    /** devServer 配置初始化 */
    static initDevServerConfig(op?: YylServerWebpackPluginOption): Configuration;
    static getHooks(compilation: Compilation): any;
    static getName(): string;
    option: YylServerWebpackPluginProperty;
    constructor(option?: YylServerWebpackPluginOption);
    /** proxy 操作 页面的 url 替换 */
    apply(compiler: Compiler): Promise<void>;
}
