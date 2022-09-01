import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import QuestionBlock from "./QuestionBlock";
import Result from "./Result";

export default function Multiplication({ navigation }) {
    const [quizComplete, setQuizComplete] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);

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
                    setQuizComplete={setQuizComplete}
                    correctAnswerCount={correctAnswerCount}
                    setCorrectAnswerCount={setCorrectAnswerCount}
                    wrongAnswerCount={wrongAnswerCount}
                    setWrongAnswerCount={setWrongAnswerCount}
                />
            ) : (
                <View>
                    <Result
                        correctAnswerCount={correctAnswerCount}
                        wrongAnswerCount={wrongAnswerCount}
                        reloadPage={reloadPage}
                    />
                </View>
            )}
        </View>
    );
}
