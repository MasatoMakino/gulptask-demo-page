"use strict";

import { Option } from "./Option";

const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const glob = require("glob");
const makeDir = require("make-dir");

let generatorOption: Option;

export function getHTLMGenerator(option: Option) {
  generatorOption = option;
  return generateHTLM;
}

export async function generateHTLM() {
  const distDir = path.resolve(process.cwd(), generatorOption.distDir);

  const targets = glob.sync(`**/*.js`, {
    cwd: distDir,
    ignore: ["vendor.bundle.js"]
  });

  for (let scriptPath of targets) {
    await exportEJS(scriptPath, distDir);
  }
  return;
}

async function exportEJS(scriptPath: string, distDir: string) {
  const distPath = path.resolve(distDir, scriptPath);

  const ejsOption = {
    title: scriptPath,
    script: getScriptRelativePath(distPath),
    vendorPath: getVendorPath(distDir, distPath)
  };
  const htmlPath = getHtmlPath(distPath);

  return new Promise((resolve, reject) => {
    ejs.renderFile("template/demo.ejs", ejsOption, (err, str) => {
      if (err) {
        console.log(err);
        reject();
      }

      makeDir(path.dirname(distPath)).then(() => {
        fs.writeFile(htmlPath, str, () => {
          resolve();
        });
      });
    });
  });
}

function getVendorPath(distDir: string, distPath: string): string {
  const vendorPath = path.resolve(distDir, "vendor.bundle.js");
  return path.relative(path.dirname(distPath), vendorPath);
}

function getScriptRelativePath(distPath: string): string {
  return path.relative(path.dirname(distPath), distPath);
}

function getHtmlPath(distPath: string): string {
  return path.format({
    dir: path.dirname(distPath),
    name: path.basename(distPath, ".js"),
    ext: ".html"
  });
}
