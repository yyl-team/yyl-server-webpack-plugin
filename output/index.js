/*!
 * yyl-server-webpack-plugin cjs 0.1.0
 * (c) 2020 - 2021 
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var yylWebpackPluginBase = require('yyl-webpack-plugin-base');
var url = require('url');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

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

const PLUGIN_NAME = 'yylServer';
function getHost(url$1) {
    const iUrl = `http:${url$1.replace(/^https?:/, '')}`;
    return new url.URL(iUrl).hostname;
}
class YylServerWebpackPlugin extends yylWebpackPluginBase.YylWebpackPluginBase {
    constructor(option) {
        super(Object.assign(Object.assign({}, option), { name: PLUGIN_NAME }));
        this.option = {
            context: process.cwd(),
            port: 5000,
            hmr: true,
            static: path__default['default'].resolve(process.cwd(), './dist'),
            enable: false,
            proxy: {
                hosts: [],
                enable: false
            }
        };
        if (option === null || option === void 0 ? void 0 : option.port) {
            this.option.port = option.port;
        }
        if (option === null || option === void 0 ? void 0 : option.context) {
            this.option.context = option.context;
        }
        if (option === null || option === void 0 ? void 0 : option.static) {
            this.option.static = path__default['default'].resolve(this.option.context, option.static);
        }
        if (option === null || option === void 0 ? void 0 : option.proxy) {
            this.option.proxy = Object.assign(Object.assign({}, this.option.proxy), option.proxy);
        }
        if ((option === null || option === void 0 ? void 0 : option.enable) !== undefined) {
            this.option.enable = option.enable;
        }
        if ((option === null || option === void 0 ? void 0 : option.hmr) !== undefined) {
            this.option.hmr = option.hmr;
        }
    }
    apply(compiler) {
        return __awaiter(this, void 0, void 0, function* () {
            const { option } = this;
            const { options } = compiler;
            const proxyhosts = [];
            if (!option.enable) {
                return;
            }
            options.devServer = Object.assign(Object.assign({}, options.devServer), { port: option.port, public: option.static, headers: (() => {
                    if (option.proxy.enable) {
                        return {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
                        };
                    }
                    else {
                        return {};
                    }
                })(), proxy: (() => {
                    const r = {};
                    if (option.proxy.enable) {
                        proxyhosts.map(host => getHost(host)).forEach((host) => {
                            const replaceStr = `/proxy_${host.replace(/\./g, '_')}`;
                            r[replaceStr] = {
                                target: `http://${host}`,
                                changeOrigin: true,
                                pathRewrite: (() => {
                                    const r2 = {};
                                    r2[`^${replaceStr}`] = '';
                                    return r2;
                                })()
                            };
                        });
                    }
                    return r;
                })() });
        });
    }
}
module.exports = YylServerWebpackPlugin;

exports.YylServerWebpackPlugin = YylServerWebpackPlugin;
