
export default {
  clearMocks: true,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "\\.tsx?$": ["ts-jest", { tsconfig: "./__test__/tsconfig.json" }],
  },
};
