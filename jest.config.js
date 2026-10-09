// Unit-test config for the pure-logic layer (utils, data, question generators).
// We deliberately do NOT use the app's babel.config.js (which pulls in the
// react-native-reanimated plugin); tests only need ESM + JSX transpilation.
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  testMatch: ["**/*.test.js"],
  transform: {
    "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./babel.jest.config.js" }],
  },
  transformIgnorePatterns: ["/node_modules/"],
  collectCoverageFrom: [
    "utils/**/*.{js,jsx}",
    "data/**/*.js",
    "components/Answers.js",
  ],
};
