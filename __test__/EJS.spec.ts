import { getHTLMGenerator } from "../src/EJS.js";
import { initOptions } from "../src/Option.js";
import { getBundlerSet } from "../src/Bundler.js";
import { isExistFile } from "./Util.js";
import { describe, test, vi, expect } from "vitest";

describe("EJS", () => {
  const generateDefaultTasks = () => {
    const option = initOptions(undefined);
    return getHTLMGenerator(option);
  };

  const spyLog = vi.spyOn(console, "log").mockImplementation(() => {});
  test("getHTLMGenerator", () => {
    const ejsTasks = generateDefaultTasks();
    expect(ejsTasks.generateHTML).toBeTruthy();
    expect(ejsTasks.watchHTML).toBeTruthy();
  });

  test("generateHTML", async () => {
    const option = initOptions(undefined);

    //ejsタスクはbundleタスクで生成されたjsファイルを元にhtmlを生成する。
    const bundleTasks = await getBundlerSet(option);
    await bundleTasks.bundleDevelopment();

    const ejsTasks = getHTLMGenerator(option);
    await ejsTasks.generateHTML();

    isExistFile("./docs/demo/index.html");
    isExistFile("./docs/demo/demo.html");
    isExistFile("./docs/demo/demoTypeScript.html");
    isExistFile("./docs/demo/sub/demoSub.html");
  }, 10000);

  test("watchHTML", async () => {
    const ejsTasks = generateDefaultTasks();
    const watcher = ejsTasks.watchHTML();
    await watcher.close();
  });
});
