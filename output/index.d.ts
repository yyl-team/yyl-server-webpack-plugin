import { Compiler, Compilation } from 'webpack';
import { Configuration } from 'webpack-dev-server';
import { YylWebpackPluginBaseOption, YylWebpackPluginBase } from 'yyl-webpack-plugin-base';
import HtmlWebpackPlugin from 'html-webpack-plugin';
export declare type LoggerType = 'warn' | 'info' | 'success' | 'warn' | 'error';
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
    };
    /** 构建成功后打开的页面 */
    homePage?: string;
    /** html-webpack-plugin 插件 */
    HtmlWebpackPlugin?: typeof HtmlWebpackPlugin;
}
export declare type YylServerWebpackPluginProperty = Required<Omit<YylServerWebpackPluginOption, 'HtmlWebpackPlugin'>> & {
    HtmlWebpackPlugin?: typeof HtmlWebpackPlugin;
};
export interface ProxyProps {
    target: string;
    changeOrigin: boolean;
    pathRewrite: {
        [reg: string]: string;
    };
}
/** 初始化 devServer plugin */
export default class YylServerWebpackPlugin extends YylWebpackPluginBase {
    /** devServer 配置初始化 */
    static initDevServerConfig(op?: YylServerWebpackPluginOption): Configuration;
    static getHooks(compilation: Compilation): any;
    static getName(): string;
    option: YylServerWebpackPluginProperty;
    constructor(option?: YylServerWebpackPluginOption);
    /** proxy 操作 页面的 url 替换 */
    apply(compiler: Compiler): Promise<void>;
}
