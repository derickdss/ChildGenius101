import react, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { TextInput, Text, View, Button } from "react-native";
import getRandomInt from "../utils/getRandomInt";
import shuffleArray from "../utils/shuffleArray";
import styles from "../styles/App.styles";
import AnswerButtons from "./AnswerButtons";
import StopWatch from "./StopWatch";

export default function QuestionBlock({
    operation,
    mode,
    setQuizComplete,
    correctAnswerCount,
    setCorrectAnswerCount,
    wrongAnswerCount,
    setWrongAnswerCount,
    setResult
}) {
    const [answerCorrect, setAnswerCorrect] = useState();
    const [answerValue, setAnswerValue] = useState(" ");
    const [inputValue, setInputValue]  = useState(" ");
    const [results, setResults] = useState([])
    const [answerHighlightStyle, setAnswerHighlightStyle] = useState(null);
    let answerStyle = [
        styles.questionBlock,
        styles.answer,
        answerHighlightStyle,
    ];
    const messageStatement =
        answerValue !== "?"
            ? answerCorrect
                ? "Correct answer!"
                : "Incorrect answer"
            : "";
    const [operand1, setOperand1] = useState();
    const [operand2, setOperand2] = useState();
    const [answer, setAnswer] = useState();
    const [answerOptions, setAnswerOptions] = useState([]);
    const [questionNumber, setQuestionNumber] = useState(0);

    const [operator, setOperator] = useState("");
    const [maxOperandValue, setMaxOperandValue] = useState(15);
    const maxOptionRandomValue = 5;
    const numberOfQuestionPerExercise = 10;

    const setQuestionAndAnswers = async () => {
        if(mode==="Challenge" && inputValue !== ' ') {
            setResults(
                [
                    ...results, 
                    {
                        key: `${operand1}_${operator}_${operand2}_${results.length}`, 
                        question: `${operand1} ${operator} ${operand2} = `, 
                        answerInput: inputValue, 
                        correctAnswer: answer, 
                        answerCorrect: inputValue===answer
                    }
                ]
            );
        } else if(mode==="Practice" && answerValue !== ' ') {
            setResults(
                [
                    ...results, 
                    { 
                        key: `${operand1}_${operator}_${operand2}_${results.length}`, 
                        question: `${operand1} ${operator} ${operand2} = `,
                        answerInput: answerValue, 
                        correctAnswer: answer, 
                        answerCorrect: answerValue===answer
                    }
                ]
            );
        }

        setAnswerHighlightStyle(null);
        if (operation === "multiplication" || operation === "division") {
            setMaxOperandValue(12);
        }
        setQuestionNumber(questionNumber + 1);
        setAnswerValue(" ");
        setInputValue(" ")
        setAnswerCorrect();
        let number1 = getRandomInt(1, maxOperandValue);
        let number2 = getRandomInt(1, maxOperandValue);

        if (operation === "division") {
            let result = number1 * number2;
            let temp = number1;
            number1 = result;
            setAnswer(temp);
        }

        setOperand1(number1);
        setOperand2(number2);
        const randomNumberOne = getRandomInt(1, maxOperandValue - 7);
        const randomNumberTwo = getRandomInt(1, maxOperandValue - 7);
        const randomNumberThree = getRandomInt(1, maxOperandValue - 7);

        let answers = [];
        if (operation === "addition") {
            const additionAnswers = [
                number1 + number2,
                number1 + number2 + randomNumberOne,
                number1 + number2 + randomNumberTwo,
                Math.abs(number1 + number2 - randomNumberThree),
            ];
            answers = additionAnswers;
            setOperator("+");
            setAnswer(number1 + number2);
        } else if (operation === "subtraction") {
            if (number1 - number2 < 0) {
                let temp = number1;
                number1 = number2;
                number2 = temp;
            }
            const subtractionAnswers = [
                number1 - number2,
                number1 - number2 + randomNumberOne,
                number1 - number2 + randomNumberTwo,
                Math.abs(number1 + number2 - randomNumberThree),
            ];
            answers = subtractionAnswers;
            setOperator("-");
            setAnswer(number1 - number2);
        } else if (operation === "multiplication") {
            const multiplicationAnswers = [
                number1 * number2,
                number1 * number2 + randomNumberOne,
                Math.abs(number1 * number2 - randomNumberTwo),
                Math.abs(number1 * number2 - randomNumberThree),
            ];
            answers = multiplicationAnswers;
            setOperator("x");
            setAnswer(number1 * number2);
        } else if (operation === "division") {
            const divisionAnswers = [
                number1 / number2,
                Math.ceil(number1 / number2 + randomNumberOne),
                Math.abs(Math.ceil(number1 / number2 - randomNumberTwo)),
                Math.abs(Math.ceil(number1 / number2 - randomNumberThree)),
            ];

            answers = divisionAnswers;
            setOperator("/");
            setAnswer(number1 / number2);
        }

        setAnswerOptions(shuffleArray(answers));
    };

    useEffect(() => {
        if (answerValue === " ") {
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
        if (questionNumber > numberOfQuestionPerExercise) {
            setQuizComplete(true);
            setResult(results)
        }
    }, [questionNumber]);

    return (
        <View>
            <View style={styles.section}>
                <View style={{ display: "flex" }}>
                    <Text>
                        Question {questionNumber}/10 
                        {mode === "Practice" && <>
                        [ Score :{" "}
                        <Text style={{ color: "green" }}>
                            {correctAnswerCount}
                        </Text>{" "}
                        /{" "}
                        <Text style={{ color: "red" }}>{wrongAnswerCount}</Text>{" "}
                        ]
                        </>}
                    </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={[styles.questionBlock, styles.operand]}>
                        {operand1}
                    </Text>
                    <Text style={[styles.questionBlock, styles.operator]}>
                        {operator}
                    </Text>
                    <Text style={[styles.questionBlock, styles.operand]}>
                        {operand2}
                    </Text>
                    <Text style={[styles.questionBlock, styles.equals]}>=</Text>
                    {mode === 'Practice' ? 
                        <Text style={answerStyle}>{answerValue}</Text> : (
                        <TextInput 
                            style={styles.inputAnswer} 
                            value={inputValue} 
                            onChangeText={(text) => setInputValue(parseInt(Math.trunc(text.replace(/[^.0-9]/ig, ""))))}/>
                        )
                    }
                </View>
            </View>
            { mode === 'Practice' && answerValue !== " " && (
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    color: 'blue'
                }}>{messageStatement}</Text>
            )}
            <View style={styles.section}>
                {mode === 'Practice' ? (<>
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <AnswerButtons
                            answer={`${answerOptions[0]}`}
                            setAnswerValue={setAnswerValue}
                            disabled={answerValue !== " "}
                        />
                        <AnswerButtons
                            answer={`${answerOptions[1]}`}
                            setAnswerValue={setAnswerValue}
                            disabled={answerValue !== " "}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <AnswerButtons
                            answer={`${answerOptions[2]}`}
                            setAnswerValue={setAnswerValue}
                            disabled={answerValue !== " "}
                        />
                        <AnswerButtons
                            answer={`${answerOptions[3]}`}
                            setAnswerValue={setAnswerValue}
                            disabled={answerValue !== " "}
                        />
                    </View>
                </>) : null }
                {/* <StopWatch showControlButtons={false}/>} */}
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
                        disabled={answerValue === " " && inputValue === " "}
                    ></Button>
                </View>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}
