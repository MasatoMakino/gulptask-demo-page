"use strict";
import { watch } from "gulp";
import { Option } from "./Option";

const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const glob = require("glob");
const makeDir = require("make-dir");

let generatorOption: Option;
let distDir: string;

export interface EJSTasks {
  generateHTML: Function;
  watchHTML: Function;
}

/**
 * gulpタスク関数を出力する。
 * @param option
 */
export function getHTLMGenerator(option: Option): EJSTasks {
  generatorOption = option;
  distDir = path.resolve(process.cwd(), generatorOption.distDir);

  return {
    generateHTML: getGenerateHTML(option),
    watchHTML: () => {
      watch(distDir + "/**/*.js", getGenerateHTML(option));
    },
  };
}

/**
 * 出力されたJSファイルを監視し、対応するHTMLファイルを出力するgulpタスク
 **/
function getGenerateHTML(option: Option) {
  return async function () {
    const targets = glob.sync(`**/${option.prefix}*.js`, {
      cwd: distDir,
    });

    for (let scriptPath of targets) {
      await exportEJS(scriptPath, distDir);
    }
    await exportIndex(targets);
    return;
  };
}

/**
 * デモjsに対応したhtmlファイルを出力する。
 * @param scriptPath
 * @param distDir
 */
async function exportEJS(scriptPath: string, distDir: string) {
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
}

/**
 * vendor.jsのパスを取得する。
 * 存在しない場合はundefinedを返す。
 *
 * @param distPath
 */
function getVendorBundlePath(distPath: string): string | undefined {
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
function getScriptRelativePath(scriptPath: string): string {
  return path.relative(path.dirname(scriptPath), scriptPath);
}

/**
 * デモjsファイルのパスから、htmlファイル用のパスを出力する。
 * @param scriptPath
 */
function getHtmlPath(scriptPath: string): string {
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
async function exportIndex(targets: string[]) {
  const demoPath = targets.map((val) => {
    const distPath = path.resolve(distDir, val);
    const htmlPath = getHtmlPath(distPath);
    return path.relative(distDir, htmlPath);
  });
  const packageJson = require(path.resolve(process.cwd(), "package.json"));

  const ejsOption = {
    demoPath: demoPath,
    packageName: packageJson.name,
    repository: packageJson.repository,
  };

  const ejsPath = path.resolve(__dirname, "../template/index.ejs");

  return new Promise((resolve, reject) => {
    ejs.renderFile(ejsPath, ejsOption, (err, str) => {
      if (err) {
        console.log(err);
        reject();
      }

      makeDir(path.resolve(distDir)).then(() => {
        fs.writeFile(
          path.resolve(distDir, "index.html"),
          str,
          "utf8",
          (err) => {
            if (err) {
              console.log(err);
              reject();
            } else {
              resolve();
            }
          }
        );
      });
    });
  });
}
