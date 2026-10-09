// Screen-level (component) tests using React Native Testing Library.
// Kept separate from jest.config.js (pure-logic, node env) because rendering
// React Native components needs the jest-expo preset/environment.
module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>/__tests__/components"],
  testMatch: ["**/*.test.jsx"],
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
