import { getHTLMGenerator } from "../src/EJS";
import { initOptions } from "../src/Option";
import { getBundlerSet } from "../src/Bundler";
import { isExistFile } from "./Util";

describe("EJS", () => {
  const generateDefaultTasks = () => {
    const option = initOptions(undefined);
    return getHTLMGenerator(option);
  };

  const spyLog = jest.spyOn(console, "log").mockImplementation(() => {});
  test("getHTLMGenerator", () => {
    const ejsTasks = generateDefaultTasks();
    expect(ejsTasks.generateHTML).toBeTruthy();
    expect(ejsTasks.watchHTML).toBeTruthy();
  });

  test("generateHTML", async () => {
    const option = initOptions(undefined);

    //ejsタスクはbundleタスクで生成されたjsファイルを元にhtmlを生成する。
    const bundleTasks = getBundlerSet(option);
    await bundleTasks.bundleDevelopment();

    const ejsTasks = getHTLMGenerator(option);
    await ejsTasks.generateHTML();

    isExistFile("./docs/demo/index.html");
    isExistFile("./docs/demo/demo.html");
    isExistFile("./docs/demo/demoTypeScript.html");
    isExistFile("./docs/demo/sub/demoSub.html");
  }, 10000);

  test("watchHTML", async () => {
    const ejsTasks = generateDefaultTasks();
    const watcher = ejsTasks.watchHTML();
    await watcher.close();
  });
});
