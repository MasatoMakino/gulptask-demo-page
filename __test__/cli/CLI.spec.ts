import { expect, test, vi } from "vitest";

// モック用のタスクオブジェクト
const mockTask = {
  watchDemo: vi.fn(),
  bundleDemo: vi.fn(),
};

// src/CLI.ts が import する ./index.js をモック
vi.mock("../../src/index.js", () => ({
  generateTasks: vi.fn(async () => mockTask),
}));

test("CLI --watch で watchDemo が呼ばれる", async () => {
  process.argv = ["node", "CLI.ts", "--watch"];
  await import("../../src/CLI.js");

  expect(mockTask.watchDemo).toHaveBeenCalled();
});
