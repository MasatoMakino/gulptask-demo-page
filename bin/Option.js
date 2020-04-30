"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function initOptions(option) {
    var _a, _b, _c, _d, _e, _f, _g;
    option = option !== null && option !== void 0 ? option : {};
    option.prefix = (_a = option.prefix) !== null && _a !== void 0 ? _a : "demo";
    option.srcDir = (_b = option.srcDir) !== null && _b !== void 0 ? _b : "./demoSrc";
    option.distDir = (_c = option.distDir) !== null && _c !== void 0 ? _c : "./docs/demo";
    option.externalScripts = (_d = option.externalScripts) !== null && _d !== void 0 ? _d : [];
    option.body = (_e = option.body) !== null && _e !== void 0 ? _e : "";
    option.style = (_f = option.style) !== null && _f !== void 0 ? _f : "";
    option.copyTargets = (_g = option.copyTargets) !== null && _g !== void 0 ? _g : ["png", "jpg", "jpeg"];
    return option;
}
exports.initOptions = initOptions;
