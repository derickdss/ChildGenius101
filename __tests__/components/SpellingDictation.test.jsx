import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import SpellingDictation from "../../components/SpellingDictation";

// Deterministic question: word "cat", bank = c, a, t + 4 distractors.
jest.mock("../../data/englishQuestions", () => ({
  generateSpellingDictation: () => ({
    word: "cat",
    emoji: "🐱",
    bank: ["c", "a", "t", "x", "z", "k", "m"],
    difficulty: "easy",
  }),
}));

jest.mock("expo-speech", () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

jest.mock("../../utils/storage", () => ({
  recordGame: () => Promise.resolve({ best: 10, isNewBest: true }),
}));

// Tap the bank letters that make up "cat". Each press is wrapped in act()
// so React commits state (slots / bank update) before the next lookup.
const fillWord = async () => {
  for (const letter of ["C", "A", "T"]) {
    await act(async () => {
      fireEvent.press(screen.getByText(letter, { exact: true }));
    });
  }
};

describe("SpellingDictation (Practice)", () => {
  test("shows the prompt, picture hint and the full letter bank", async () => {
    await render(<SpellingDictation mode="Practice" onQuizComplete={jest.fn()} />);
    expect(screen.getByText("Listen and spell the word!")).toBeTruthy();
    expect(screen.getByText("🐱")).toBeTruthy();
    expect(screen.getByText("Question 1/10")).toBeTruthy();
    // 3 empty slots + 7 bank letters, all rendered.
    ["C", "A", "T", "X", "Z", "K", "M"].forEach((l) => {
      expect(screen.getByText(l, { exact: true })).toBeTruthy();
    });
  });

  test("completing all ten questions calls onQuizComplete with results and stats", async () => {
    const onQuizComplete = jest.fn();
    await render(<SpellingDictation mode="Practice" onQuizComplete={onQuizComplete} />);
    for (let i = 0; i < 10; i += 1) {
      await fillWord();
      await act(async () => {
        fireEvent.press(screen.getByRole("button", { name: "Check" }));
      });
      await act(async () => {
        fireEvent.press(screen.getByRole("button", { name: "Next" }));
      });
    }
    // finishQuiz → recordGame().then(onQuizComplete) is async; flush it.
    await act(async () => {});
    expect(onQuizComplete).toHaveBeenCalledTimes(1);
    const [results, stats] = onQuizComplete.mock.calls[0];
    expect(results).toHaveLength(10);
    expect(results.every((r) => r.answerCorrect)).toBe(true);
    expect(stats).toEqual({ best: 10, isNewBest: true });
  });
});
