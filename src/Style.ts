import path from "path";
import copy from "recursive-copy";
import {getDistDir} from "./Copy";

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
