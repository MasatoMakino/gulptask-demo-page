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
export declare function initOptions(option: Option): Option;
//# sourceMappingURL=Option.d.ts.map