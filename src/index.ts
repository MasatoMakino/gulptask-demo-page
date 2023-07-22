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
 * デモページタスクを生成する。
 * @param option
 * @deprecated This function is deprecated in the future. Please use CLI.
 */
export function generateTasks(option: Option): Tasks {
  const initializedOption = initOptions(option);
  const bundlerSet = getBundlerSet(initializedOption);
  const ejsTasks = getHTLMGenerator(initializedOption);
  const copyTasks = getCopyTaskSet(initializedOption);
  const styleTask = getStyleTask();
  const cleanTask = getCleanTask(initializedOption);

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
      copyTasks.copy();
      copyTasks.watchCopy();
      bundlerSet.watchBundle();
      ejsTasks.watchHTML();
    },
  };
}
