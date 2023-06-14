import { initOptions } from "../src/Option";
import { getCopyTaskSet } from "../src/Copy";
import { getStyleTask } from "../src/Style";
import path from "path";
import fs from "fs";

describe("Style", () => {
  test("getStyleTask", () => {
    const styleTask = getStyleTask();
    expect(styleTask).toBeTruthy();
  });

  test("style", async () => {
    const option = initOptions(null);
    getCopyTaskSet(option);

    const styleTask = getStyleTask();
    await styleTask();
    const file = fs.readFileSync(
      path.resolve(process.cwd(), "./docs/demo/styles.css")
    );
    expect(file).toBeTruthy();

    const gitHubIcon = fs.readFileSync(
      path.resolve(process.cwd(), "./docs/demo/GitHub-Mark-Light-64px.png")
    );
    expect(gitHubIcon).toBeTruthy();
  });
});
