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
const gulp_1 = require("gulp");
const path = require("path");
let copyOption;
function getCopyTaskSet(option) {
    copyOption = option;
    return {
        copy: copy,
        watchCopy: () => {
            gulp_1.watch(getCopyGlob(), copy);
        }
    };
}
exports.getCopyTaskSet = getCopyTaskSet;
function getSrcDir() {
    return path.resolve(process.cwd(), copyOption.srcDir);
}
function getDistDir() {
    return path.resolve(process.cwd(), copyOption.distDir);
}
function getCopyGlob() {
    const srcDir = getSrcDir();
    const extension = copyOption.copyTargets.join(",");
    return `${srcDir}/**/*.{${extension}}`;
}
function copy() {
    return __awaiter(this, void 0, void 0, function* () {
        gulp_1.src(getCopyGlob(), { base: getSrcDir() }).pipe(gulp_1.dest(getDistDir()));
    });
}
