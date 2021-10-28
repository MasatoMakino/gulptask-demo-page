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
exports.generateTasks = void 0;
const Bundler_1 = require("./Bundler");
const Clean_1 = require("./Clean");
const Copy_1 = require("./Copy");
const EJS_1 = require("./EJS");
const Option_1 = require("./Option");
const Style_1 = require("./Style");
/**
 * デモページタスクを生成する。
 * @param option
 */
function generateTasks(option) {
    option = (0, Option_1.initOptions)(option);
    const bundlerSet = (0, Bundler_1.getBundlerSet)(option);
    const ejsTasks = (0, EJS_1.getHTLMGenerator)(option);
    const copyTasks = (0, Copy_1.getCopyTaskSet)(option);
    const styleTask = (0, Style_1.getStyleTask)();
    const cleanTask = (0, Clean_1.getCleanTask)(option);
    const bundleDemo = () => __awaiter(this, void 0, void 0, function* () {
        yield bundlerSet.bundleDevelopment();
        yield ejsTasks.generateHTML();
        yield copyTasks.copy();
        yield styleTask();
    });
    const cleanDemo = () => __awaiter(this, void 0, void 0, function* () {
        yield cleanTask();
        yield bundleDemo();
    });
    return {
        bundleDemo,
        cleanDemo,
        watchDemo: () => {
            styleTask();
            bundlerSet.watchBundle();
            ejsTasks.watchHTML();
            copyTasks.watchCopy();
        },
    };
}
exports.generateTasks = generateTasks;
