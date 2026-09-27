import react, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Vibration, Text, View, Button, Animated } from "react-native";
import { recordGame } from "../utils/storage";
import { getRandomFloat } from "../utils/getRandomInt";
import getRandomInt from "../utils/getRandomInt";
import shuffleArray from "../utils/shuffleArray";
import styles from "../styles/App.styles";
import StopWatch from "./StopWatch";
import AnswerButtons from "./AnswerButtons";
import NumberPad from "./NumberPad";
import { getAnswersArray } from "./Answers";
import { OPERATIONS } from "./Constants";

const QUESTION_COUNT = 10;
const CHALLENGE_SECONDS = 60;
// Total on-screen time of the "Correct!"/"Wrong!" background flash in
// Challenge mode (fade-in + hold + fade-out). It never delays the game.
const FLASH_MS = 700;

// Answers.js expects raw JS operators, while Constants.js uses display symbols.
const ANSWER_OPERATORS = {
  Addition: "+",
  Subtraction: "-",
  Multiplication: "*",
  Division: "/",
  Decimal: "+",
};

export default function QuestionBlock({ operation, mode, mathLevel, onQuizComplete }) {
  const [operand1, setOperand1] = useState();
  const [operand2, setOperand2] = useState();
  const [answer, setAnswer] = useState();
  const [answerOptions, setAnswerOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);

  // Practice mode: the chosen multiple-choice answer.
  const [answerValue, setAnswerValue] = useState("  ");
  // Challenge mode: what the child has typed on the number pad so far.
  const [answerSubString, setAnswerSubString] = useState("");

  const [answerCorrect, setAnswerCorrect] = useState();
  const [answerHighlightStyle, setAnswerHighlightStyle] = useState(null);
  // Display-only counters (resultsRef is the source of truth).
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  const [finished, setFinished] = useState(false);
  // ref mirror of the results list so finishQuiz always sees every answer,
  // even the one pushed in the same tick (state updates are async)
  const resultsRef = useRef([]);
  const previousQuestionRef = useRef("");
  const advancingRef = useRef(false);
  // Challenge mode: subtle background flash of "Correct!"/"Wrong!" in the
  // top corner while the child reads the new question. Never blocks input.
  const [flash, setFlash] = useState(null);
  const flashAnim = useRef(new Animated.Value(0)).current;
  const flashAnimationRef = useRef(null);

  let answerStyle = [styles.questionBlock, styles.answer, answerHighlightStyle];
  const messageStatement =
    answerValue !== "  "
      ? answerCorrect
        ? "Correct answer!"
        : "Incorrect answer"
      : "";

  const isDecimal = operation === "Decimal";
  const mixedDecimal = isDecimal && mathLevel > 4;
  const threeDecimalPlaces = isDecimal && mathLevel > 7;
  const displayOperator = OPERATIONS.find((op) => op.name === operation)?.operator || "+";

  const vibrate = (pattern) => {
    try {
      const p = Vibration.vibrate(pattern);
      if (p && p.catch) p.catch(() => {});
    } catch (e) {
      // vibration is a nice-to-have; never let it break the game
    }
  };

  const generateQuestion = () => {
    let numberOne;
    let numberTwo;
    let combination;
    do {
      numberOne = isDecimal
        ? getRandomFloat(mixedDecimal, threeDecimalPlaces)
        : getRandomInt(1, mathLevel);
      numberTwo = isDecimal
        ? getRandomFloat(mixedDecimal, threeDecimalPlaces)
        : getRandomInt(1, mathLevel);
      combination = `${numberOne}${numberTwo}`;
    } while (combination === previousQuestionRef.current);

    if (operation === "Division") {
      // Pick divisor and quotient first, then show their product as the dividend.
      const dividend = numberOne * numberTwo;
      setAnswer(numberOne);
      numberOne = dividend;
    } else if (operation === "Subtraction") {
      if (numberOne - numberTwo < 0) {
        [numberOne, numberTwo] = [numberTwo, numberOne];
      }
      setAnswer(numberOne - numberTwo);
    } else if (operation === "Multiplication") {
      setAnswer(numberOne * numberTwo);
    } else if (operation === "Decimal") {
      setAnswer((parseFloat(numberOne) + parseFloat(numberTwo)).toFixed(2));
    } else {
      setAnswer(numberOne + numberTwo);
    }

    previousQuestionRef.current = combination;
    setOperand1(numberOne);
    setOperand2(numberTwo);
    setAnswerOptions(
      shuffleArray(
        getAnswersArray(
          numberOne,
          ANSWER_OPERATORS[operation],
          numberTwo,
          mixedDecimal,
          threeDecimalPlaces
        )
      )
    );
  };

  useEffect(() => {
    generateQuestion();
    return () => flashAnimationRef.current && flashAnimationRef.current.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePracticeAnswer = (chosen) => {
    if (answerValue !== "  ") return;
    setAnswerValue(chosen);
  };

  useEffect(() => {
    if (answerValue === "  ") return;
    const correct = answerValue == answer;
    setAnswerCorrect(correct);
    if (correct) {
      setAnswerHighlightStyle(styles.answerCorrect);
      setCorrectCount((count) => count + 1);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      vibrate(40);
    } else {
      setAnswerHighlightStyle(styles.answerInCorrect);
      setWrongCount((count) => count + 1);
      setCurrentStreak(0);
      vibrate([0, 120]);
    }
  }, [answerValue]);

  const finishQuiz = () => {
    if (finished) return;
    setFinished(true);
    const finalResults = resultsRef.current;
    const score = finalResults.filter((r) => r.answerCorrect).length;
    recordGame({ operation, mode, score }).then((info) =>
      onQuizComplete(finalResults, info)
    );
  };

  const buildResult = (answerInput) => ({
    key: `${operand1}_${displayOperator}_${operand2}_${resultsRef.current.length}`,
    question: `${operand1} ${displayOperator} ${operand2} = `,
    answerInput,
    correctAnswer: answer,
    answerCorrect: answerInput == answer,
  });

  // Fade in, hold briefly, then fade out — purely visual feedback that
  // plays while the child is already looking at the next question.
  const showFlash = (correct) => {
    setFlash({ correct });
    if (flashAnimationRef.current) flashAnimationRef.current.stop();
    flashAnim.setValue(0);
    const fadeIn = 120;
    const fadeOut = 250;
    flashAnimationRef.current = Animated.sequence([
      Animated.timing(flashAnim, { toValue: 0.8, duration: fadeIn, useNativeDriver: true }),
      Animated.delay(Math.max(FLASH_MS - fadeIn - fadeOut, 0)),
      Animated.timing(flashAnim, { toValue: 0, duration: fadeOut, useNativeDriver: true }),
    ]);
    flashAnimationRef.current.start();
  };

  const recordAndAdvance = () => {
    if (advancingRef.current || finished) return;
    advancingRef.current = true;

    let recorded = null;
    if (mode === "Practice" && answerValue !== "  ") {
      recorded = buildResult(answerValue);
    } else if (mode === "Challenge" && answerSubString !== "") {
      const parsed = isDecimal ? parseFloat(answerSubString) : parseInt(answerSubString, 10);
      recorded = buildResult(parsed);
    }

    if (recorded) resultsRef.current = [...resultsRef.current, recorded];

    setAnswerValue("  ");
    setAnswerSubString("");
    setAnswerCorrect();
    setAnswerHighlightStyle(null);

    const isLastPracticeQuestion =
      mode === "Practice" && resultsRef.current.length >= QUESTION_COUNT;
    if (isLastPracticeQuestion) {
      finishQuiz();
      advancingRef.current = false;
      return;
    }

    // Advance straight to the next question — no pause. In Challenge mode
    // we flash "Correct!"/"Wrong!" in the background while it's on screen.
    generateQuestion();
    setQuestionNumber((n) => n + 1);
    if (mode === "Challenge" && recorded) {
      showFlash(recorded.answerCorrect);
    }
    advancingRef.current = false;
  };

  const handleTimeUp = () => {
    finishQuiz();
  };

  const setNumpadValue = (digit) => {
    setAnswerSubString((current) => {
      if (digit === ".") {
        if (current.includes(".")) return current;
        return current === "" ? "0." : `${current}.`;
      }
      if (current === "" || current === "0") return `${digit}`;
      return `${current}${digit}`;
    });
  };

  const backspaceNumpadValue = () => {
    setAnswerSubString((current) => current.slice(0, -1));
  };

  return (
    <View style={{ width: "100%" }}>
      {mode === "Challenge" && flash ? (
        // Background feedback only: sits in the top corner next to the
        // question, fades in/out, and never intercepts touches.
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
      <View style={styles.section}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>
            Question {questionNumber + 1}
            {mode === "Practice" && `/${QUESTION_COUNT}`}
          </Text>
          {currentStreak >= 2 && (
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>
              🔥 {currentStreak} in a row!
            </Text>
          )}
        </View>
        {mode === "Practice" && (
          <Text style={{ marginTop: 4 }}>
            [ Score:{" "}
            <Text style={{ color: "green" }}>{correctCount}</Text> /{" "}
            <Text style={{ color: "red" }}>{wrongCount}</Text> ]
          </Text>
        )}
        <View style={{ flexDirection: "row", marginLeft: 13, marginTop: 10 }}>
          <Text style={[styles.questionBlock, styles.operand]}>{operand1}</Text>
          <Text style={[styles.questionBlock, styles.operator]}>{displayOperator}</Text>
          <Text style={[styles.questionBlock, styles.operand]}>{operand2}</Text>
          <Text style={[styles.questionBlock, styles.equals]}>=</Text>
          <Text style={answerStyle}>
            {mode === "Challenge" ? answerSubString : answerValue}
          </Text>
        </View>
      </View>
      {mode === "Practice" && answerValue !== "  " ? (
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: "blue",
          }}
        >
          {messageStatement}
        </Text>
      ) : (
        <Text style={{ fontSize: 20 }}>{" "}</Text>
      )}
      <View style={styles.section}>
        {mode === "Challenge" ? (
          <>
            <StopWatch initialTime={CHALLENGE_SECONDS} onTimeUp={handleTimeUp} />
            <NumberPad
              answerValue={answerSubString}
              setNumpadValue={setNumpadValue}
              setAnswerValue={recordAndAdvance}
              backspaceNumpadValue={backspaceNumpadValue}
              operation={operation}
            />
          </>
        ) : (
          <>
            <AnswerButtons
              values={answerOptions}
              answerValue={answerValue}
              setAnswerValue={handlePracticeAnswer}
            />
            <View style={{ margin: 10, width: 140 }}>
              <Button
                color={"purple"}
                title={"Next"}
                onPress={recordAndAdvance}
                disabled={answerValue === "  "}
              />
            </View>
          </>
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
