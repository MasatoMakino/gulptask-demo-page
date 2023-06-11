import { Option, initOptions } from "../src/Option";

describe("Option", () => {
  test("initOptions", () => {
    const option = initOptions(null);
    expect(option).toBeTruthy();
  });
});
