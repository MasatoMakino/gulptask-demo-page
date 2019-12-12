export interface Option {
  prefix?: string;
  srcDir?: string;
  distDir?: string;
  externalScripts?: string[];
  body?: string;
  style?: string;
  copyTargets?: string[];
}
export function initOptions(option: Option): Option {
  option = option ?? {};
  option.prefix = option.prefix ?? "demo";
  option.srcDir = option.srcDir ?? "./demoSrc";
  option.distDir = option.distDir ?? "./docs/demo";
  option.externalScripts = option.externalScripts ?? [];
  option.body = option.body ?? "";
  option.style = option.style ?? "";
  option.copyTargets = option.copyTargets ?? ["png", "jpg", "jpeg"];
  return option;
}
