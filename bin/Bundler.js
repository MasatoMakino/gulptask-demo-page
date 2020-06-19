"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBundlerSet = void 0;
const path = require("path");
function getBundlerSet(option) {
    const configPath = path.resolve(__dirname, "../webpack.config.js");
    const config = require(configPath)(option.srcDir, option.distDir, option.prefix);
    if (Object.entries(config.entry).length === 0) {
        console.error(`gulptaks-demo-page : webpackの対象となるデモページスクリプトが存在しません。\n
      ${option.distDir}ディレクトリ内にプレフィックス${option.prefix}で始まるJavaScriptファイルが存在するか確認してください。`);
    }
    const { bundleDevelopment, watchBundle } = require("gulptask-webpack").get({
        developmentConfigParams: config,
    });
    return {
        bundleDevelopment,
        watchBundle,
    };
}
exports.getBundlerSet = getBundlerSet;
