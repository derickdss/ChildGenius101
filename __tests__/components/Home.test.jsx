import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import Home from "../../components/Home";

describe("Home screen", () => {
  test("shows both subject cards", async () => {
    await render(<Home navigation={{ navigate: jest.fn() }} />);
    expect(screen.getByText("Choose a subject!")).toBeTruthy();
    expect(screen.getByText("Math")).toBeTruthy();
    expect(screen.getByText("English")).toBeTruthy();
  });

  test("tapping a card navigates to that subject", async () => {
    const navigate = jest.fn();
    await render(<Home navigation={{ navigate }} />);
    fireEvent.press(screen.getByText("Math"));
    expect(navigate).toHaveBeenCalledWith("Math");
    fireEvent.press(screen.getByText("English"));
    expect(navigate).toHaveBeenCalledWith("English");
  });
});
