import fs from "fs";
import path from "path";
import { getBundlerSet } from "../src/Bundler";
import { initOptions } from "../src/Option";
import { getCleanTask } from "../src/Clean";
import { isExistFile } from "./Util";
describe("Clean", () => {
  const spyLog = jest.spyOn(console, "log").mockImplementation(() => {});

  const isNotExistFile = (relativePath: string) => {
    const isExist = fs.existsSync(path.resolve(process.cwd(), relativePath));
    expect(isExist).toBeFalsy();
  };

  test("clean", async () => {
    const option = initOptions({ distDir: "./cleanTest" });

    const bundler = getBundlerSet(option);
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
