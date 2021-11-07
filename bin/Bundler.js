"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBundlerSet = void 0;
const webpack_1 = require("webpack");
const path = require("path");
function getBundlerSet(option) {
    const configPath = path.resolve(__dirname, "../webpack.config.js");
    const config = require(configPath)(option.srcDir, option.distDir, option.prefix);
    overrideTsConfigPath(config);
    overrideTsTarget(config, option.compileTarget);
    overrideRules(config, option);
    checkEntries(config, option);
    const watchOption = Object.assign(Object.assign({}, config), { mode: "development" });
    return {
        bundleDevelopment: () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, webpack_1.webpack)(config, (err, stats) => {
                    handleStats(stats);
                    if (err) {
                        reject();
                    }
                    resolve();
                });
            });
        }),
        watchBundle: () => {
            (0, webpack_1.webpack)(watchOption).watch({}, (err, stats) => {
                handleStats(stats);
            });
        },
    };
}
exports.getBundlerSet = getBundlerSet;
/**
 * ts-loader用設定ファイルパスを、webpack.config.jsに注入する。
 *
 * @param config
 */
const overrideTsConfigPath = (config) => {
    const tsRule = getTypeScriptRule(config);
    if (!tsRule)
        return;
    tsRule.options["configFile"] = path.resolve(__dirname, "../tsconfig.page.json");
};
const getTypeScriptRule = (config) => {
    return config.module.rules.find((rule) => {
        return rule.loader === "ts-loader";
    });
};
const overrideTsTarget = (config, target) => {
    var _a;
    var _b;
    if (target == null)
        return;
    const tsRule = getTypeScriptRule(config);
    if (!tsRule)
        return;
    (_a = (_b = tsRule.options)["compilerOptions"]) !== null && _a !== void 0 ? _a : (_b["compilerOptions"] = {});
    tsRule.options["compilerOptions"]["target"] = target;
};
const overrideRules = (config, option) => {
    config.module.rules.push(...option.rules);
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
/**
 * 成功メッセージ、もしくはエラーメッセージをコンソール出力する。
 * @param stats
 */
const handleStats = (stats) => {
    if (stats == null)
        return;
    if (stats.hasErrors()) {
        stats.compilation.errors.forEach((err) => {
            console.log(err.message);
        });
        return;
    }
    console.log("'gulptask-demo-page' process time : " +
        (stats.endTime - stats.startTime) +
        " ms");
};
