import { initOptions } from "../bin/Option";
import { getCopyTaskSet, getDistDir, getSrcDir } from "../bin/Copy.js";
import path from "path";
import { isExistFile } from "./Util.js";

describe("Copy", () => {
  const getDefaultCopyTasks = () => {
    const option = initOptions(undefined);
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
    isCorrectConfigPath(getDistDir, "./docs/demo");
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
