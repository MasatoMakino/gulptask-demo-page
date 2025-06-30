import { getBundlerSet } from "./Bundler.js";
import { getCleanTask } from "./Clean.js";
import { getCopyTaskSet } from "./Copy.js";
import { getHTLMGenerator } from "./EJS.js";
import { initOptions, type Option } from "./Option.js";
import { getStyleTask } from "./Style.js";

export interface Tasks {
  bundleDemo: () => Promise<void>;
  cleanDemo: () => Promise<void>;
  watchDemo: () => void;
}

/**
 * デモページタスクを生成する。
 * @param option
 * @deprecated This function is deprecated in the future. Please use CLI.
 */
export async function generateTasks(option: Option): Promise<Tasks> {
  const initializedOption = initOptions(option);
  const bundlerSet = await getBundlerSet(initializedOption);
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
    await tasks.bundleDemo();
  };

  const tasks = {
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

  return tasks;
}
