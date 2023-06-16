import { getBundlerSet } from "../src/Bundler";
import { initOptions } from "../src/Option";
import { isExistFile } from "./Util";

describe("Bundler", () => {
  const spyLog = jest.spyOn(console, "log").mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, "warn").mockImplementation(() => {});

  const spyError = jest.spyOn(console, "error").mockImplementation(() => {});

  const getDefaultBundlerSet = () => {
    const option = initOptions(null);
    return getBundlerSet(option);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getBundlerSet", () => {
    const bundlerSet = getDefaultBundlerSet();
    expect(bundlerSet.bundleDevelopment).toBeTruthy();
    expect(bundlerSet.watchBundle).toBeTruthy();
  });

  test("bundleDevelopment:default", async () => {
    const bundlerSet = getDefaultBundlerSet();
    await bundlerSet.bundleDevelopment();
    isExistFile("./docs/demo/demo.js");
    isExistFile("./docs/demo/demoTypeScript.js");
    isExistFile("./docs/demo/sub/demoSub.js");
    isExistFile("./docs/demo/vendor.js");
    expect(spyLog).toBeCalledTimes(1);
  }, 15000);

  test("bundleDevelopment:target", async () => {
    const option = initOptions({ compileTarget: "es6" });
    const bundlerSet = getBundlerSet(option);

    await bundlerSet.bundleDevelopment();
    isExistFile("./docs/demo/demo.js");
    isExistFile("./docs/demo/demoTypeScript.js");
    isExistFile("./docs/demo/sub/demoSub.js");
    isExistFile("./docs/demo/vendor.js");
    expect(spyLog).toBeCalledTimes(1);
  }, 15000);

  test("bundleDevelopment:error", async () => {
    const option = initOptions({ prefix: "unbuildable" });
    const bundlerSet = getBundlerSet(option);

    await expect(bundlerSet.bundleDevelopment).rejects.toThrow();
  }, 10000);

  test("bundleDevelopment:not exist target files", async () => {
    const option = initOptions({ prefix: "notExist" });
    const bundlerSet = getBundlerSet(option);

    await bundlerSet.bundleDevelopment();
    expect(spyError).toBeCalledTimes(1);
  });

  test("watch", () => {
    const bundlerSet = getDefaultBundlerSet();
    const watching = bundlerSet.watchBundle();
    watching.suspend();
  });
});
