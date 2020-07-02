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
exports.getStyleTask = void 0;
const gulp_1 = require("gulp");
const path = require("path");
const Copy_1 = require("./Copy");
function getStyleTask() {
    return copyStyle;
}
exports.getStyleTask = getStyleTask;
function getTemplateDir() {
    return path.resolve(__dirname, "../template/");
}
function getCopyGlob() {
    const srcDir = getTemplateDir();
    return `${srcDir}/**/*.css`;
}
function copyStyle() {
    return __awaiter(this, void 0, void 0, function* () {
        gulp_1.src(getCopyGlob(), { base: getTemplateDir() }).pipe(gulp_1.dest(Copy_1.getDistDir()));
    });
}
