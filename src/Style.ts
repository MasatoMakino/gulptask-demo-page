const path = require("path");
import { getDistDir } from "./Copy";
import copy from "recursive-copy";

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
