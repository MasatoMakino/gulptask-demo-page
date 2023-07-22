import { initOptions } from "../src/Option";
import { getCopyTaskSet } from "../src/Copy";
import { getStyleTask } from "../src/Style";

import { isExistFile } from "./Util";

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
