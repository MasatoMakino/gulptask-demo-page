#!/usr/bin/env node

import { Command } from "commander";
import { generateTasks } from "./index.js";
import path from "path";

const program = new Command();

program
  .option("-W --watch", "default : false")
  .option("--prefix <string>", "default : demo")
  .option("--srcDir <path>", "default : ./demoSrc")
  .option("--distDir <path>", "default : ./docs/demo")
  .option("--body <string>", "html tag to insert into the body")
  .option(
    "--style <string>",
    'This is the css style that will be applied to the demo page. ex : "canvas{background-color:#000}"',
  )
  .option("--copyTargets [extensions...]", 'default : "png", "jpg", "jpeg"')
  .option(
    "--externalScripts [url...]",
    'ex : "https://code.createjs.com/1.0.0/createjs.min.js"',
  )
  .option("--rule <path>", "config file path for webpack rules")
  .option("--compileTarget <string>", "config compile target for tsconfig")
  .parse(process.argv);

const args = program.opts();

(async () => {
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
})();
