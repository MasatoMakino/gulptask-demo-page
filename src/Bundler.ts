import {Configuration} from "webpack";
import { Option } from "./Option";
const path = require("path");

export function getBundlerSet(option: Option) {
  const configPath = path.resolve(__dirname, "../webpack.config.js");
  const config:Configuration = require(configPath)(
    option.srcDir,
    option.distDir,
    option.prefix
  );

  overrideTsConfigPath(config);
  overrideRules(config, option);
  checkEntries(config, option);
  console.log( config.module );

  const { bundleDevelopment, watchBundle } = require("gulptask-webpack").get({
    developmentConfigParams: config,
  });

  return {
    bundleDevelopment,
    watchBundle,
  };
}

/**
 * ts-loader用設定ファイルパスを、webpack.config.jsに注入する。
 *
 * @param config
 */
const overrideTsConfigPath = (config:Configuration) => {
  config.module.rules.find((rule) => {
    return rule.loader === "ts-loader";
  }).options["configFile"] = path.resolve(__dirname, "../tsconfig.page.json");
};

const overrideRules = (config:Configuration, option: Option) =>{
  config.module.rules.push( ...option.rules );
}

/**
 * webpack.config.jsのentryが正常に設定されているかを確認する。
 *
 * @param config
 * @param option
 */
const checkEntries = (config:Configuration, option: Option) => {
  if (Object.entries(config.entry).length === 0) {
    console.error(
      `gulptaks-demo-page : webpackの対象となるデモページスクリプトが存在しません。\n
      ${option.distDir}ディレクトリ内にプレフィックス${option.prefix}で始まるJavaScriptファイルが存在するか確認してください。`
    );
  }
};
