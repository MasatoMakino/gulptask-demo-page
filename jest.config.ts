export default {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
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
