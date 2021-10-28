#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./index");
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
program
    .option("-W --watch", "default : false")
    .option("--prefix <string>", "default : demo")
    .option("--srcDir <path>", "default : ./demoSrc")
    .option("--distDir <path>", "default : ./docs/demo")
    .option("--body <string>", "html tag to insert into the body")
    .option("--style <string>", 'This is the css style that will be applied to the demo page. ex : "canvas{background-color:#000}"')
    .option("--copyTargets [extensions...]", 'default : "png", "jpg", "jpeg"')
    .option("--externalScripts [url...]", 'ex : "https://code.createjs.com/1.0.0/createjs.min.js"')
    .option("--rule <path>", "config file path for webpack rules")
    .parse(process.argv);
const args = program.opts();
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (args.rule) {
        args.rules = (yield Promise.resolve().then(() => __importStar(require(path_1.default.resolve(process.cwd(), args.rule))))).default;
    }
    const task = (0, index_1.generateTasks)(args);
    if (args.watch) {
        console.log(`gulptask-demo-page] Starting to watch files ...`);
        task.watchDemo();
    }
    else {
        yield task.bundleDemo();
    }
}))();
