import react from "react";
import { Text, Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ResultStatement = ({ correctAnswerCount, wrongAnswerCount }) => {
    return (
        <Text>
            You Scored{" "}
            <Text style={{ color: "green" }}>{correctAnswerCount}</Text> correct
            and <Text style={{ color: "red" }}>{wrongAnswerCount}</Text>{" "}
            incorrect answers
        </Text>
    );
};

const ResultOptions = ({ reloadPage }) => {
    const navigation = useNavigation();
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                margin: 10,
            }}
        >
            <View style={{ flexGrow: 1, marginLeft: 10, marginRight: 5 }}>
                <Button title="Retake" onPress={reloadPage} />
            </View>
            <View style={{ flexGrow: 1, marginLeft: 10, marginRight: 5 }}>
                <Button
                    title="Home"
                    onPress={() => navigation.navigate("Home")}
                />
            </View>
        </View>
    );
};

const Result = ({ correctAnswerCount, wrongAnswerCount, reloadPage }) => {
    return (
        <>
            <ResultStatement
                correctAnswerCount={correctAnswerCount}
                wrongAnswerCount={wrongAnswerCount}
            />
            <ResultOptions reloadPage={reloadPage} />
        </>
    );
};

export default Result;
