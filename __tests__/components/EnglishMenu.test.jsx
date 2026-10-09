import React from "react";
import { render, screen } from "@testing-library/react-native";
import EnglishMenu from "../../components/EnglishMenu";

jest.mock("../../utils/storage", () => ({
  loadStats: () =>
    Promise.resolve({
      totalGames: 1,
      totalCorrect: 1,
      bestPractice: {},
      bestChallenge: {},
    }),
}));

describe("EnglishMenu screen", () => {
  test("lists all five English skills once stats load", async () => {
    await render(<EnglishMenu navigation={{ navigate: jest.fn() }} />);
    expect(await screen.findByText("Phonics")).toBeTruthy();
    expect(screen.getByText("Sight Words")).toBeTruthy();
    expect(screen.getByText("Spelling")).toBeTruthy();
    expect(screen.getByText("Phonemes")).toBeTruthy();
    expect(screen.getByText("Syllables")).toBeTruthy();
  });
});
