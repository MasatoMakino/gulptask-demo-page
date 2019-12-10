import { Option } from "./Option";
export interface EJSTasks {
    generateHTLM: Function;
    watchHTLM: Function;
}
/**
 * gulpタスク関数を出力する。
 * @param option
 */
export declare function getHTLMGenerator(option: Option): EJSTasks;
/**
 * gulpタスク関数。
 */
export declare function generateHTLM(): Promise<void>;
//# sourceMappingURL=EJS.d.ts.map