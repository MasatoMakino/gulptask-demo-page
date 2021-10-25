import { getBundlerSet } from "./Bundler";
import { getCleanTask } from "./Clean";
import { getCopyTaskSet } from "./Copy";
import { getHTLMGenerator } from "./EJS";
import { initOptions, Option } from "./Option";
import { getStyleTask } from "./Style";

export interface Tasks {
  bundleDemo: Function;
  cleanDemo: Function;
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
  const cleanTask = getCleanTask(option);

  const bundleDemo = async () => {
    await bundlerSet.bundleDevelopment();
    await ejsTasks.generateHTML();
    await copyTasks.copy();
    await styleTask();
  };
  const cleanDemo = async () => {
    await cleanTask();
    await bundleDemo();
  };
  return {
    bundleDemo,
    cleanDemo,
    watchDemo: () => {
      styleTask();
      bundlerSet.watchBundle();
      ejsTasks.watchHTML();
      copyTasks.watchCopy();
    },
  };
}
