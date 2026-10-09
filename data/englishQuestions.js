// Question generators for the English skills.
//
// Every generator returns the same shape so one quiz engine can drive all
// five skills:
//   {
//     prompt:      string,   // instruction line
//     display:     string,   // big thing to show (letter / word / emoji / blank)
//     displayKind: "letter" | "word" | "emoji" | "letters" | "blank",
//     options:     [{ label, emoji? } x4],  // already shuffled
//     correctIndex: number,
//   }

import { LETTER_WORDS, CVC_WORDS } from "./phonics";
import { SIGHT_WORD_PICTURES, SIGHT_WORD_SENTENCES } from "./sightWords";
import { SPELLING_EASY_WORDS, SPELLING_HARD_WORDS } from "./spelling";
import { PHONEME_WORDS } from "./phonemes";
import SYLLABLES from "./syllables";

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build 4 unique options around a correct one. `correct` and each element of
// `pool` are option objects { label, emoji? }. Returns { options, correctIndex }.
function buildOptions(correct, pool) {
  const seen = new Set([correct.label]);
  const others = [];
  for (const cand of shuffle(pool)) {
    if (seen.has(cand.label)) continue;
    seen.add(cand.label);
    others.push(cand);
    if (others.length === 3) break;
  }
  const options = shuffle([correct, ...others]);
  return { options, correctIndex: options.findIndex((o) => o.label === correct.label) };
}

// ---- PHONICS ---------------------------------------------------------------
function phonicsQuestion() {
  if (Math.random() < 0.5) {
    // Letter sounds: show a letter, pick the word that starts with it.
    const entry = pick(LETTER_WORDS);
    const letter = entry.letter;
    const correct = { label: entry.word, emoji: entry.emoji };
    const pool = LETTER_WORDS.filter((w) => w.letter !== letter).map((w) => ({ label: w.word, emoji: w.emoji }));
    const { options, correctIndex } = buildOptions(correct, pool);
    return {
      prompt: `Which word starts with the letter ${letter}?`,
      display: letter,
      displayKind: "letter",
      options,
      correctIndex,
    };
  }
  // CVC: show the three letters, pick the matching word.
  const entry = pick(CVC_WORDS);
  const correct = { label: entry.word, emoji: entry.emoji };
  const pool = CVC_WORDS.filter((w) => w.word !== entry.word).map((w) => ({ label: w.word, emoji: w.emoji }));
  const { options, correctIndex } = buildOptions(correct, pool);
  return {
    prompt: "What word do these letters make?",
    display: entry.word.toUpperCase().split("").join("  "),
    displayKind: "letters",
    options,
    correctIndex,
  };
}

// ---- SIGHT WORDS -----------------------------------------------------------
function sightWordsQuestion() {
  // Type 1: fill the blank in a sentence.
  if (Math.random() < 0.5) {
    const s = pick(SIGHT_WORD_SENTENCES);
    const options = shuffle(s.options).map((w) => ({ label: w }));
    return {
      prompt: "Pick the word that fits the sentence.",
      display: s.sentence,
      displayKind: "blank",
      options,
      correctIndex: options.findIndex((o) => o.label === s.blank),
    };
  }
  // Type 2: show a sight word, pick the matching picture.
  const entry = pick(SIGHT_WORD_PICTURES);
  const correct = { label: entry.emoji };
  const pool = SIGHT_WORD_PICTURES.filter((w) => w.word !== entry.word).map((w) => ({ label: w.emoji }));
  const { options, correctIndex } = buildOptions(correct, pool);
  return {
    prompt: "Pick the picture that matches the word.",
    display: entry.word,
    displayKind: "word",
    options,
    correctIndex,
  };
}

