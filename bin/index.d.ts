export interface Option {
    prefix?: string;
    srcDir?: string;
    distDir?: string;
}
export interface Tasks {
    bundleDemo: Function;
    watchDemo: Function;
}
export declare function get(option: Option): Tasks;
//# sourceMappingURL=index.d.ts.map