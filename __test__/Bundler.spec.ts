import fs from "node:fs";
import { afterAll, afterEach, describe, expect, test, vi } from "vitest";
import type { Watching } from "webpack";
import { getBundlerSet } from "../src/Bundler.js";
import { initOptions } from "../src/Option.js";
import { isExistFile, removeDir } from "./Util.js";

const watchTestDir = "./watchTest";

describe("Bundler", () => {
  const spyLog = vi.spyOn(console, "log").mockImplementation(() => {});
  const _spyWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const spyError = vi.spyOn(console, "error").mockImplementation(() => {});

  const getDefaultBundlerSet = async () => {
    const option = initOptions(undefined);
    return await getBundlerSet(option);
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    spyLog.mockRestore();
    _spyWarn.mockRestore();
    spyError.mockRestore();
    await removeDir(watchTestDir);
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

  test("bundleDevelopment:module", async () => {
    const option = initOptions({ compileModule: "es2020" });
    const bundlerSet = await getBundlerSet(option);

    await bundlerSet.bundleDevelopment();
    isExistFile("./docs/demo/demo.js");
    isExistFile("./docs/demo/demoTypeScript.js");
    isExistFile("./docs/demo/sub/demoSub.js");
    isExistFile("./docs/demo/vendor.js");
    expect(spyLog).toBeCalledTimes(1);
  }, 20000);

  test("bundleDevelopment:moduleResolution", async () => {
    const option = initOptions({ compileModuleResolution: "bundler" });
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

  test("watch:extractSourceMap integrates external source map into output", async () => {
    // testImportSourceMap.ts imports libWithSourceMap.js which has an external source map.
    // extractSourceMap should extract and integrate it into the webpack output.
    const option = initOptions({
      prefix: "testImportSourceMap",
      distDir: watchTestDir,
    });
    const bundlerSet = await getBundlerSet(option);
    const watching = bundlerSet.watchBundle() as Watching;

    // Wait for initial compilation to complete
    await new Promise<void>((resolve) => {
      watching.compiler.hooks.done.tap("test", () => {
        resolve();
      });
    });

    // Verify output file exists
    const outputPath = `${watchTestDir}/testImportSourceMap.js`;
    isExistFile(outputPath);

    // Verify source map is generated (watch mode uses cheap-module-source-map)
    const content = fs.readFileSync(outputPath, "utf-8");
    expect(content).toContain("sourceMappingURL");

    // Verify source map file contains original TypeScript source
    const mapPath = `${watchTestDir}/testImportSourceMap.js.map`;
    isExistFile(mapPath);
    const mapContent = fs.readFileSync(mapPath, "utf-8");
    const sourceMap = JSON.parse(mapContent);
    // extractSourceMap should include the original .ts file in sources
    const hasOriginalSource = sourceMap.sources.some((s: string) =>
      s.includes("libWithSourceMap.ts"),
    );
    expect(hasOriginalSource).toBe(true);

    watching.close(() => {});
  }, 20000);
});
