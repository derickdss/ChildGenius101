// In-memory stand-in for AsyncStorage so the storage logic runs in plain Node.
jest.mock("@react-native-async-storage/async-storage", () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (k) => (store.has(k) ? store.get(k) : null)),
      setItem: jest.fn(async (k, v) => {
        store.set(k, v);
      }),
      removeItem: jest.fn(async (k) => {
        store.delete(k);
      }),
    },
  };
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadStats, recordGame } from "../utils/storage";

const KEY = "childgenius.stats.v1";

describe("storage", () => {
  beforeEach(async () => {
    await AsyncStorage.removeItem(KEY);
  });

  test("loadStats returns empty stats when nothing is stored", async () => {
    const stats = await loadStats();
    expect(stats.totalGames).toBe(0);
    expect(stats.totalCorrect).toBe(0);
    expect(stats.bestPractice).toEqual({});
    expect(stats.bestChallenge).toEqual({});
  });

  test("recordGame increments totals and stores the first score as best", async () => {
    const res = await recordGame({ operation: "Addition", mode: "Practice", score: 5 });
    expect(res.isNewBest).toBe(true);
    expect(res.best).toBe(5);

    const stats = await loadStats();
    expect(stats.totalGames).toBe(1);
    expect(stats.totalCorrect).toBe(5);
    expect(stats.bestPractice.Addition).toBe(5);
  });

  test("recordGame updates best only when the new score is higher", async () => {
    await recordGame({ operation: "Addition", mode: "Practice", score: 5 });
    const lower = await recordGame({ operation: "Addition", mode: "Practice", score: 3 });
    expect(lower.isNewBest).toBe(false);
    expect(lower.best).toBe(5);

    const higher = await recordGame({ operation: "Addition", mode: "Practice", score: 8 });
    expect(higher.isNewBest).toBe(true);
    expect(higher.best).toBe(8);

    const stats = await loadStats();
    expect(stats.bestPractice.Addition).toBe(8);
    expect(stats.totalGames).toBe(3);
    expect(stats.totalCorrect).toBe(5 + 3 + 8);
  });

  test("Practice and Challenge bests are tracked separately", async () => {
    await recordGame({ operation: "Addition", mode: "Practice", score: 4 });
    await recordGame({ operation: "Addition", mode: "Challenge", score: 2 });
    const stats = await loadStats();
    expect(stats.bestPractice.Addition).toBe(4);
    expect(stats.bestChallenge.Addition).toBe(2);
  });
});