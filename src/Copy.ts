import path from "path";
import { Option } from "./Option";
import chokidar from "chokidar";
import recursiveCopy from "recursive-copy";

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
      return  chokidar.watch(getCopyGlob()).on("all", copy);
    },
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
  return `${srcDir}/${getFilterGlob()}`;
}

function getFilterGlob(): string {
  const extension = copyOption.copyTargets.join("|");
  return `**/*.@(${extension})`;
}

async function copy() {
  await recursiveCopy(getSrcDir(), getDistDir(), {
    filter: getFilterGlob(),
    overwrite: true,
  });
}
