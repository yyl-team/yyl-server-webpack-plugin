import { Compiler, WebpackOptionsNormalized, Compilation } from 'webpack';
import { YylWebpackPluginBaseOption, YylWebpackPluginBase } from 'yyl-webpack-plugin-base';
export interface YylServerWebpackPluginOption extends Pick<YylWebpackPluginBaseOption, 'context'> {
    /** 本地服务根目录 */
    static: string;
    /** 本地服务端口 */
    port: number;
    /** 是否启动热更新 */
    hmr: boolean;
    /** 需要代理的域名 */
    proxy?: {
        hosts: string[];
        enable: boolean;
    };
    /** 构建成功后打开的页面 */
    homePage?: string;
    /** 是否启动插件 */
    enable?: boolean;
}
export declare type YylServerWebpackPluginProperty = Required<YylServerWebpackPluginOption>;
export interface ProxyProps {
    target: string;
    changeOrigin: boolean;
    pathRewrite: {
        [reg: string]: string;
    };
}
export interface InitConfigResult {
    devServer: WebpackOptionsNormalized['devServer'];
}
export declare class YylServerWebpackPlugin extends YylWebpackPluginBase {
    static getHooks(compilation: Compilation): any;
    static getName(): string;
    option: YylServerWebpackPluginProperty;
    constructor(option?: YylServerWebpackPluginOption);
    apply(compiler: Compiler): Promise<void>;
}
