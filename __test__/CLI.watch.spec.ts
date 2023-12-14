import { expect, test, vi } from "vitest";

test("CLI correctly executes watch when --watch option is provided", async () => {
  const mockConsoleLog = vi.spyOn(console, "log");
  process.argv = ["node", "CLI.ts", "--watch"];
  const { runCLI } = await import("../src/CLI.js");
  await runCLI();

  expect(mockConsoleLog).toHaveBeenCalledWith(
    expect.stringContaining("'gulptask-demo-page' Starting to watch files ..."),
  );
  vi.resetAllMocks();
});
