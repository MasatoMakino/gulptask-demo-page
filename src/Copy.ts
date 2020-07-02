import { watch, src, dest } from "gulp";
const path = require("path");
import { Option } from "./Option";

/**
 * Copy task for demo assets
 */
export interface CopyTaskSet {
  copy: Function;
  watchCopy: Function;
}

let copyOption: Option;
export function getCopyTaskSet(option: Option): CopyTaskSet {
  copyOption = option;

  return {
    copy: copy,
    watchCopy: () => {
      watch(getCopyGlob(), copy);
    }
  };
}

export function getSrcDir(): string {
  return path.resolve(process.cwd(), copyOption.srcDir);
}
export function getDistDir(): string {
  return path.resolve(process.cwd(), copyOption.distDir);
}
function getCopyGlob(): string {
  const srcDir = getSrcDir();
  const extension = copyOption.copyTargets.join(",");
  return `${srcDir}/**/*.{${extension}}`;
}

async function copy() {
  src(getCopyGlob(), { base: getSrcDir() }).pipe(dest(getDistDir()));
}
