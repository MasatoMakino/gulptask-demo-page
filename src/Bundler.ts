import { Option } from "./Option";
const path = require("path");

export function getBundlerSet(option: Option) {
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
