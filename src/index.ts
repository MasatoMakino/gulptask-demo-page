const path = require("path");

export interface Option {
  prefix?: string;
  srcDir?: string;
  distDir?: string;
}

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

function initOptions(option: Option): Option {
  option = option ?? {};
  option.prefix = option.prefix ?? "demo";
  option.srcDir = option.srcDir ?? "./demoSrc";
  option.distDir = option.distDir ?? "./docs/demo";
  return option;
}

function getBundlerSet(option: Option) {
  const configPath = path.resolve(process.cwd(), "webpack.config.js");
  const config = require(configPath)(
    option.srcDir,
    option.distDir,
    option.prefix
  );

  const { bundleDevelopment, watchBundle } = require("gulptask-webpack").get({
    developmentConfigParams: config
  });

  return {
    bundleDevelopment,
    watchBundle
  };
}
