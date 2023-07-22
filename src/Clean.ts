import { promises as fsPromises } from "fs";
import { InitializedOption } from "./Option";

export function getCleanTask(option: InitializedOption) {
  return async () => {
    await fsPromises.rm(option.distDir, { recursive: true, force: true });
  };
}
