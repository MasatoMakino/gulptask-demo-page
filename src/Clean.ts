const rimraf = require("rimraf");
import { Option } from "./Option";

let distDir: string;
export function getCleanTask(option: Option) {
  distDir = option.distDir;
  return clean;
}

const clean = (): Promise<void> => {
  return new Promise((resolve) => {
    rimraf(distDir, () => {
      resolve();
    });
  });
};
