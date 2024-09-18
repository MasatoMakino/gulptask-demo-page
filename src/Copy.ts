import path from "path";
import { InitializedOption } from "./Option.js";
import chokidar from "chokidar";
import fsPromises from "fs/promises";
import fs from "fs";

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
        .watch(getSrcDir(), { awaitWriteFinish: true })
        .on("change", copyFile)
        .on("add", copyFile);
    },
  };
}

export function getSrcDir(): string {
  return path.resolve(process.cwd(), copyOption.srcDir);
}
export function getDistDir(): string {
  return path.resolve(process.cwd(), copyOption.distDir);
}

const isTargetFileType = (filePath: string): boolean => {
  const ext = path.extname(filePath);
  return copyOption.copyTargets.some((targetExt) => {
    return ext === `.${targetExt}` || ext === targetExt;
  });
};

async function copy() {
  const filter = async (
    source: string,
    destination: string,
  ): Promise<boolean> => {
    const stat = await fsPromises.lstat(source);
    if (stat.isDirectory()) return true;
    return isTargetFileType(source);
  };

  const srcDir = getSrcDir();
  const distDir = getDistDir();

  await fsPromises.mkdir(distDir, { recursive: true });
  await fsPromises.cp(srcDir, distDir, {
    recursive: true,
    filter,
  });
}

/**
 * ファイル単体をコピーする
 */
async function copyFile(filePath: string) {
  const source = filePath;
  if (!fs.existsSync(source)) return;
  if (!isTargetFileType(source)) return;

  const destination = filePath.replace(getSrcDir(), getDistDir());
  const dir = path.dirname(destination);
  await fsPromises.mkdir(dir, { recursive: true });
  await fsPromises.copyFile(source, destination);
}
