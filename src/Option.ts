import { RuleSetRule } from "webpack";

export interface Option {
  prefix?: string;
  srcDir?: string;
  distDir?: string;
  externalScripts?: string[];
  body?: string;
  style?: string;
  copyTargets?: string[];
  rules?: RuleSetRule[];
  compileTarget?: string;
}

export interface InitializedOption extends Option {
  prefix: string;
  srcDir: string;
  distDir: string;
  externalScripts: string[];
  body: string;
  style: string;
  copyTargets: string[];
  rules: RuleSetRule[];
}

export function initOptions(option?: Option): InitializedOption {
  option = option ?? {};
  option.prefix = option.prefix ?? "demo";
  option.srcDir = option.srcDir ?? "./demoSrc";
  option.distDir = option.distDir ?? "./docs/demo";
  option.externalScripts = option.externalScripts ?? [];
  option.body = option.body ?? "";
  option.style = option.style ?? "";

  const copyDefault = ["png", "jpg", "jpeg"];
  if (option.copyTargets == null) {
    option.copyTargets = copyDefault;
  } else {
    option.copyTargets = [...new Set([...copyDefault, ...option.copyTargets])];
  }

  option.rules = option.rules ?? [];
  return option as InitializedOption;
}
