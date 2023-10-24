import { getBundlerSet } from "../src/Bundler.js";
import { initOptions } from "../src/Option.js";
import { getCleanTask } from "../src/Clean.js";
import { isExistFile, isNotExistFile } from "./Util.js";
import { describe, test, vi } from "vitest";

describe("Clean", () => {
  const spyLog = vi.spyOn(console, "log").mockImplementation(() => {});

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
