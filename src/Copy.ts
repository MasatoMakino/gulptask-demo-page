import path from "path";
import { InitializedOption } from "./Option.js";
import chokidar from "chokidar";
import fs from "fs/promises";

/**
 * Copy task for demo assets
 */
export interface CopyTaskSet {
  copy: Function;
  watchCopy: Function;
}

let copyOption: InitializedOption;
export function getCopyTaskSet(option: InitializedOption): CopyTaskSet {
  copyOption = option as InitializedOption;

  return {
    copy: copy,
    watchCopy: () => {
      return chokidar.watch(getCopyGlob()).on("all", copy);
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
  const filter = async (
    source: string,
    destination: string,
  ): Promise<boolean> => {
    const stat = await fs.lstat(source);
    if (stat.isDirectory()) return true;

    const ext = path.extname(source);
    return copyOption.copyTargets.some((targetExt) => {
      return ext === `.${targetExt}` || ext === targetExt;
    });
  };
  await fs.cp(getSrcDir(), getDistDir(), {
    recursive: true,
    filter,
  });
}
