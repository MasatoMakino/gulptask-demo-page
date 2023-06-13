import fs from "fs";
import path from "path";
import { getHTLMGenerator } from "../src/EJS";
import { initOptions } from "../src/Option";
import { getBundlerSet } from "../src/Bundler";

describe("EJS", () => {
  const generateDefaultTasks = () => {
    const option = initOptions(null);
    return getHTLMGenerator(option);
  };

  const isExistFile = (relativePath: string) => {
    const isExist = fs.existsSync(path.resolve(process.cwd(), relativePath));
    expect(isExist).toBeTruthy();
  };

  const spyLog = jest.spyOn(console, "log").mockImplementation(() => {});
  test("getHTLMGenerator", () => {
    const ejsTasks = generateDefaultTasks();
    expect(ejsTasks.generateHTML).toBeTruthy();
    expect(ejsTasks.watchHTML).toBeTruthy();
  });

  test("generateHTML", async () => {
    const option = initOptions(null);

    //ejsタスクはbundleタスクで生成されたjsファイルを元にhtmlを生成する。
    const bundleTasks = getBundlerSet(option);
    await bundleTasks.bundleDevelopment();

    const ejsTasks = getHTLMGenerator(option);
    await ejsTasks.generateHTML();

    isExistFile("./docs/demo/index.html");
    isExistFile("./docs/demo/demo.html");
    isExistFile("./docs/demo/demoTypeScript.html");
    isExistFile("./docs/demo/sub/demoSub.html");
  });

  test("watchHTML", async () => {
    const ejsTasks = generateDefaultTasks();
    const watcher = ejsTasks.watchHTML();
    await watcher.close();
  });
});
