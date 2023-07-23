import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "\\.tsx?$": [
      "ts-jest",
      { tsconfig: "./__test__/tsconfig.json", useESM: true },
    ],
  },
};

export default jestConfig;
