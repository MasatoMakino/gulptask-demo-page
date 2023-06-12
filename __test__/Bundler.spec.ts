import fs from "fs";
import path from "path";
import { getBundlerSet } from "../src/Bundler";
import { initOptions } from "../src/Option";

describe("Bundler", () => {
  const getDefaultBundlerSet = () => {
    const option = initOptions(null);
    return getBundlerSet(option);
  };
  const isExistFile = (relativePath: string) => {
    const isExist = fs.existsSync(path.resolve(process.cwd(), relativePath));
    expect(isExist).toBeTruthy();
  };

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
  });

  test("watch", () => {
    const bundlerSet = getDefaultBundlerSet();
    const watching = bundlerSet.watchBundle();
    watching.suspend();
  });
});
