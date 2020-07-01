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
exports.get = void 0;
const gulp_1 = require("gulp");
const Bundler_1 = require("./Bundler");
const Option_1 = require("./Option");
const EJS_1 = require("./EJS");
const Copy_1 = require("./Copy");
function get(option) {
    option = Option_1.initOptions(option);
    const bundlerSet = Bundler_1.getBundlerSet(option);
    const ejsTasks = EJS_1.getHTLMGenerator(option);
    const copyTasks = Copy_1.getCopyTaskSet(option);
    return {
        bundleDemo: gulp_1.series(bundlerSet.bundleDevelopment, ejsTasks.generateHTML, copyTasks.copy),
        watchDemo: () => __awaiter(this, void 0, void 0, function* () {
            bundlerSet.watchBundle();
            ejsTasks.watchHTML();
            copyTasks.watchCopy();
        })
    };
}
exports.get = get;
