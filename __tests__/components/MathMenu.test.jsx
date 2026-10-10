import React from "react";
import { render, screen } from "@testing-library/react-native";
import MathMenu from "../../components/MathMenu";

// MathMenu reads stats asynchronously in a useEffect; mock storage so the
// operation list renders deterministically instead of a spinner.
jest.mock("../../utils/storage", () => ({
  loadStats: () =>
    Promise.resolve({
      totalGames: 3,
      totalCorrect: 10,
      bestPractice: { Addition: 2 },
      bestChallenge: {},
    }),
}));

describe("MathMenu screen", () => {
  test("lists all five operations once stats load", async () => {
    await render(<MathMenu navigation={{ navigate: jest.fn() }} />);
    expect(await screen.findByText("Addition")).toBeTruthy();
    expect(screen.getByText("Subtraction")).toBeTruthy();
    expect(screen.getByText("Multiplication")).toBeTruthy();
    expect(screen.getByText("Division")).toBeTruthy();
    expect(screen.getByText("Decimal")).toBeTruthy();
    expect(screen.getByText(/Games played: 3/)).toBeTruthy();
  });
});
