const webpack = require("webpack");
const path = require("path");

export interface Option {
  prefix?: string;
  srcDir?: string;
  distDir?: string;
}
export function get(option: Option) {
  option = option ?? {};
  option.prefix = option.prefix ?? "demo";
  option.srcDir = option.srcDir ?? "./demoSrc";
  option.distDir = option.distDir ?? "./docs/demo";

  const configPath = path.resolve(process.cwd(), "webpack.config.js");
  const config = require(configPath)(
    option.srcDir,
    option.distDir,
    option.prefix
  );
  config.mode = "development";
  const compiler = webpack(config);
  const compile = (cb: Function, compiler) => {
    compiler.run((err, stats) => {
      cb();
    });
  };

  const bundle = (cb: Function) => {
    compile(cb, compiler);
  };

  return {
    bundle: bundle
  };
}
