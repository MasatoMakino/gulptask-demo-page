import path from "path";
import copy from "recursive-copy";
import { getDistDir } from "./Copy.js";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function getStyleTask(): Function {
  return async () => {
    await copy(getTemplateDir(), getDistDir(), {
      filter: "**/*.{css,png}",
      overwrite: true,
    });
  };
}

function getTemplateDir(): string {
  return path.resolve(__dirname, "../template/");
}
