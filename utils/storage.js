import AsyncStorage from "@react-native-async-storage/async-storage";

const STATS_KEY = "childgenius.stats.v1";

const EMPTY_STATS = {
  totalGames: 0,
  totalCorrect: 0,
  bestPractice: {},   // e.g. { Addition: 8, Division: 5 }
  bestChallenge: {},  // e.g. { Addition: 4, ... }
};

export async function loadStats() {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    if (!raw) return { ...EMPTY_STATS };
    const parsed = JSON.parse(raw);
    return { ...EMPTY_STATS, ...parsed };
  } catch (e) {
    return { ...EMPTY_STATS };
  }
}

// Records a finished game and returns the best-score info for this run.
export async function recordGame({ operation, mode, score }) {
  const stats = await loadStats();
  const key = mode === "Challenge" ? "bestChallenge" : "bestPractice";
  const previousBest = (stats[key] && stats[key][operation]) || 0;
  const isNewBest = score > previousBest;

  if (isNewBest) {
    stats[key] = { ...stats[key], [operation]: score };
  }
  stats.totalGames += 1;
  stats.totalCorrect += score;

  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    // storage failures should never break the game
  }
  return { best: Math.max(previousBest, score), isNewBest };
}
