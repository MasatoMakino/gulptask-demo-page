import { initOptions } from "../src/Option";
import { getCopyTaskSet, getDistDir, getSrcDir } from "../src/Copy";
import path from "path";
import { isExistFile } from "./Util";

describe("Copy", () => {
  const getDefaultCopyTasks = () => {
    const option = initOptions(null);
    return getCopyTaskSet(option);
  };
  test("tasks", () => {
    const copyTaskSet = getDefaultCopyTasks();

    expect(copyTaskSet).toBeTruthy();
    expect(copyTaskSet.copy).toBeTruthy();
    expect(copyTaskSet.watchCopy).toBeTruthy();
  });

  test("getSrcDir", () => {
    getDefaultCopyTasks();
    expect(getSrcDir()).toBe(path.resolve(process.cwd(), "./demoSrc"));
  });

  test("getDistDir", () => {
    getDefaultCopyTasks();
    expect(getDistDir()).toBe(path.resolve(process.cwd(), "./docs/demo"));
  });

  test("copy", async () => {
    const copyTaskSet = getDefaultCopyTasks();
    await copyTaskSet.copy();

    isExistFile("./docs/demo/btn045_01.png");
    isExistFile("./docs/demo/sub/btn045_01.png");
  });

  test("watchCopy", async () => {
    const copyTaskSet = getDefaultCopyTasks();
    const watcher = copyTaskSet.watchCopy();
    await watcher.close();
  });
});
