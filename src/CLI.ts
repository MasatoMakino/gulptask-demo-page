#!/usr/bin/env node

import { Command } from "commander";
import { generateTasks } from "./index.js";
import path from "path";

const program = new Command();

program
  .option("-W --watch", "Enable watch mode. Default: false")
  .option(
    "--prefix <string>",
    "Specify the prefix for demo page filenames. Default: demo",
  )
  .option(
    "--srcDir <path>",
    "Specify the directory containing demo source files. Default: ./demoSrc",
  )
  .option(
    "--distDir <path>",
    "Specify the output directory for generated demo pages. Default: ./docs/demo",
  )
  .option(
    "--body <string>",
    "Specify HTML tags to insert into the body. The specified content will be inserted within the `<body>` tag of the generated HTML.",
  )
  .option(
    "--style <string>",
    'Specify CSS styles to apply to the demo page. The specified styles will be inserted within the `<style>` tag of the generated HTML. Example: "canvas{background-color:#000}"',
  )
  .option(
    "--copyTargets [extensions...]",
    'Specify file extensions to copy. Example: "png", "jpg", "jpeg", "obj". Default: "png", "jpg", "jpeg"',
  )
  .option(
    "--externalScripts [url...]",
    'Specify an array of script file URLs to load from external CDNs. Use this when loading external modules that cannot be bundled via npm. Example: "https://code.createjs.com/1.0.0/createjs.min.js"',
  )
  .option(
    "--rule <path>",
    "Path to the webpack rule configuration file (e.g., `webpack.config.js`). If this option is specified, the specified configuration file will be loaded. If not specified, the default configuration file built into the package will be used.",
  )
  .option(
    "--compileTarget <string>",
    "Corresponds to TypeScript's `tsconfig.compilerOptions.target`. See the official documentation for details. Example: es5",
  )
  .option(
    "--compileModule <string>",
    "Corresponds to TypeScript's `tsconfig.compilerOptions.module`. See the official documentation for details. Example: es2020",
  )
  .option(
    "--compileModuleResolution <string>",
    "Corresponds to TypeScript's `tsconfig.compilerOptions.moduleResolution`. See the official documentation for details. Example: node, node16, bundler",
  )
  .parse(process.argv);

const args = program.opts();

export async function runCLI() {
  if (args.rule) {
    args.rules = (await import(path.resolve(process.cwd(), args.rule))).default;
  }
  const task = await generateTasks(args);

  if (args.watch) {
    console.log(`'gulptask-demo-page' Starting to watch files ...`);
    task.watchDemo();
  } else {
    await task.bundleDemo();
  }
}
runCLI();
