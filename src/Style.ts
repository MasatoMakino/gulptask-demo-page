import { src, dest } from "gulp";
const path = require("path");
import { getDistDir } from "./Copy";

export function getStyleTask(): Function {
  return copyStyle;
}

function getTemplateDir(): string {
  return path.resolve(__dirname, "../template/");
}

function getCopyGlob(): string {
  const srcDir = getTemplateDir();
  return `${srcDir}/**/*.css`;
}

async function copyStyle() {
  src(getCopyGlob(), { base: getTemplateDir() }).pipe(dest(getDistDir()));
}
