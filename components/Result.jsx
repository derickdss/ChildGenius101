import { useState, useEffect } from "react";
import { Text, Button, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ResultStatement = ({ mode, result, countdownTime }) => {
    const correctAnswerCount = result.filter((res) => res.answerCorrect).length;
    const wrongAnswerCount = result.length - correctAnswerCount;
    const [showText, setShowText] = useState(true);
    const timePerQuestion =
        result.length && mode === "Challenge"
            ? (countdownTime / result.length).toFixed(2)
            : 0;
    useEffect(() => {
        // Change the state every second or the time given by User.
        const interval = setInterval(() => {
            setShowText((showText) => !showText);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>You Scored</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                <Text
                    style={{ color: "green" }}
                >{` ${correctAnswerCount} `}</Text>
                correct and{" "}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                <Text style={{ color: "red" }}>{` ${wrongAnswerCount} `}</Text>
                incorrect answers
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {showText && result.length && mode === "Challenge" ? (
                    <Text
                        style={{ textAlign: "center" }}
                    >{`${timePerQuestion}sec/question`}</Text>
                ) : (
                    <Text>{"         "}</Text>
                )}
            </Text>
        </View>
    );
};

const ResultOptions = ({ reloadPage }) => {
    const navigation = useNavigation();
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                margin: 10,
            }}
        >
            <View style={{ marginLeft: 10, marginRight: 5, width: 80 }}>
                <Button title="Retake" onPress={reloadPage} />
            </View>
            <View style={{ marginLeft: 10, marginRight: 5, width: 80 }}>
                <Button
                    title="Home"
                    onPress={() => navigation.navigate("Home")}
                />
            </View>
        </View>
    );
};

const Answers = ({ result }) => (
    <View>
        {result.length ? (
            <View style={{ paddingTop: 25, display: "flex", paddingLeft: 20 }}>
                <Text style={{ fontWeight: "bold" }}>Answers:</Text>
                <View>
                    <FlatList
                        data={result}
                        renderItem={({ item, index }) => (
                            <View>
                                <Text>
                                    {item.question}
                                    <Text
                                        style={{
                                            color:
                                                item.answerInput ===
                                                item.correctAnswer
                                                    ? "green"
                                                    : "red",
                                        }}
                                    >
                                        {item.answerInput}
                                        {item.answerInput !==
                                        item.correctAnswer ? (
                                            <Text style={{ color: "green" }}>
                                                {` => ${item.correctAnswer}`}
                                            </Text>
                                        ) : null}
                                    </Text>
                                </Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        ) : null}
    </View>
);

const Result = ({ mode, reloadPage, result, countdownTime }) => (
    <View
        style={{
            display: "flex",
            justifyContent: "center",
            marginTop: -75,
        }}
    >
        <ResultStatement
            result={result}
            countdownTime={countdownTime}
            mode={mode}
        />
        <ResultOptions reloadPage={reloadPage} />
        <Answers result={result} />
    </View>
);

export default Result;
