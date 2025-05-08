import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateTasks } from "../src/index";

describe("generateTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return an object with bundleDemo, cleanDemo, and watchDemo methods", async () => {
    const tasks = await generateTasks({});
    expect(tasks).toHaveProperty("bundleDemo");
    expect(tasks).toHaveProperty("cleanDemo");
    expect(tasks).toHaveProperty("watchDemo");
  });
});
