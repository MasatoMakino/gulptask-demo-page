"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCleanTask = void 0;
const rimraf = require("rimraf");
let distDir;
function getCleanTask(option) {
    distDir = option.distDir;
    return clean;
}
exports.getCleanTask = getCleanTask;
const clean = () => {
    return new Promise((resolve) => {
        rimraf(distDir, () => {
            resolve();
        });
    });
};
