const fsPromises = require("fs").promises;
import { Option } from "./Option";

let distDir: string;
export function getCleanTask(option: Option) {
  distDir = option.distDir;
  return async () => {
    await fsPromises.rm(distDir, { recursive: true, force: true });
  };
}
