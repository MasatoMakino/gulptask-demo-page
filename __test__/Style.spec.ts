import { initOptions } from "../bin/Option.js";
import { getCopyTaskSet } from "../bin/Copy.js";
import { getStyleTask } from "../bin/Style.js";

import { isExistFile } from "./Util.js";

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
