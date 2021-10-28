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
exports.getStyleTask = void 0;
const path = require("path");
const Copy_1 = require("./Copy");
const recursive_copy_1 = __importDefault(require("recursive-copy"));
function getStyleTask() {
    return () => __awaiter(this, void 0, void 0, function* () {
        yield (0, recursive_copy_1.default)(getTemplateDir(), (0, Copy_1.getDistDir)(), {
            filter: "**/*.{css,png}",
            overwrite: true,
        });
    });
}
exports.getStyleTask = getStyleTask;
function getTemplateDir() {
    return path.resolve(__dirname, "../template/");
}
