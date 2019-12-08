export interface Option {
  prefix?: string;
  srcDir?: string;
  distDir?: string;
  externalScripts?: string[];
}
export function initOptions(option: Option): Option {
  option = option ?? {};
  option.prefix = option.prefix ?? "demo";
  option.srcDir = option.srcDir ?? "./demoSrc";
  option.distDir = option.distDir ?? "./docs/demo";
  option.externalScripts = option.externalScripts ?? [];
  return option;
}
