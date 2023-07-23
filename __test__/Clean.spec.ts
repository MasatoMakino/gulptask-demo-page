import { getBundlerSet } from "../bin/Bundler.js";
import { initOptions } from "../bin/Option.js";
import { getCleanTask } from "../bin/Clean.js";
import { isExistFile, isNotExistFile } from "./Util.js";
import { jest } from "@jest/globals";

describe("Clean", () => {
  const spyLog = jest.spyOn(console, "log").mockImplementation(() => {});

  test("clean", async () => {
    const option = initOptions({ distDir: "./cleanTest" });

    const bundler = await getBundlerSet(option);
    await bundler.bundleDevelopment();
    isExistFile("./cleanTest/demo.js");
    isExistFile("./cleanTest/demoTypeScript.js");
    isExistFile("./cleanTest/sub/demoSub.js");
    isExistFile("./cleanTest/vendor.js");

    const cleanTask = getCleanTask(option);
    await cleanTask();
    isNotExistFile("./cleanTest/demo.js");
    isNotExistFile("./cleanTest/demoTypeScript.js");
    isNotExistFile("./cleanTest/sub/demoSub.js");
    isNotExistFile("./cleanTest/vendor.js");
  }, 10000);
});
