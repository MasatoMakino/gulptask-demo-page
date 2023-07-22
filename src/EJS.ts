"use strict";
import chokidar from "chokidar";
import { InitializedOption, Option } from "./Option";
import { IPackageJson } from "package-json-type";
import fsPromises from "fs/promises";
import * as glob from "glob";
import fs from "fs";
import path from "path";
import ejs from "ejs";

let generatorOption: InitializedOption;
let distDir: string;
export interface EJSTasks {
  generateHTML: Function;
  watchHTML: Function;
}

/**
 * gulpタスク関数を出力する。
 * @param option
 */
export function getHTLMGenerator(option: InitializedOption): EJSTasks {
  generatorOption = option;
  distDir = path.resolve(process.cwd(), generatorOption.distDir);

  return {
    generateHTML: getGenerateHTML(option),
    watchHTML: () => {
      return chokidar
        .watch(distDir + "/**/*.js")
        .on("all", getGenerateHTML(option));
    },
  };
}

/**
 * 出力されたJSファイルを監視し、対応するHTMLファイルを出力するgulpタスク
 **/
function getGenerateHTML(option: Option) {
  return async function () {
    const targets = glob
      .sync(`**/${option.prefix}*.js`, {
        cwd: distDir,
      })
      .sort();

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
  const vendorBundle = getVendorBundlePath(distDir, distPath);

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

  const str = await ejs.renderFile(ejsPath, ejsOption);
  await fsPromises.mkdir(path.dirname(distPath), { recursive: true });
  await fsPromises.writeFile(htmlPath, str, "utf8");
}

/**
 * vendor.jsのパスを取得する。
 * 存在しない場合はundefinedを返す。
 *
 * @param vendorDir vendor.jsを格納しているディレクトリ
 * @param scriptPath 出力されたjsのパス
 */
function getVendorBundlePath(
  vendorDir: string,
  scriptPath: string,
): string | undefined {
  const bundlePath = path.resolve(vendorDir, "vendor.js");
  if (fs.existsSync(bundlePath)) {
    return path.relative(path.dirname(scriptPath), bundlePath);
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

function getHomePageURL(packageJson: IPackageJson): string {
  const repositoryPath =
    typeof packageJson.repository === "object"
      ? packageJson.repository.url
      : packageJson.repository;

  if (repositoryPath == null) return "";

  const gitRegExp = /^git\+(.*)\.git$/;
  if (gitRegExp.test(repositoryPath)) {
    const match = repositoryPath.match(/^git\+(.*)/) as RegExpMatchArray;
    return match[1];
  }
  return repositoryPath;
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

  const jsonString = fs.readFileSync(
    path.resolve(process.cwd(), "package.json"),
    "utf8",
  );
  const packageJson = JSON.parse(jsonString);

  const repositoryURL = getHomePageURL(packageJson);

  const ejsOption = {
    demoPath: demoPath,
    packageName: packageJson.name,
    repository: repositoryURL,
  };

  const ejsPath = path.resolve(__dirname, "../template/index.ejs");

  const str = await ejs.renderFile(ejsPath, ejsOption);
  await fsPromises.mkdir(path.resolve(distDir), { recursive: true });
  await fsPromises.writeFile(path.resolve(distDir, "index.html"), str, "utf8");
}
