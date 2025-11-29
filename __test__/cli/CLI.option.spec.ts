import { beforeEach, describe, expect, it, type Mock, test, vi } from "vitest";
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
  vi.clearAllMocks();
});

describe("CLI Command Tests", () => {
  test("no-option の場合、generateTasks にデフォルトオプションが渡される", async () => {
    process.argv = ["node", "CLI.ts"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({});
  });

  it.fails("存在しないオプションを渡されると、コード1で異常終了する", async () => {
    process.argv = ["node", "CLI.ts", "--notExistOpton"];
    await runCommand();
  });

  test("srcDirが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--srcDir", "testSrc"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      srcDir: "testSrc",
    });
  });

  test("distDirが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--distDir", "testDist"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      distDir: "testDist",
    });
  });
  test("bodyが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--body", "testBody"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      body: "testBody",
    });
  });

  test("styleが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--style", "testStyle"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      style: "testStyle",
    });
  });

  test("copyTargetsが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--copyTargets", "png", "jpg", "jpeg"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      copyTargets: ["png", "jpg", "jpeg"],
    });
  });

  test("externalScriptsが渡される", async () => {
    process.argv = [
      "node",
      "CLI.ts",
      "--externalScripts",
      "https://code.createjs.com/1.0.0/createjs.min.js",
    ];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      externalScripts: ["https://code.createjs.com/1.0.0/createjs.min.js"],
    });
  });

  test("prefixが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--prefix", "testPrefix"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      prefix: "testPrefix",
    });
  });

  test("ruleが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--rule", "./rule.js"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      rule: "./rule.js",
      rules: [
        {
          test: /\.(vert|frag|glsl)$/,
          use: [
            {
              loader: "webpack-glsl-loader",
            },
          ],
        },
      ],
    });
  });

  test("--compileTargetが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--compileTarget", "es5"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      compileTarget: "es5",
    });
  });

  test("--compileModuleが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--compileModule", "es2020"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];
    expect(calledArgs).toEqual({
      compileModule: "es2020",
    });
  });

  test("--compileModuleResolutionが渡される", async () => {
    process.argv = ["node", "CLI.ts", "--compileModuleResolution", "node"];
    await runCommand();
    const calledArgs = mockGenerateTasks.mock.calls[0][0];

    expect(calledArgs).toEqual({
      compileModuleResolution: "node",
    });
  });
});
