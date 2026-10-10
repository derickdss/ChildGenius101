import getRandomInt, { getRandomFloat } from "../utils/getRandomInt";
import shuffleArray from "../utils/shuffleArray";

describe("getRandomInt", () => {
  test("returns an integer within [min, max]", () => {
    for (let i = 0; i < 500; i++) {
      const n = getRandomInt(1, 10);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  test("min === max always returns that value", () => {
    for (let i = 0; i < 50; i++) {
      expect(getRandomInt(7, 7)).toBe(7);
    }
  });

  test("rounds floating-point bounds outward (ceil min, floor max)", () => {
    for (let i = 0; i < 200; i++) {
      const n = getRandomInt(1.2, 5.9);
      expect(n).toBeGreaterThanOrEqual(2); // ceil(1.2)
      expect(n).toBeLessThanOrEqual(5); // floor(5.9)
    }
  });
});

describe("getRandomFloat", () => {
  test("returns a string in the range (0, 1)", () => {
    for (let i = 0; i < 200; i++) {
      const s = getRandomFloat();
      expect(typeof s).toBe("string");
      expect(s.startsWith("0.")).toBe(true);
      const n = parseFloat(s);
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThan(1);
    }
  });
});

describe("shuffleArray", () => {
  const sample = () => [1, 2, 3, 4, 5, 6, 7, 8];

  test("returns the same array instance (mutates in place)", () => {
    const arr = sample();
    expect(shuffleArray(arr)).toBe(arr);
  });

  test("preserves length and the multiset of elements", () => {
    const original = sample();
    const shuffled = shuffleArray(sample());
    expect(shuffled).toHaveLength(original.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(
      [...original].sort((a, b) => a - b)
    );
  });

  test("actually reorders the array over repeated shuffles", () => {
    let changed = false;
    for (let i = 0; i < 20; i++) {
      const arr = sample();
      shuffleArray(arr);
      if (arr.some((v, idx) => v !== idx + 1)) {
        changed = true;
        break;
      }
    }
    expect(changed).toBe(true);
  });
});