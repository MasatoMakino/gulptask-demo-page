import { Option } from "./Option";
/**
 * Copy task for demo assets
 */
export interface CopyTaskSet {
    copy: Function;
    watchCopy: Function;
}
export declare function getCopyTaskSet(option: Option): CopyTaskSet;
export declare function getSrcDir(): string;
export declare function getDistDir(): string;
//# sourceMappingURL=Copy.d.ts.map