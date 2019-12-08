"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initOptions(option) {
    var _a, _b, _c, _d, _e;
    option = (option !== null && option !== void 0 ? option : {});
    option.prefix = (_a = option.prefix, (_a !== null && _a !== void 0 ? _a : "demo"));
    option.srcDir = (_b = option.srcDir, (_b !== null && _b !== void 0 ? _b : "./demoSrc"));
    option.distDir = (_c = option.distDir, (_c !== null && _c !== void 0 ? _c : "./docs/demo"));
    option.externalScripts = (_d = option.externalScripts, (_d !== null && _d !== void 0 ? _d : []));
    option.body = (_e = option.body, (_e !== null && _e !== void 0 ? _e : ""));
    return option;
}
exports.initOptions = initOptions;
