import { series } from "gulp";
import { getBundlerSet } from "./Bundler";
import { Option, initOptions } from "./Option";
import { getHTLMGenerator } from "./EJS";

export interface Tasks {
  bundleDemo: Function;
  watchDemo: Function;
}

export function get(option: Option): Tasks {
  option = initOptions(option);
  const bundlerSet = getBundlerSet(option);
  const generateHTML = getHTLMGenerator(option);

  return {
    bundleDemo: series(bundlerSet.bundleDevelopment, generateHTML),
    watchDemo: bundlerSet.watchBundle
  };
}
