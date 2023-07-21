import { promises as fsPromises } from "fs";
import { Option } from "./Option";

let distDir: string | undefined;
export function getCleanTask(option: Option) {
  distDir = option.distDir;
  return async () => {
    if (distDir == null) return;
    await fsPromises.rm(distDir, { recursive: true, force: true });
  };
}
