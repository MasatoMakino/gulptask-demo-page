import { series } from "gulp";
import { getStyleTask } from "./Style";
import { getBundlerSet } from "./Bundler";
import { Option, initOptions } from "./Option";
import { getHTLMGenerator } from "./EJS";
import { getCopyTaskSet } from "./Copy";

export interface Tasks {
  bundleDemo: Function;
  watchDemo: Function;
}

/**
 * @deprecated Use generateTasks
 * @param option
 */
export function get(option: Option): Tasks {
  return generateTasks(option);
}

/**
 * デモページタスクを生成する。
 * @param option
 */
export function generateTasks(option: Option): Tasks {
  option = initOptions(option);
  const bundlerSet = getBundlerSet(option);
  const ejsTasks = getHTLMGenerator(option);
  const copyTasks = getCopyTaskSet(option);
  const styleTask = getStyleTask();

  return {
    bundleDemo: series(
      bundlerSet.bundleDevelopment,
      ejsTasks.generateHTML,
      copyTasks.copy,
      styleTask
    ),
    watchDemo: async () => {
      styleTask();
      bundlerSet.watchBundle();
      ejsTasks.watchHTML();
      copyTasks.watchCopy();
    },
  };
}
