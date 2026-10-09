import React, { useState, useEffect, useRef, useCallback } from "react";
import { StatusBar, Text, View, Button, Animated, TouchableOpacity } from "react-native";
import { Vibration } from "react-native";
import * as Speech from "expo-speech";
import { generateSpellingDictation } from "../data/englishQuestions";
import { recordGame } from "../utils/storage";
import StopWatch from "./StopWatch";

const QUESTION_COUNT = 10;
const CHALLENGE_SECONDS = 60;
const FLASH_MS = 700;

// Dictation spelling game.
// Practice: the word is spoken, the kid taps letters from the bank to fill the
//          slots, then taps "Check" for feedback and "Next" to continue.
//          Short words (3-4 letters) + a picture hint.
// Challenge: same, but the word auto-checks the moment the last letter is
//          placed, with a 60-second timer. Longer, trickier words (5-8 letters).
export default function SpellingDictation({ mode, onQuizComplete }) {
  const [question, setQuestion] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bank, setBank] = useState([]);
  const [checked, setChecked] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState();
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [flash, setFlash] = useState(null);
  const resultsRef = useRef([]);
  const advancingRef = useRef(false);
  const idRef = useRef(0);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const flashAnimationRef = useRef(null);

  const vibrate = (pattern) => {
    try {
      const p = Vibration.vibrate(pattern);
      if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  };

  const speak = useCallback((word) => {
    try {
      Speech.speak(word, { language: "en-US" });
    } catch (e) {}
  }, []);

  const loadQuestion = useCallback((q) => {
    setQuestion(q);
    setSlots(Array(q.word.length).fill(null));
    setBank(q.bank.map((letter) => ({ id: ++idRef.current, letter })));
    setChecked(false);
    setAnswerCorrect(undefined);
    speak(q.word);
  }, [speak]);

  useEffect(() => {
    loadQuestion(generateSpellingDictation(mode));
    return () => {
      if (flashAnimationRef.current) flashAnimationRef.current.stop();
      try { Speech.stop(); } catch (e) {}
    };
  }, [mode]);

  const showFlash = (correct) => {
    setFlash({ correct });
    flashAnim.setValue(0);
    if (flashAnimationRef.current) flashAnimationRef.current.stop();
    flashAnimationRef.current = Animated.timing(flashAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setFlash(null), FLASH_MS);
    });
  };

  const enteredWord = () => slots.join("");

  const buildResult = (correct) => ({
    key: `Spelling_${resultsRef.current.length}`,
    question: `Spell the word: ${question.word}`,
    answerInput: enteredWord(),
    correctAnswer: question.word,
    answerCorrect: correct,
  });

  const finishQuiz = () => {
    if (finished) return;
    setFinished(true);
    const finalResults = resultsRef.current;
    const score = finalResults.filter((r) => r.answerCorrect).length;
    recordGame({ operation: "Spelling", mode, score })
      .then((info) => onQuizComplete(finalResults, info))
      .catch(() => onQuizComplete(finalResults, null));
  };

  // Place a bank letter into the first empty slot.
  const placeLetter = (id) => {
    if (checked || advancingRef.current || finished) return;
    const firstEmpty = slots.indexOf(null);
    if (firstEmpty === -1) return;
    const item = bank.find((b) => b.id === id);
    if (!item) return;
    const nextSlots = slots.slice();
    nextSlots[firstEmpty] = item.letter;
    const nextBank = bank.filter((b) => b.id !== id);
    setSlots(nextSlots);
    setBank(nextBank);
    maybeAutoCheck(nextSlots, nextBank);
  };

  // Return a placed letter to the bank.
  const returnLetter = (slotIndex) => {
    if (checked || advancingRef.current || finished) return;
    const letter = slots[slotIndex];
    if (!letter) return;
    const nextSlots = slots.slice();
    nextSlots[slotIndex] = null;
    setSlots(nextSlots);
    setBank([...bank, { id: ++idRef.current, letter }]);
  };

  // Challenge mode: the moment every slot is filled, check and advance.
  const maybeAutoCheck = (nextSlots, nextBank) => {
    if (mode !== "Challenge") return;
    if (nextBank.length !== 0) return;
    const correct = nextSlots.join("") === question.word;
    const recorded = {
      key: `Spelling_${resultsRef.current.length}`,
      question: `Spell the word: ${question.word}`,
      answerInput: nextSlots.join(""),
      correctAnswer: question.word,
      answerCorrect: correct,
    };
    resultsRef.current = [...resultsRef.current, recorded];
    if (correct) {
      setCorrectCount((c) => c + 1);
      setCurrentStreak((s) => s + 1);
      vibrate(40);
    } else {
      setWrongCount((c) => c + 1);
      setCurrentStreak(0);
      vibrate([0, 120]);
    }
    showFlash(correct);
    if (resultsRef.current.length >= QUESTION_COUNT) {
      finishQuiz();
      return;
    }
    setQuestionNumber((n) => n + 1);
    loadQuestion(generateSpellingDictation(mode));
  };

  // Practice mode: the kid taps "Check".
  const handleCheck = () => {
    if (checked || slots.includes(null)) return;
    const correct = enteredWord() === question.word;
    setChecked(true);
    setAnswerCorrect(correct);
    if (correct) {
      setCorrectCount((c) => c + 1);
      setCurrentStreak((s) => s + 1);
      vibrate(40);
    } else {
      setWrongCount((c) => c + 1);
      setCurrentStreak(0);
      vibrate([0, 120]);
    }
  };

  const handleNext = () => {
    if (!checked || advancingRef.current) return;
    advancingRef.current = true;
    const recorded = buildResult(answerCorrect);
    resultsRef.current = [...resultsRef.current, recorded];
    if (resultsRef.current.length >= QUESTION_COUNT) {
      advancingRef.current = false;
      finishQuiz();
      return;
    }
    setQuestionNumber((n) => n + 1);
    loadQuestion(generateSpellingDictation(mode));
    advancingRef.current = false;
  };

  const handleTimeUp = () => {
    if (finished) return;
    finishQuiz();
  };

  if (!question) return <View style={{ flex: 1 }} />;

  const isFull = slots.every((s) => s !== null);

  return (
    <View style={{ width: "100%", flex: 1, alignItems: "center", padding: 10 }}>
      {mode === "Challenge" && flash ? (
        <Animated.Text
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              top: 6,
              right: 14,
              zIndex: 10,
              fontSize: 16,
              fontWeight: "bold",
              color: flash.correct ? "#2e7d32" : "#c62828",
            },
            { opacity: flashAnim },
          ]}
        >
          {flash.correct ? "Correct!" : "Wrong!"}
        </Animated.Text>
      ) : null}

      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <Text>
          Question {questionNumber + 1}
          {mode === "Practice" && `/${QUESTION_COUNT}`}
        </Text>
        {currentStreak >= 2 && (
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>🔥 {currentStreak} in a row!</Text>
        )}
        {mode === "Practice" && (
          <Text style={{ marginTop: 4 }}>
            [ Score: <Text style={{ color: "green" }}>{correctCount}</Text> /{" "}
            <Text style={{ color: "red" }}>{wrongCount}</Text> ]
          </Text>
        )}
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "rgb(57, 61, 241)",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Listen and spell the word!
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          borderWidth: 2,
          borderColor: "#7E57C2",
          paddingVertical: 12,
          paddingHorizontal: 20,
          alignItems: "center",
          marginBottom: 12,
          minWidth: 220,
        }}
      >
        {mode === "Practice" ? (
          <Text style={{ fontSize: 56 }}>{question.emoji}</Text>
        ) : (
          <Text style={{ fontSize: 40 }}>🔊</Text>
        )}
        <TouchableOpacity onPress={() => speak(question.word)} style={{ marginTop: 8 }}>
          <Text style={{ color: "rgb(57, 61, 241)", fontWeight: "bold", fontSize: 16 }}>
            🔊 Hear it again
          </Text>
        </TouchableOpacity>
      </View>

      {mode === "Practice" && checked ? (
        <Text style={{ fontSize: 18, fontWeight: "bold", color: answerCorrect ? "green" : "red", marginBottom: 8 }}>
          {answerCorrect ? "Correct answer!" : `It was "${question.word}"`}
        </Text>
      ) : (
        <Text style={{ fontSize: 18 }}>{""}</Text>
      )}

      <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "flex-start" }}>
        {mode === "Challenge" ? (
          <View style={{ width: 120, marginBottom: 8 }}>
            <StopWatch initialTime={CHALLENGE_SECONDS} onTimeUp={handleTimeUp} />
          </View>
        ) : null}

        {/* Slots */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 14 }}>
          {slots.map((letter, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => returnLetter(i)}
              style={{
                width: 38,
                height: 46,
                margin: 3,
                backgroundColor: "#fff",
                borderRadius: 8,
                borderWidth: 2,
                borderColor: letter ? "#7E57C2" : "#ccc",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 26, fontWeight: "bold", color: "#333" }}>
                {letter ? letter.toUpperCase() : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Letter bank */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
          {bank.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => placeLetter(item.id)}
              style={{
                width: 52,
                height: 46,
                margin: 3,
                backgroundColor: "#EDE7F6",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#B39DDB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4A148C" }}>
                {item.letter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === "Practice" ? (
          <View style={{ margin: 10, width: 160 }}>
            {!checked ? (
              <Button color="purple" title="Check" onPress={handleCheck} disabled={!isFull} />
            ) : (
              <Button color="purple" title="Next" onPress={handleNext} />
            )}
          </View>
        ) : null}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
