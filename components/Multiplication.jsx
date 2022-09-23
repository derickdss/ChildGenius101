import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import QuestionBlock from "./QuestionBlock";
import Result from "./Result";

export default function Multiplication({ navigation, route }) {
    const [quizComplete, setQuizComplete] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
    const [result, setResult] = useState([]);
    const [timerValue, setTimerValue] = useState();

    const reloadPage = () => {
        setQuizComplete(false);
        setCorrectAnswerCount(0);
        setWrongAnswerCount(0);
    };

    return (
        <View
            style={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "lavender",
                alignItems: "center",
                minHeight: "100%",
            }}
        >
            {!quizComplete ? (
                <QuestionBlock
                    operation={"multiplication"}
                    mode={route.params.mode}
                    setQuizComplete={setQuizComplete}
                    correctAnswerCount={correctAnswerCount}
                    setCorrectAnswerCount={setCorrectAnswerCount}
                    wrongAnswerCount={wrongAnswerCount}
                    setWrongAnswerCount={setWrongAnswerCount}
                    setResult={setResult}
                    setTimerValue={setTimerValue}
                    timerValue={timerValue}
                />
            ) : (
                <View>
                    <Result
                        correctAnswerCount={correctAnswerCount}
                        wrongAnswerCount={wrongAnswerCount}
                        reloadPage={reloadPage}
                        result={result}
                        resultTime={timerValue}
                        countdownTime={countdownTime}
                    />
                </View>
            )}
        </View>
    );
}
