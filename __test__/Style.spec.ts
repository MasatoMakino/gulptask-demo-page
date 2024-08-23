import { initOptions } from "../src/Option.js";
import { getCopyTaskSet } from "../src/Copy.js";
import { getStyleTask } from "../src/Style.js";
import { isExistFile } from "./Util.js";
import { describe, test, expect } from "vitest";

const testDir = "./test_for_style";

describe("Style", () => {
  test("getStyleTask", () => {
    const styleTask = getStyleTask();
    expect(styleTask).toBeTruthy();
  });

  test("style", async () => {
    const option = initOptions({ distDir: testDir });
    getCopyTaskSet(option);

    const styleTask = getStyleTask();
    await styleTask();
    isExistFile(testDir + "/styles.css");
    isExistFile(testDir + "/GitHub-Mark-Light-64px.png");
  });
});
