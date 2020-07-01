import { series } from "gulp";
import { getBundlerSet } from "./Bundler";
import { Option, initOptions } from "./Option";
import { getHTLMGenerator } from "./EJS";
import { getCopyTaskSet } from "./Copy";

export interface Tasks {
  bundleDemo: Function;
  watchDemo: Function;
}

export function get(option: Option): Tasks {
  option = initOptions(option);
  const bundlerSet = getBundlerSet(option);
  const ejsTasks = getHTLMGenerator(option);
  const copyTasks = getCopyTaskSet(option);

  return {
    bundleDemo: series(
      bundlerSet.bundleDevelopment,
      ejsTasks.generateHTML,
      copyTasks.copy
    ),
    watchDemo: async () => {
      bundlerSet.watchBundle();
      ejsTasks.watchHTML();
      copyTasks.watchCopy();
    }
  };
}
