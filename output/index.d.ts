import { Compiler, Compilation } from 'webpack';
import { Configuration } from 'webpack-dev-server';
import { YylWebpackPluginBaseOption, YylWebpackPluginBase } from 'yyl-webpack-plugin-base';
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
}
export declare type YylServerWebpackPluginProperty = Required<YylServerWebpackPluginOption>;
export interface ProxyProps {
    target: string;
    changeOrigin: boolean;
    pathRewrite: {
        [reg: string]: string;
    };
}
/** devServer 配置初始化 - 返回 */
export interface initDevServerResult {
    devServer: Configuration;
}
/** 初始化 devServer plugin */
export default class YylServerWebpackPlugin extends YylWebpackPluginBase {
    /** devServer 配置初始化 */
    static initDevServerConfig(op?: YylServerWebpackPluginOption): initDevServerResult;
    static getHooks(compilation: Compilation): any;
    static getName(): string;
    option: YylServerWebpackPluginProperty;
    constructor(option?: YylServerWebpackPluginOption);
    /** proxy 操作 页面的 url 替换 */
    apply(compiler: Compiler): Promise<void>;
}
