import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "nodeTest",
    environment: "node",
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
    },
  },
});
