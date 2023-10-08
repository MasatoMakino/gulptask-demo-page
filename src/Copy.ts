import path from "path";
import { InitializedOption } from "./Option.js";
import chokidar from "chokidar";
import fsPromises from "fs/promises";

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
      return chokidar
        .watch(getCopyGlob(), { awaitWriteFinish: true })
        .on("change", copyFile)
        .on("add", copyFile)
        .on("unlink", copyFile);
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
    const stat = await fsPromises.lstat(source);
    if (stat.isDirectory()) return true;

    const ext = path.extname(source);
    return copyOption.copyTargets.some((targetExt) => {
      return ext === `.${targetExt}` || ext === targetExt;
    });
  };

  await fsPromises.cp(getSrcDir(), getDistDir(), {
    recursive: true,
    filter,
  });
}

/**
 * ファイル単体をコピーする
 */
async function copyFile(filePath: string) {
  const source = filePath;
  const destination = filePath.replace(getSrcDir(), getDistDir());
  const dir = path.dirname(destination);
  await fsPromises.mkdir(dir, { recursive: true });
  await fsPromises.copyFile(source, destination);
}
