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
exports.getHTLMGenerator = void 0;
const gulp_1 = require("gulp");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const glob = require("glob");
const makeDir = require("make-dir");
let generatorOption;
let distDir;
/**
 * gulpタスク関数を出力する。
 * @param option
 */
function getHTLMGenerator(option) {
    generatorOption = option;
    distDir = path.resolve(process.cwd(), generatorOption.distDir);
    return {
        generateHTML: getGenerateHTML(option),
        watchHTML: () => {
            gulp_1.watch(distDir + "/**/*.js", getGenerateHTML(option));
        },
    };
}
exports.getHTLMGenerator = getHTLMGenerator;
/**
 * 出力されたJSファイルを監視し、対応するHTMLファイルを出力するgulpタスク
 **/
function getGenerateHTML(option) {
    return function () {
        return __awaiter(this, void 0, void 0, function* () {
            const targets = glob.sync(`**/${option.prefix}*.js`, {
                cwd: distDir,
            });
            for (let scriptPath of targets) {
                yield exportEJS(scriptPath, distDir);
            }
            yield exportIndex(targets);
            return;
        });
    };
}
/**
 * デモjsに対応したhtmlファイルを出力する。
 * @param scriptPath
 * @param distDir
 */
function exportEJS(scriptPath, distDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const distPath = path.resolve(distDir, scriptPath);
        const vendorBundle = getVendorBundlePath(distDir);
        const ejsOption = {
            title: scriptPath,
            script: getScriptRelativePath(distPath),
            externalScripts: generatorOption.externalScripts,
            vendorBundle,
            body: generatorOption.body,
            style: generatorOption.style,
        };
        const htmlPath = getHtmlPath(distPath);
        const ejsPath = path.resolve(__dirname, "../template/demo.ejs");
        return new Promise((resolve, reject) => {
            ejs.renderFile(ejsPath, ejsOption, (err, str) => {
                if (err) {
                    console.log(err);
                    reject();
                }
                makeDir(path.dirname(distPath)).then(() => {
                    fs.writeFile(htmlPath, str, "utf8", () => {
                        resolve();
                    });
                });
            });
        });
    });
}
/**
 * vendor.jsのパスを取得する。
 * 存在しない場合はundefinedを返す。
 *
 * @param distPath
 */
function getVendorBundlePath(distPath) {
    const bundlePath = path.resolve(distDir, "vendor.js");
    if (fs.existsSync(bundlePath)) {
        return path.relative(path.dirname(distPath), bundlePath);
    }
    return;
}
/**
 * デモjsファイルのパスをhtmlファイルからの相対パスに変換する。
 * @param scriptPath
 */
function getScriptRelativePath(scriptPath) {
    return path.relative(path.dirname(scriptPath), scriptPath);
}
/**
 * デモjsファイルのパスから、htmlファイル用のパスを出力する。
 * @param scriptPath
 */
function getHtmlPath(scriptPath) {
    return path.format({
        dir: path.dirname(scriptPath),
        name: path.basename(scriptPath, ".js"),
        ext: ".html",
    });
}
/**
 * index.htmlを出力する。
 * @param targets デモJavaScriptファイルの出力パス
 */
function exportIndex(targets) {
    return __awaiter(this, void 0, void 0, function* () {
        const demoPath = targets.map((val) => {
            const distPath = path.resolve(distDir, val);
            const htmlPath = getHtmlPath(distPath);
            return path.relative(distDir, htmlPath);
        });
        const packageJson = require(path.resolve(process.cwd(), "package.json"));
        const ejsOption = {
            demoPath: demoPath,
            packageName: packageJson.name,
            repository: packageJson.repository
        };
        // console.log(ejsOption);
        const ejsPath = path.resolve(__dirname, "../template/index.ejs");
        return new Promise((resolve, reject) => {
            ejs.renderFile(ejsPath, ejsOption, (err, str) => {
                if (err) {
                    console.log(err);
                    reject();
                }
                makeDir(path.resolve(distDir)).then(() => {
                    // console.log( str );
                    fs.writeFile(path.resolve(distDir, "index.html"), str, "utf8", (err) => {
                        if (err) {
                            console.log(err);
                            reject();
                        }
                        else {
                            resolve();
                        }
                    });
                });
            });
        });
    });
}
