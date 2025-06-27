import fs from "fs/promises";
import path from "path";
import { getDistDir } from "./Copy.js";
import { fileURLToPath } from "url";

/**
 * Returns an asynchronous task that copies style-related files and directories from the template directory to the distribution directory.
 *
 * Only directories and files with `.css`, `.png`, or `.ico` extensions are included in the copy operation.
 * 
 * @returns An asynchronous function that performs the filtered copy operation when invoked
 */
export function getStyleTask(): Function {
  return async () => {
    await fs.cp(getTemplateDir(), getDistDir(), {
      recursive: true,
      filter: async (src, dest) => {
        const stat = await fs.lstat(src);
        if (stat.isDirectory()) return true;

        const ext = path.extname(src);
        return ext === ".css" || ext === ".png" || ext === ".ico";
      },
    });
  };
}

function getTemplateDir(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "../template/");
}
