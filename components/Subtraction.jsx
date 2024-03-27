import { useState } from "react";
import { View, Button } from "react-native";
import QuestionBlock from "./QuestionBlock";
import Result from "./Result";

export default function Subtraction({ navigation, route }) {
    const [quizComplete, setQuizComplete] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
    const [result, setResult] = useState([]);
    const [timerValue, setTimerValue] = useState();
    const [countdownTime, setCountdowntime] = useState(60);

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
                    operation={"Subtraction"}
                    mode={route.params.mode}
                    mathLevel={route?.params?.mathLevel}
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
                        mode={route?.params?.mode}
                        correctAnswerCount={correctAnswerCount}
                        wrongAnswerCount={wrongAnswerCount}
                        reloadPage={reloadPage}
                        result={result}
                        timerValue={timerValue}
                        countdownTime={countdownTime}
                    />
                </View>
            )}
        </View>
    );
}
