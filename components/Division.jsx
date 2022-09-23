import { useState } from "react";
import { View } from "react-native";
import QuestionBlock from "./QuestionBlock";
import Result from "./Result";

export default function Division({ navigation, route }) {
    const [quizComplete, setQuizComplete] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
    const [result, setResult] = useState([]);
    const [timerValue, setTimerValue] = useState();
    const [countdownTime, setCountdowntime] = useState(60);

    console.log("derd, division timerValue", timerValue);

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
                    operation={"division"}
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
                        mode={route?.params?.mode}
                        reloadPage={reloadPage}
                        result={result}
                        countdownTime={countdownTime}
                    />
                </View>
            )}
        </View>
    );
}
