import { AsyncSeriesWaterfallHook } from 'tapable';
import { Compilation } from 'webpack';
export declare function createHooks(): {
    emit: AsyncSeriesWaterfallHook<unknown, import("tapable").UnsetAdditionalOptions>;
};
export declare function getHooks(compilation: Compilation): any;
