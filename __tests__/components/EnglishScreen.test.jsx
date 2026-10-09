import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import EnglishScreen from "../../components/EnglishScreen";

// Deterministic question + stats so a full practice run is predictable.
// (The real generator is pure but random; mocking pins the correct option to index 0.)
jest.mock("../../data/englishQuestions", () => ({
  generateEnglishQuestion: () => ({
    prompt: "Which word starts with the letter A?",
    display: "A",
    displayKind: "letter",
    options: [
      { label: "Apple", emoji: "🍎" },
      { label: "Ball", emoji: "⚽" },
      { label: "Cat", emoji: "🐱" },
      { label: "Dog", emoji: "🐶" },
    ],
    correctIndex: 0,
  }),
}));

jest.mock("../../utils/storage", () => ({
  recordGame: () => Promise.resolve({ best: 10, isNewBest: true }),
}));

// Result (rendered by EnglishScreen on completion) calls useNavigation().
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const route = { params: { mode: "Practice" } };

describe("EnglishScreen (Phonics, Practice)", () => {
  test("shows the first question and its four options", async () => {
    await render(<EnglishScreen skill="Phonics" route={route} />);
    expect(screen.getByText("Question 1/10")).toBeTruthy();
    expect(screen.getByText("Which word starts with the letter A?")).toBeTruthy();
    expect(screen.getByText("Apple")).toBeTruthy();
    expect(screen.getByText("Dog")).toBeTruthy();
  });

  test("completing all ten questions shows the Result screen", async () => {
    await render(<EnglishScreen skill="Phonics" route={route} />);
    for (let i = 0; i < 10; i += 1) {
      // Press the correct answer; act() commits chosenIndex before Next.
      await act(async () => {
        fireEvent.press(screen.getByText("Apple"));
      });
      // Advance to the next question.
      await act(async () => {
        fireEvent.press(screen.getByRole("button", { name: "Next" }));
      });
    }
    // finishQuiz → recordGame().then(onQuizComplete) is async; flush it.
    await act(async () => {});
    expect(await screen.findByText("You Scored")).toBeTruthy();
    expect(screen.getByText(/New best score!/)).toBeTruthy();
  });
});
