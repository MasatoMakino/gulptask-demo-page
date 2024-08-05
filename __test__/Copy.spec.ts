import { initOptions } from "../src/Option.js";
import { getCopyTaskSet, getDistDir, getSrcDir } from "../src/Copy.js";
import path from "path";
import { isExistFile } from "./Util.js";
import { describe, test, expect, afterAll } from "vitest";
import fs from "fs";

const copyImgDir = "./test_for_copy_img";

describe("Copy", () => {
  afterAll(async () => {
    await fs.promises.rm(copyImgDir, { recursive: true, force: true });
  });

  const getDefaultCopyTasks = () => {
    const option = initOptions({ distDir: copyImgDir });
    return getCopyTaskSet(option);
  };

  const isCorrectConfigPath = (
    getConfigPathFunc: () => string,
    dir: string,
  ) => {
    expect(getConfigPathFunc()).toBe(path.resolve(process.cwd(), dir));
  };

  test("tasks", () => {
    const copyTaskSet = getDefaultCopyTasks();
    expect(copyTaskSet).toBeTruthy();
    expect(copyTaskSet.copy).toBeTruthy();
    expect(copyTaskSet.watchCopy).toBeTruthy();

    isCorrectConfigPath(getSrcDir, "./demoSrc");
    isCorrectConfigPath(getDistDir, copyImgDir);
  });

  test("copy", async () => {
    const copyTaskSet = getDefaultCopyTasks();
    await copyTaskSet.copy();

    isExistFile(copyImgDir + "/btn045_01.png");
    isExistFile(copyImgDir + "/sub/btn045_01.png");
  });

  test("watchCopy", async () => {
    const copyTaskSet = getDefaultCopyTasks();
    const watcher = copyTaskSet.watchCopy();
    await watcher.close();
  });
});
