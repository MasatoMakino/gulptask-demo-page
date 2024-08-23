import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "nodeTest",
    environment: "node",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
    },
  },
});