// ---- SPELLING (dictation) --------------------------------------------------
// The kid hears a word and builds it by tapping letters from the bank.
// Practice uses short words (3-4 letters), Challenge uses longer, trickier
// words (5-8 letters). This skill has its own question shape because it is
// not multiple choice - see components/SpellingDictation.jsx.
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export function generateSpellingDictation(mode) {
  const hard = mode === "Challenge";
  const pool = hard ? SPELLING_HARD_WORDS : SPELLING_EASY_WORDS;
  const entry = pick(pool);
  const wordLetters = entry.word.split("");
  const distractorCount = hard ? 6 : 4;
  const distractors = Array.from({ length: distractorCount }, () => pick(ALPHABET));
  return {
    word: entry.word,
    emoji: entry.emoji,
    bank: shuffle([...wordLetters, ...distractors]),
    difficulty: hard ? "hard" : "easy",
  };
}

// ---- PHONEMES --------------------------------------------------------------
function phonemesQuestion() {
  if (Math.random() < 0.5) {
    // Count phonemes: "How many sounds in ___?"
    const w = pick(PHONEME_WORDS);
    const correct = { label: String(w.sounds) };
    const pool = [2, 3, 4, 5].filter((n) => n !== w.sounds).map((n) => ({ label: String(n) }));
    const { options, correctIndex } = buildOptions(correct, pool);
    return {
      prompt: "How many sounds are in the word?",
      display: w.word,
      displayKind: "word",
      options,
      correctIndex,
    };
  }
  // Find the match: "Which word has N sounds?"
  const target = pick(PHONEME_WORDS).sounds;
  const candidates = PHONEME_WORDS.filter((w) => w.sounds === target);
  const correct = pick(candidates);
  const pool = PHONEME_WORDS.filter((w) => w.sounds !== target).map((w) => ({ label: w.word, emoji: w.emoji }));
  const { options, correctIndex } = buildOptions({ label: correct.word, emoji: correct.emoji }, pool);
  return {
    prompt: `Which word has ${target} sounds?`,
    display: String(target),
    displayKind: "word",
    options,
    correctIndex,
  };
}

// ---- SYLLABLES -------------------------------------------------------------
function syllablesQuestion() {
  const roll = Math.random();
  if (roll < 0.4) {
    // Count syllables: "How many syllables in ___?"
    const w = pick(SYLLABLES);
    const correct = { label: String(w.count) };
    const pool = [1, 2, 3, 4].filter((n) => n !== w.count).map((n) => ({ label: String(n) }));
    const { options, correctIndex } = buildOptions(correct, pool);
    return {
      prompt: "How many syllables are in the word?",
      display: w.word,
      displayKind: "word",
      options,
      correctIndex,
    };
  } else if (roll < 0.7) {
    // Find the match: "Which word has N syllables?"
    const target = pick([1, 2, 3, 4]);
    const candidates = SYLLABLES.filter((w) => w.count === target);
    const correct = pick(candidates);
    const pool = SYLLABLES.filter((w) => w.count !== target).map((w) => ({ label: w.word, emoji: w.emoji }));
    const { options, correctIndex } = buildOptions({ label: correct.word, emoji: correct.emoji }, pool);
    return {
      prompt: `Which word has ${target} ${target === 1 ? "syllable" : "syllables"}?`,
      display: String(target),
      displayKind: "word",
      options,
      correctIndex,
    };
  }
  // Split the word: "How do you split ___?"
  const w = pick(SYLLABLES.filter((s) => s.count > 1));
  const correct = { label: w.split };
  const others = SYLLABLES.filter((s) => s.split !== w.split && s.count === w.count).map((s) => ({ label: s.split }));
  const { options, correctIndex } = buildOptions(correct, others.length ? others : SYLLABLES.filter((s) => s.split !== w.split).map((s) => ({ label: s.split })));
  return {
    prompt: "How do you split the word into syllables?",
    display: w.word,
    displayKind: "word",
    options,
    correctIndex,
  };
}

const GENERATORS = {
  Phonics: phonicsQuestion,
  "Sight Words": sightWordsQuestion,
  Phonemes: phonemesQuestion,
  Syllables: syllablesQuestion,
};

export function generateEnglishQuestion(skill) {
  if (skill === "Spelling") {
    throw new Error('Spelling is a dictation game - use generateSpellingDictation(mode) instead.');
  }
  const gen = GENERATORS[skill] || phonicsQuestion;
  return gen();
}

export default GENERATORS;
