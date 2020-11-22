module.exports = {
  testEnvironment: "node",
  verbose: true,
  roots: ["<rootDir>/src"],
  coverageDirectory: "<rootDir>/coverage",
  setupFiles: ["<rootDir>/jest.setup.js"],
  reporters: ["default"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ["**/*.test.js"],
  moduleFileExtensions: ["js"],
  setupFilesAfterEnv: ["jest-extended"],
};
