import { expect, test, vi } from "vitest";

test("CLI does not execute watch when --watch option is not provided", async () => {
  const mockConsoleLog = vi.spyOn(console, "log");
  process.argv = ["node", "CLI.ts"];
  const { runCLI } = await import("../src/CLI.js");
  await runCLI();

  expect(mockConsoleLog).not.toHaveBeenCalledWith(
    expect.stringContaining("'gulptask-demo-page' Starting to watch files ..."),
  );
  vi.resetAllMocks();
}, 10_000);
