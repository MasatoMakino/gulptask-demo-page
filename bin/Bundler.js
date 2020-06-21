"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBundlerSet = void 0;
const path = require("path");
function getBundlerSet(option) {
    const configPath = path.resolve(__dirname, "../webpack.config.js");
    const config = require(configPath)(option.srcDir, option.distDir, option.prefix);
    overrideTsConfigPath(config);
    checkEntries(config, option);
    const { bundleDevelopment, watchBundle } = require("gulptask-webpack").get({
        developmentConfigParams: config,
    });
    return {
        bundleDevelopment,
        watchBundle,
    };
}
exports.getBundlerSet = getBundlerSet;
/**
 * ts-loader用設定ファイルパスを、webpack.config.jsに注入する。
 *
 * @param config
 */
const overrideTsConfigPath = (config) => {
    config.module.rules.find((rule) => {
        return rule.loader === "ts-loader";
    }).options.configFile = path.resolve(__dirname, "../tsconfig.page.json");
};
/**
 * webpack.config.jsのentryが正常に設定されているかを確認する。
 *
 * @param config
 * @param option
 */
const checkEntries = (config, option) => {
    if (Object.entries(config.entry).length === 0) {
        console.error(`gulptaks-demo-page : webpackの対象となるデモページスクリプトが存在しません。\n
      ${option.distDir}ディレクトリ内にプレフィックス${option.prefix}で始まるJavaScriptファイルが存在するか確認してください。`);
    }
};
