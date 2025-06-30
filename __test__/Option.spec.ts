import { describe, expect, test } from "vitest";
import { initOptions } from "../src/Option.js";

describe("Option", () => {
  test("default option", () => {
    const option = initOptions(undefined);
    expect(option).toBeTruthy();
    expect(option.prefix).toBe("demo");
    expect(option.srcDir).toBe("./demoSrc");
    expect(option.distDir).toBe("./docs/demo");
    expect(option.externalScripts).toEqual([]);
    expect(option.body).toBe("");
    expect(option.style).toBe("");
    expect(option.copyTargets).toEqual(["png", "jpg", "jpeg"]);
    expect(option.rules).toEqual([]);
  });

  test("custom option", () => {
    const option = initOptions({
      prefix: "test",
      srcDir: "./testSrc",
      distDir: "./testDist",
      externalScripts: ["test.js"],
      body: "test body",
      style: "test style",
      copyTargets: ["test"],
      rules: [{ test: /\.ts$/, loader: "ts-loader" }],
      compileTarget: "es2015",
      compileModule: "es2020",
      compileModuleResolution: "bundler",
    });
    expect(option).toBeTruthy();
    expect(option.prefix).toBe("test");
    expect(option.srcDir).toBe("./testSrc");
    expect(option.distDir).toBe("./testDist");
    expect(option.externalScripts).toEqual(["test.js"]);
    expect(option.body).toBe("test body");
    expect(option.style).toBe("test style");
    expect(option.copyTargets).toEqual(["png", "jpg", "jpeg", "test"]);
    expect(option.rules).toEqual([{ test: /\.ts$/, loader: "ts-loader" }]);
    expect(option.compileTarget).toBe("es2015");
    expect(option.compileModule).toBe("es2020");
    expect(option.compileModuleResolution).toBe("bundler");
  });
});
