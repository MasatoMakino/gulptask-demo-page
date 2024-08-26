import fs from "fs/promises";
import path from "path";
import { getDistDir } from "./Copy.js";
import { fileURLToPath } from "url";

export function getStyleTask(): Function {
  return async () => {
    await fs.cp(getTemplateDir(), getDistDir(), {
      recursive: true,
      filter: async (src, dest) => {
        const stat = await fs.lstat(src);
        if (stat.isDirectory()) return true;

        const ext = path.extname(src);
        return ext === ".css" || ext === ".png";
      },
    });
  };
}

function getTemplateDir(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(__dirname, "../template/");
}
