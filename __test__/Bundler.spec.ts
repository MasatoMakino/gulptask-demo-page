import { getBundlerSet } from "../src/Bundler";
import { initOptions } from "../src/Option";

describe("Bundler", () => {
  const getDefaultBundlerSet = () => {
    const option = initOptions(null);
    return getBundlerSet(option);
  };
  test("getBundlerSet", () => {
    const bundlerSet = getDefaultBundlerSet();
    expect(bundlerSet.bundleDevelopment).toBeTruthy();
    expect(bundlerSet.watchBundle).toBeTruthy();
  });

  test("watch", () => {
    const bundlerSet = getDefaultBundlerSet();
    const watching = bundlerSet.watchBundle();
    watching.suspend();
  });
});
