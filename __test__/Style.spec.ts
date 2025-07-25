import { afterAll, describe, expect, test } from "vitest";
import { getCopyTaskSet } from "../src/Copy.js";
import { initOptions } from "../src/Option.js";
import { getStyleTask } from "../src/Style.js";
import { isExistFile, removeDir } from "./Util.js";

const testDir = "./test_for_style";

describe("Style", () => {
  afterAll(async () => {
    await removeDir(testDir);
  });

  test("getStyleTask", () => {
    const styleTask = getStyleTask();
    expect(styleTask).toBeTruthy();
  });

  test("style", async () => {
    const option = initOptions({ distDir: testDir });
    getCopyTaskSet(option);

    const styleTask = getStyleTask();
    await styleTask();
    isExistFile(`${testDir}/styles.css`);
    isExistFile(`${testDir}/GitHub-Mark-Light-64px.png`);
  });
});
