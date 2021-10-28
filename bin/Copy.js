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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistDir = exports.getSrcDir = exports.getCopyTaskSet = void 0;
const path = require("path");
const chokidar_1 = __importDefault(require("chokidar"));
const recursive_copy_1 = __importDefault(require("recursive-copy"));
let copyOption;
function getCopyTaskSet(option) {
    copyOption = option;
    return {
        copy: copy,
        watchCopy: () => {
            chokidar_1.default.watch(getCopyGlob()).on("all", copy);
        },
    };
}
exports.getCopyTaskSet = getCopyTaskSet;
function getSrcDir() {
    return path.resolve(process.cwd(), copyOption.srcDir);
}
exports.getSrcDir = getSrcDir;
function getDistDir() {
    return path.resolve(process.cwd(), copyOption.distDir);
}
exports.getDistDir = getDistDir;
function getCopyGlob() {
    const srcDir = getSrcDir();
    return `${srcDir}/{${getFilterGlob()}}`;
}
function getFilterGlob() {
    const extension = copyOption.copyTargets.join(",");
    return `**/*.{${extension}}`;
}
function copy() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, recursive_copy_1.default)(getSrcDir(), getDistDir(), { filter: getFilterGlob(), overwrite: true });
    });
}
