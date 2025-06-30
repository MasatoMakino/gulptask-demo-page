import { beforeEach, describe, expect, it, vi } from "vitest";
// モック対象モジュールを名前付き import
import * as BundlerModule from "../src/Bundler.js";
import * as CleanModule from "../src/Clean.js";
import * as CopyModule from "../src/Copy.js";
import * as EJSModule from "../src/EJS.js";
import { generateTasks } from "../src/index";
import * as StyleModule from "../src/Style.js";

describe("generateTasks", () => {
  let mockBundlerSet: {
    bundleDevelopment;
    watchBundle;
  };
  let mockEJSTasks: EJSModule.EJSTasks;
  let mockCopyTasks: CopyModule.CopyTaskSet;
  let mockStyleTask;
  let mockCleanTask;

  beforeEach(() => {
    vi.restoreAllMocks();

    // spy 関数を用意
    mockBundlerSet = {
      bundleDevelopment: vi.fn().mockResolvedValue(undefined),
      watchBundle: vi.fn().mockResolvedValue(undefined),
    };
    mockEJSTasks = {
      generateHTML: vi.fn(),
      watchHTML: vi.fn(),
    };
    mockCopyTasks = {
      copy: vi.fn(),
      watchCopy: vi.fn(),
    };
    mockStyleTask = vi.fn();
    mockCleanTask = vi.fn();

    // spyOn で返り値を差し替え
    vi.spyOn(BundlerModule, "getBundlerSet").mockResolvedValue(mockBundlerSet);
    vi.spyOn(EJSModule, "getHTLMGenerator").mockReturnValue(mockEJSTasks);
    vi.spyOn(CopyModule, "getCopyTaskSet").mockReturnValue(mockCopyTasks);
    vi.spyOn(StyleModule, "getStyleTask").mockReturnValue(mockStyleTask);
    vi.spyOn(CleanModule, "getCleanTask").mockReturnValue(mockCleanTask);
  });

  it("should return an object with bundleDemo, cleanDemo, and watchDemo methods", async () => {
    const tasks = await generateTasks({});
    expect(tasks).toHaveProperty("bundleDemo");
    expect(tasks).toHaveProperty("cleanDemo");
    expect(tasks).toHaveProperty("watchDemo");
  });

  it("bundleDemo は sub-task をすべて呼び出す", async () => {
    const tasks = await generateTasks({});
    await tasks.bundleDemo();

    expect(mockBundlerSet.bundleDevelopment).toHaveBeenCalled();
    expect(mockEJSTasks.generateHTML).toHaveBeenCalled();
    expect(mockCopyTasks.copy).toHaveBeenCalled();
    expect(mockStyleTask).toHaveBeenCalled();
  });

  it("cleanDemo は sub-task をすべて呼び出す", async () => {
    const tasks = await generateTasks({});
    await tasks.cleanDemo();

    // Clean モジュールで提供されたタスクが呼び出されていることを検証
    expect(mockCleanTask).toHaveBeenCalled();
    expect(mockBundlerSet.bundleDevelopment).toHaveBeenCalled();
  });

  it("watchDemo は sub-task をすべて呼び出す", async () => {
    const tasks = await generateTasks({});
    tasks.watchDemo();

    expect(mockStyleTask).toHaveBeenCalled();
    expect(mockCopyTasks.copy).toHaveBeenCalled();
    expect(mockCopyTasks.watchCopy).toHaveBeenCalled();
    expect(mockBundlerSet.watchBundle).toHaveBeenCalled();
    expect(mockEJSTasks.watchHTML).toHaveBeenCalled();
  });
});
