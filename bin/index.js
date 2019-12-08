"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = require("gulp");
const Bundler_1 = require("./Bundler");
const Option_1 = require("./Option");
const EJS_1 = require("./EJS");
function get(option) {
    option = Option_1.initOptions(option);
    const bundlerSet = Bundler_1.getBundlerSet(option);
    const ejsTasks = EJS_1.getHTLMGenerator(option);
    return {
        bundleDemo: gulp_1.series(bundlerSet.bundleDevelopment, ejsTasks.generateHTLM),
        watchDemo: (cb) => {
            bundlerSet.watchBundle();
            ejsTasks.watchHTLM();
            cb();
        }
    };
}
exports.get = get;
