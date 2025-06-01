import { describe, it, expect } from "vitest";
import fs from "fs";
import vm from "vm";
import path from "path";

// Read the script file content
const scriptPath = path.resolve(__dirname, "../template/indexScript.js");
const scriptContent = fs.readFileSync(scriptPath, "utf-8");

// Create a new context and run the script
const context = {
  // Define any necessary global variables or objects that the script might depend on
  // For this script, it seems to only depend on standard JS features
};
vm.createContext(context);
vm.runInContext(scriptContent, context);

// Access the globally defined function from the context
const { getDemoNameFromPath } = context;

describe("getDemoNameFromPath", () => {
  it("should extract the demo name from a valid path", () => {
    const path = "demo/demoTypeScript.html";
    expect(getDemoNameFromPath(path)).toBe("demoTypeScript");
  });

  it("should return null for an invalid path", () => {
    const path = "invalid/path/to/file.txt";
    expect(getDemoNameFromPath(path)).toBeNull();
  });

  it("should return null for an empty path", () => {
    const path = "";
    expect(getDemoNameFromPath(path)).toBeNull();
  });

  it("should handle paths without directories", () => {
    const path = "demoOnly.html";
    expect(getDemoNameFromPath(path)).toBe("demoOnly");
  });

  it("should handle paths with multiple dots in the filename", () => {
    const path = "demo/my.test.demo.html";
    expect(getDemoNameFromPath(path)).toBe("my.test.demo");
  });
});
