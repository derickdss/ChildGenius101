import { generateEnglishQuestion, generateSpellingDictation } from "../data/englishQuestions";

const MCQ_SKILLS = ["Phonics", "Sight Words", "Phonemes", "Syllables"];
const DISPLAY_KINDS = new Set(["letter", "word", "emoji", "letters", "blank"]);

describe("generateEnglishQuestion", () => {
  test.each(MCQ_SKILLS)("%s: returns a well-formed question", (skill) => {
    for (let i = 0; i < 200; i++) {
      const q = generateEnglishQuestion(skill);
      expect(typeof q.prompt).toBe("string");
      expect(q.prompt.length).toBeGreaterThan(0);
      expect(typeof q.display).toBe("string");
      expect(q.display.length).toBeGreaterThan(0);
      expect(DISPLAY_KINDS.has(q.displayKind)).toBe(true);
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(Number.isInteger(q.correctIndex)).toBe(true);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(typeof q.options[q.correctIndex].label).toBe("string");
      expect(q.options[q.correctIndex].label.length).toBeGreaterThan(0);
    }
  });

  test("an unknown skill falls back to a valid question", () => {
    const q = generateEnglishQuestion("Nonsense");
    expect(Array.isArray(q.options)).toBe(true);
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctIndex).toBeLessThan(q.options.length);
  });

  test("Spelling is not a multiple-choice skill", () => {
    expect(() => generateEnglishQuestion("Spelling")).toThrow();
  });
});

// True if the bank contains every letter of the word (multiset check).
const bankCoversWord = (bank, word) => {
  const counts = {};
  bank.forEach((l) => (counts[l] = (counts[l] || 0) + 1));
  return word.split("").every((l) => (counts[l] = counts[l] - 1) >= 0);
};

describe("generateSpellingDictation", () => {
  test("easy mode: short words, 4 distractors, bank covers the word", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateSpellingDictation("Practice");
      expect(q.word).toBe(q.word.toLowerCase());
      expect(q.word.length).toBeGreaterThanOrEqual(3);
      expect(q.word.length).toBeLessThanOrEqual(4);
      expect(q.difficulty).toBe("easy");
      expect(q.bank.length).toBe(q.word.length + 4);
      // Every letter of the word must be present in the bank.
      expect(bankCoversWord(q.bank, q.word)).toBe(true);
    }
  });

  test("challenge mode: longer words, 6 distractors", () => {
    for (let i = 0; i < 100; i++) {
      const q = generateSpellingDictation("Challenge");
      expect(q.word.length).toBeGreaterThanOrEqual(5);
      expect(q.difficulty).toBe("hard");
      expect(q.bank.length).toBe(q.word.length + 6);
      expect(bankCoversWord(q.bank, q.word)).toBe(true);
    }
  });
});