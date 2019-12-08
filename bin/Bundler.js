"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function getBundlerSet(option) {
    const configPath = path.resolve(process.cwd(), "webpack.config.js");
    const config = require(configPath)(option.srcDir, option.distDir, option.prefix);
    const { bundleDevelopment, watchBundle } = require("gulptask-webpack").get({
        developmentConfigParams: config
    });
    return {
        bundleDevelopment,
        watchBundle
    };
}
exports.getBundlerSet = getBundlerSet;
