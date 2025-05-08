import { vi, test, expect, type Mock, beforeEach, describe, it } from "vitest";
import { runCommand } from "../../src/runCommand.js";

// モック用のタスクオブジェクト
const mockTask = {
  watchDemo: vi.fn(),
  bundleDemo: vi.fn(),
};

// src/CLI.ts が import する ./index.js をモック
vi.mock("../../src/index.js", () => ({
  generateTasks: vi.fn(async () => mockTask),
}));

// // モック関数をインポート（必ず vi.mock の後）
import { generateTasks } from "../../src/index.js";
const mockGenerateTasks = generateTasks as Mock;

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("CLI Command Tests", () => {
  test("no-option の場合、generateTasks にデフォルトオプションが渡される", async () => {
    process.argv = ["node", "CLI.ts"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({});
  });

  it.fails(
    "存在しないオプションを渡されると、コード1で異常終了する",
    async () => {
      process.argv = ["node", "CLI.ts", "--notExistOpton"];
      await runCommand();
    },
  );

  test("--compileModuleResolutionが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--compileModuleResolution", "node"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];

    expect(calledArgs).toEqual({
      compileModuleResolution: "node",
    });
  });
});
