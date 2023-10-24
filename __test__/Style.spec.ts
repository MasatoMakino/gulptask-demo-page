import { initOptions } from "../src/Option.js";
import { getCopyTaskSet } from "../src/Copy.js";
import { getStyleTask } from "../src/Style.js";
import { isExistFile } from "./Util.js";
import { describe, test, expect } from "vitest";

describe("Style", () => {
  test("getStyleTask", () => {
    const styleTask = getStyleTask();
    expect(styleTask).toBeTruthy();
  });

  test("style", async () => {
    const option = initOptions(undefined);
    getCopyTaskSet(option);

    const styleTask = getStyleTask();
    await styleTask();
    isExistFile("./docs/demo/styles.css");
    isExistFile("./docs/demo/GitHub-Mark-Light-64px.png");
  });
});
