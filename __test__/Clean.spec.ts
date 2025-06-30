import { describe, test, vi } from "vitest";
import { getBundlerSet } from "../src/Bundler.js";
import { getCleanTask } from "../src/Clean.js";
import { initOptions } from "../src/Option.js";
import { isExistFile, isNotExistFile } from "./Util.js";

describe("Clean", () => {
  const _spyLog = vi.spyOn(console, "log").mockImplementation(() => {});

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
  }, 15_000);
});
