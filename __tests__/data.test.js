import { LETTER_WORDS, CVC_WORDS } from "../data/phonics";
import { SIGHT_WORD_SENTENCES, SIGHT_WORD_PICTURES } from "../data/sightWords";
import { SPELLING_WORDS } from "../data/spelling";
import { PHONEME_WORDS } from "../data/phonemes";
import SYLLABLES, { SYLLABLE_COUNTS } from "../data/syllables";

describe("phonics data", () => {
  test("LETTER_WORDS: each has a single uppercase letter + word + emoji", () => {
    expect(LETTER_WORDS.length).toBeGreaterThan(0);
    LETTER_WORDS.forEach((e) => {
      expect(e.letter).toMatch(/^[A-Z]$/);
      expect(e.word.trim().length).toBeGreaterThan(0);
      expect(typeof e.emoji).toBe("string");
    });
  });

  test("CVC_WORDS: each has a non-empty word", () => {
    expect(CVC_WORDS.length).toBeGreaterThan(0);
    CVC_WORDS.forEach((e) => {
      expect(e.word.trim().length).toBeGreaterThan(0);
    });
  });
});

describe("sight words data", () => {
  test("each sentence has a blank marker and its blank appears in the options", () => {
    expect(SIGHT_WORD_SENTENCES.length).toBeGreaterThan(0);
    SIGHT_WORD_SENTENCES.forEach((s) => {
      expect(s.sentence).toContain("___");
      expect(Array.isArray(s.options)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(2);
      expect(s.options).toContain(s.blank);
    });
  });

  test("SIGHT_WORD_PICTURES: each has a word + emoji", () => {
    expect(SIGHT_WORD_PICTURES.length).toBeGreaterThan(0);
    SIGHT_WORD_PICTURES.forEach((e) => {
      expect(e.word.trim().length).toBeGreaterThan(0);
      expect(typeof e.emoji).toBe("string");
    });
  });
});

describe("spelling data", () => {
  test("each entry has a non-empty word", () => {
    expect(SPELLING_WORDS.length).toBeGreaterThan(0);
    SPELLING_WORDS.forEach((e) => {
      expect(e.word.trim().length).toBeGreaterThan(0);
    });
  });
});

describe("phonemes data", () => {
  test("each word has a positive integer sound count", () => {
    expect(PHONEME_WORDS.length).toBeGreaterThan(0);
    PHONEME_WORDS.forEach((e) => {
      expect(e.word.trim().length).toBeGreaterThan(0);
      expect(Number.isInteger(e.sounds)).toBe(true);
      expect(e.sounds).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("syllables data", () => {
  test("each word has a positive integer count and a string split", () => {
    expect(SYLLABLES.length).toBeGreaterThan(0);
    SYLLABLES.forEach((e) => {
      expect(e.word.trim().length).toBeGreaterThan(0);
      expect(Number.isInteger(e.count)).toBe(true);
      expect(e.count).toBeGreaterThanOrEqual(1);
      expect(typeof e.split).toBe("string");
    });
  });

  test("SYLLABLE_COUNTS is the sorted set of counts actually in use", () => {
    const counts = [...new Set(SYLLABLES.map((s) => s.count))].sort((a, b) => a - b);
    expect([...SYLLABLE_COUNTS].sort((a, b) => a - b)).toEqual(counts);
  });
});