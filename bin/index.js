"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function get(option) {
    option = initOptions(option);
    const configPath = path.resolve(process.cwd(), "webpack.config.js");
    const config = require(configPath)(option.srcDir, option.distDir, option.prefix);
    const { bundleDevelopment, watchBundle } = require("gulptask-webpack").get({
        developmentConfigParams: config
    });
    return {
        bundleDemo: bundleDevelopment,
        watchDemo: watchBundle
    };
}
exports.get = get;
function initOptions(option) {
    var _a, _b, _c;
    option = (option !== null && option !== void 0 ? option : {});
    option.prefix = (_a = option.prefix, (_a !== null && _a !== void 0 ? _a : "demo"));
    option.srcDir = (_b = option.srcDir, (_b !== null && _b !== void 0 ? _b : "./demoSrc"));
    option.distDir = (_c = option.distDir, (_c !== null && _c !== void 0 ? _c : "./docs/demo"));
    return option;
}
