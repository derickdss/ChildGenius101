// Runs after the test framework is installed (see setupFilesAfterEnv in
// jest.config.component.js). Ensures the React tree is torn down between
// component tests so queries never match a leftover render from a prior test.
import { cleanup } from "@testing-library/react-native";
import { afterEach } from "@jest/globals";

afterEach(() => {
  cleanup();
});
