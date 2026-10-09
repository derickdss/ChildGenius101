import { generateEnglishQuestion } from "../data/englishQuestions";

const SKILLS = ["Phonics", "Sight Words", "Spelling", "Phonemes", "Syllables"];
const DISPLAY_KINDS = new Set(["letter", "word", "emoji", "letters", "blank"]);

describe("generateEnglishQuestion", () => {
  test.each(SKILLS)("%s: returns a well-formed question", (skill) => {
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
});