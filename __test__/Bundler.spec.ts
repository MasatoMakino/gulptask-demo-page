import { getBundlerSet } from "../bin/Bundler.js";
import { initOptions } from "../bin/Option.js";
import { isExistFile } from "./Util.js";
import { jest } from "@jest/globals";

describe("Bundler", () => {
  const spyLog = jest.spyOn(console, "log").mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, "warn").mockImplementation(() => {});

  const spyError = jest.spyOn(console, "error").mockImplementation(() => {});

  const getDefaultBundlerSet = async () => {
    const option = initOptions(undefined);
    return await getBundlerSet(option);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getBundlerSet", async () => {
    const bundlerSet = await getDefaultBundlerSet();
    expect(bundlerSet.bundleDevelopment).toBeTruthy();
    expect(bundlerSet.watchBundle).toBeTruthy();
  });

  test("bundleDevelopment:default", async () => {
    const bundlerSet = await getDefaultBundlerSet();
    await bundlerSet.bundleDevelopment();
    isExistFile("./docs/demo/demo.js");
    isExistFile("./docs/demo/demoTypeScript.js");
    isExistFile("./docs/demo/sub/demoSub.js");
    isExistFile("./docs/demo/vendor.js");
    expect(spyLog).toBeCalledTimes(1);
  }, 20000);

  test("bundleDevelopment:target", async () => {
    const option = initOptions({ compileTarget: "es6" });
    const bundlerSet = await getBundlerSet(option);

    await bundlerSet.bundleDevelopment();
    isExistFile("./docs/demo/demo.js");
    isExistFile("./docs/demo/demoTypeScript.js");
    isExistFile("./docs/demo/sub/demoSub.js");
    isExistFile("./docs/demo/vendor.js");
    expect(spyLog).toBeCalledTimes(1);
  }, 20000);

  test("bundleDevelopment:error", async () => {
    const option = initOptions({ prefix: "unbuildable" });
    const bundlerSet = await getBundlerSet(option);

    await expect(bundlerSet.bundleDevelopment).rejects.toThrow();
  }, 10000);

  test("bundleDevelopment:not exist target files", async () => {
    const option = initOptions({ prefix: "notExist" });
    const bundlerSet = await getBundlerSet(option);

    await bundlerSet.bundleDevelopment();
    expect(spyError).toBeCalledTimes(1);
  });

  test("watch", async () => {
    const bundlerSet = await getDefaultBundlerSet();
    const watching = bundlerSet.watchBundle();
    watching.suspend();
  });
});
