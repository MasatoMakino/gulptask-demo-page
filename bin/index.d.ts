import { Option } from "./Option";
export interface Tasks {
    bundleDemo: Function;
    cleanDemo: Function;
    watchDemo: Function;
}
/**
 * @deprecated Use generateTasks
 * @param option
 */
export declare function get(option: Option): Tasks;
/**
 * デモページタスクを生成する。
 * @param option
 */
export declare function generateTasks(option: Option): Tasks;
//# sourceMappingURL=index.d.ts.map