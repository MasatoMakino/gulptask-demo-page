import { getBundlerSet } from "./Bundler";
import { Option, initOptions } from "./Option";

const path = require("path");

export interface Tasks {
  bundleDemo: Function;
  watchDemo: Function;
}

export function get(option: Option): Tasks {
  option = initOptions(option);
  const bundlerSet = getBundlerSet(option);

  return {
    bundleDemo: bundlerSet.bundleDevelopment,
    watchDemo: bundlerSet.watchBundle
  };
}
