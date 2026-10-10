import React, { useState, useEffect, useRef } from "react";
import { StatusBar, Text, View, Button, Animated } from "react-native";
import { Vibration } from "react-native";
import { generateEnglishQuestion } from "../data/englishQuestions";
import { recordGame } from "../utils/storage";
import StopWatch from "./StopWatch";
import EnglishAnswerButtons from "./EnglishAnswerButtons";

const QUESTION_COUNT = 10;
const CHALLENGE_SECONDS = 60;
const FLASH_MS = 700;

// Practice: 10 multiple-choice questions, "Next" button, green/red feedback.
// Challenge: 60-second timer, tap to answer, flash feedback, auto-advance.
export default function EnglishQuestionBlock({ skill, mode, onQuizComplete }) {
  const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [chosenIndex, setChosenIndex] = useState(null);
  const [answerCorrect, setAnswerCorrect] = useState();
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [flash, setFlash] = useState(null);
  const resultsRef = useRef([]);
  const advancingRef = useRef(false);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const flashAnimationRef = useRef(null);

  const vibrate = (pattern) => {
    try {
      const p = Vibration.vibrate(pattern);
      if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  };

  useEffect(() => {
    setQuestion(generateEnglishQuestion(skill));
    return () => {
      if (flashAnimationRef.current) flashAnimationRef.current.stop();
    };
  }, [skill]);

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

  const buildResult = (chosenIdx) => {
    const q = question;
    return {
      key: `${skill}_${resultsRef.current.length}`,
      question: `${q.prompt} ${q.display}`,
      answerInput: q.options[chosenIdx].label,
      correctAnswer: q.options[q.correctIndex].label,
      answerCorrect: chosenIdx === q.correctIndex,
    };
  };

  const finishQuiz = () => {
    if (finished) return;
    setFinished(true);
    const finalResults = resultsRef.current;
    const score = finalResults.filter((r) => r.answerCorrect).length;
    recordGame({ operation: skill, mode, score })
      .then((info) => onQuizComplete(finalResults, info))
      .catch(() => onQuizComplete(finalResults, null));
  };

  // Practice mode: record the choice, show feedback; advance on "Next".
  const handlePickPractice = (index) => {
    if (chosenIndex !== null) return;
    setChosenIndex(index);
    const correct = index === question.correctIndex;
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
    if (chosenIndex === null || advancingRef.current) return;
    advancingRef.current = true;
    const recorded = buildResult(chosenIndex);
    resultsRef.current = [...resultsRef.current, recorded];
    if (resultsRef.current.length >= QUESTION_COUNT) {
      advancingRef.current = false;
      finishQuiz();
      return;
    }
    setQuestion(generateEnglishQuestion(skill));
    setQuestionNumber((n) => n + 1);
    setChosenIndex(null);
    setAnswerCorrect();
    advancingRef.current = false;
  };

  // Challenge mode: answer immediately, flash feedback, auto-advance.
  const handlePickChallenge = (index) => {
    if (advancingRef.current || finished) return;
    advancingRef.current = true;
    const recorded = buildResult(index);
    resultsRef.current = [...resultsRef.current, recorded];
    if (recorded.answerCorrect) {
      setCorrectCount((c) => c + 1);
      setCurrentStreak((s) => s + 1);
      vibrate(40);
    } else {
      setWrongCount((c) => c + 1);
      setCurrentStreak(0);
      vibrate([0, 120]);
    }
    showFlash(recorded.answerCorrect);
    if (resultsRef.current.length >= QUESTION_COUNT) {
      advancingRef.current = false;
      finishQuiz();
      return;
    }
    setQuestion(generateEnglishQuestion(skill));
    setQuestionNumber((n) => n + 1);
    setChosenIndex(null);
    setAnswerCorrect();
    advancingRef.current = false;
  };

  const handleTimeUp = () => {
    if (finished) return;
    finishQuiz();
  };

  if (!question) return <View style={{ flex: 1 }} />;

  const displaySize =
    question.displayKind === "emoji" || question.displayKind === "letter"
      ? 64
      : question.displayKind === "letters"
        ? 34
        : 26;

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
        {question.prompt}
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          borderWidth: 2,
          borderColor: "#7E57C2",
          paddingVertical: 16,
          paddingHorizontal: 24,
          alignItems: "center",
          marginBottom: 16,
          minWidth: 220,
        }}
      >
        <Text style={{ fontSize: displaySize, fontWeight: "bold", color: "#333", textAlign: "center" }}>
          {question.display}
        </Text>
      </View>

      {mode === "Practice" && chosenIndex !== null ? (
        <Text style={{ fontSize: 18, fontWeight: "bold", color: answerCorrect ? "green" : "red", marginBottom: 8 }}>
          {answerCorrect ? "Correct answer!" : "Incorrect answer"}
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
        <EnglishAnswerButtons
          options={question.options}
          chosenIndex={chosenIndex}
          correctIndex={question.correctIndex}
          onPick={mode === "Practice" ? handlePickPractice : handlePickChallenge}
        />
        {mode === "Practice" ? (
          <View style={{ margin: 10, width: 140 }}>
            <Button color="purple" title="Next" onPress={handleNext} disabled={chosenIndex === null} />
          </View>
        ) : null}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
