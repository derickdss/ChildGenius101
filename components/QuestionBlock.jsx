import react, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { TextInput, Text, View, Button } from "react-native";
import { getRandomFloat } from "../utils/getRandomInt";
import getRandomInt from "../utils/getRandomInt";
import shuffleArray from "../utils/shuffleArray";
import styles from "../styles/App.styles";
import Buttons from "./Buttons";
import StopWatch from "./StopWatch";
import AnswerButtons from "./AnswerButtons";
import NumberPad from "./NumberPad";
import { getAnswer, getAnswersArray } from "./Answers";
import { OPERATIONS } from "./Constants";

export default function QuestionBlock({
  operation,
  mode,
  mathLevel,
  setQuizComplete,
  correctAnswerCount,
  setCorrectAnswerCount,
  wrongAnswerCount,
  setWrongAnswerCount,
  setResult,
  setTimerValue,
  timerValue,
}) {
  const [answerCorrect, setAnswerCorrect] = useState();
  const [answerValue, setAnswerValue] = useState("  ");
  const [inputValue, setInputValue] = useState("  ");
  const [results, setResults] = useState([]);
  const [answerHighlightStyle, setAnswerHighlightStyle] = useState(null);
  const [stopTimer, setStopTimer] = useState(false);
  const [previousQuestion, setPreviousQuestion] = useState("");
  let answerStyle = [styles.questionBlock, styles.answer, answerHighlightStyle];
  const messageStatement =
    answerValue !== "  "
      ? answerCorrect
        ? "Correct answer!"
        : "Incorrect answer"
      : "";
  const [operand1, setOperand1] = useState();
  const [operand2, setOperand2] = useState();
  const [answer, setAnswer] = useState();
  const [answerOptions, setAnswerOptions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answerSubString, setAnswerSubString] = useState(" ");

  const [maxOperandValue, setMaxOperandValue] = useState(mathLevel);
  const maxOptionRandomValue = 5;
  const numberOfQuestionPerExercise = 10;
  const isDecimal = operation === 'Decimal';
  const mixedDecimal = isDecimal && mathLevel > 4;
  const threeDecimalPlaces = isDecimal && mathLevel > 7 ;

  const operator = OPERATIONS[OPERATIONS.findIndex((element) => element.name === operation)].operator
  const setNumpadValue = (answer) => {
    if(answerSubString === ".") {
      setAnswerSubString(`0${answerSubString}`);
    }
    if (answerSubString) {
      setAnswerSubString(`${answerSubString}${answer}`);
    } else {
      setAnswerSubString(`${answer}`);
    }
  };

  const setNumpadSubStringToAnswerValue = () => {
    let decimalAnswer=0;
    let nonDecimalAnswer=0;
    console.log('derd, setting numpad substring with', answerSubString)
    if(isDecimal) {
      decimalAnswer = parseFloat(answerSubString).toFixed(threeDecimalPlaces ? 3 : 2);
    } else {
      nonDecimalAnswer = parseInt(answerSubString);
    }
    console.log('derd, setting numpad substring with decimalAnswer', decimalAnswer)
    setAnswerValue( isDecimal ? decimalAnswer : nonDecimalAnswer);
    setTimeout(function () {
      setQuestionAndAnswers();
    }, 500);
  };

  const setBackspaceNumpadValue = () => {
    if (answerSubString) {
      setAnswerSubString(
        `${answerSubString.substring(0, answerSubString.length - 1)}`
      );
    }
  };

  const functionToSetAnswerValue = (answerEntered) => {
    setAnswerValue( answerEntered === 1 ? parseFloat(answerEntered).toFixed(2) : answerEntered )
  }

  const setQuestionAndAnswers = async () => {
    console.log('derd, results', results)
    console.log('derd, answer', answerValue)
    if (answerValue !== "  " && mode === "Practice") {
      setResults([
        ...results,
        {
          key: `${operand1}_${operator}_${operand2}_${results.length}`,
          question: `${operand1} ${operator} ${operand2} = `,
          answerInput: answerValue,
          correctAnswer: answer,
          answerCorrect: answerValue == answer,
        },
      ]);
    } else if (answerSubString !== " " && mode === "Challenge") {
      setResults([
        ...results,
        {
          key: `${operand1}_${operator}_${operand2}_${results.length}`,
          question: `${operand1} ${operator} ${operand2} = `,
          answerInput: isDecimal ? parseFloat(answerSubString) : parseInt(answerSubString),
          correctAnswer: answer,
          answerCorrect: isDecimal ? parseFloat(answerSubString) == answer : parseInt(answerSubString) == answer,
        },
      ]);
    }
    setAnswerSubString();
    setAnswerHighlightStyle(null);
    setQuestionNumber(questionNumber + 1);
    setInputValue("  ");
    setAnswerValue("  ");
    setAnswerCorrect();

    let numberOne = isDecimal ? getRandomFloat( mixedDecimal, threeDecimalPlaces ) : getRandomInt(1, maxOperandValue, mixedDecimal);
    let numberTwo = isDecimal ? getRandomFloat( mixedDecimal, threeDecimalPlaces ) : getRandomInt(1, maxOperandValue, mixedDecimal);
    const numberOneTwoCombination = `${numberOne}${numberTwo}`;
    while ( numberOneTwoCombination === previousQuestion ) {
      numberOne = isDecimal ? getRandomFloat( mixedDecimal, threeDecimalPlaces ) : getRandomInt(1, maxOperandValue, mixedDecimal);
      numberTwo = isDecimal ? getRandomFloat( mixedDecimal, threeDecimalPlaces ) : getRandomInt(1, maxOperandValue, mixedDecimal);
    }

    if (operation === "Division") {
      let result = numberOne * numberTwo;
      let temp = numberOne;
      numberOne = result;
      setAnswer(temp);
    }

    setOperand1(numberOne);
    setOperand2(numberTwo);

    let answers = [];
    if (operation === "Addition") {
      const additionAnswers = getAnswersArray(numberOne, "+", numberTwo, mixedDecimal);
      answers = additionAnswers;
      setAnswer(numberOne + numberTwo);
    } else if (operation === "Subtraction") {
      if (numberOne - numberTwo < 0) {
        let temp = numberOne;
        numberOne = numberTwo;
        numberTwo = temp;
        setOperand1(numberOne);
        setOperand2(numberTwo);
      }
      const subtractionAnswers = getAnswersArray(numberOne, "-", numberTwo, mixedDecimal);
      answers = subtractionAnswers;
      
      setAnswer(numberOne - numberTwo);
    } else if (operation === "Multiplication") {
      const multiplicationAnswers = getAnswersArray(numberOne, "*", numberTwo, mixedDecimal);
      answers = multiplicationAnswers;
      setAnswer(numberOne * numberTwo);
    } else if (operation === "Division") {
      const divisionAnswers = getAnswersArray(numberOne, "/", numberTwo, mixedDecimal);
      answers = divisionAnswers;
      setAnswer(numberOne / numberTwo);
    } else if (operation === "Decimal") {
      const decimalAnswers = getAnswersArray(numberOne, "+", numberTwo, mixedDecimal, threeDecimalPlaces);
      answers = decimalAnswers;
      setAnswer((parseFloat(numberOne) + parseFloat(numberTwo)).toFixed(2));
    }
    setPreviousQuestion(`${numberOne}${numberTwo}`);
    setAnswerOptions(shuffleArray(answers));
  };

  useEffect(() => {
    if (answerValue === "  ") {
      return;
    } else if (answerValue === answer) {
      setAnswerHighlightStyle(styles.answerCorrect);
      setAnswerCorrect(true);
      setCorrectAnswerCount(correctAnswerCount + 1);
      return;
    }
    setAnswerHighlightStyle(styles.answerInCorrect);
    setWrongAnswerCount(wrongAnswerCount + 1);
    setAnswerCorrect(false);
  }, [answerValue]);

  useEffect(() => {
    setQuestionAndAnswers();
  }, []);

  useEffect(() => {
    if (questionNumber > numberOfQuestionPerExercise && mode === "Practice") {
      setStopTimer(true);
      setResult(results);
    }
  }, [questionNumber]);

  useEffect(() => {
    if (mode === "Challenge" && timerValue === "01:00s") {
      setStopTimer(true);
      setResult(results);
    }
  }, [timerValue]);

  useEffect(() => {
    if (stopTimer) {
      setQuizComplete(true);
    }
  }, [stopTimer]);

  const handleTextInput = (text) => {
    const numberString = text.replace(/[^0-9]/gi, "");
    setInputValue(numberString);
  };

  return (
    <View>
      <View style={styles.section}>
        <View style={{ display: "flex" }}>
          <Text>
            Question {questionNumber}
            {mode === "Practice" && `/10`}
            {mode === "Practice" && (
              <>
                [ Score :{" "}
                <Text style={{ color: "green" }}>{correctAnswerCount}</Text> /{" "}
                <Text style={{ color: "red" }}>{wrongAnswerCount}</Text> ]
              </>
            )}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: 13,
          }}
        >
          <Text style={[styles.questionBlock, styles.operand]}>{operand1}</Text>
          <Text style={[styles.questionBlock, styles.operator]}>
            {operator}
          </Text>
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
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: "blue",
          }}
        >
          {" "}
        </Text>
      )}
      <View style={styles.section}>
        {mode === "Challenge" ? (
          <NumberPad
            answerValue={answerSubString}
            setNumpadValue={setNumpadValue}
            setAnswerValue={setNumpadSubStringToAnswerValue}
            backspaceNumpadValue={setBackspaceNumpadValue}
            operation={operation}
          />
        ) : (
          <AnswerButtons
            values={answerOptions}
            answerValue={answerValue}
            setAnswerValue={functionToSetAnswerValue}
            rows={2}
          />
        )}
        {mode === "Challenge" ? (
          <StopWatch stop={stopTimer} saveTimerValue={setTimerValue} />
        ) : null}
        {mode === "Practice" ? (
          <View
            style={{
              margin: 10,
              width: 140,
            }}
          >
            <Button
              color={"purple"}
              style={{}}
              title={"Next"}
              onPress={() => setQuestionAndAnswers()}
              disabled={answerValue === "  " && inputValue === "  "}
            />
          </View>
        ) : null}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
