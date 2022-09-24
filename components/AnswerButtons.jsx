import react from "react";
import { View, Text } from "react-native";
import Buttons from "./Buttons";

const AnswerButtons = ({ rows, values, setAnswerValue, answerValue }) => {
    let rowedValues = [];
    for (let i = 0; rowedValues.flat().length < values.length; i = i + rows) {
        rowedValues = [...rowedValues, values.slice(i, i + 2)];
    }
    return (
        <View>
            {rowedValues.map((row, index) => (
                <View
                    style={{
                        flexDirection: "row",
                    }}
                    key={`${row}_${index}`}
                >
                    {row.map((column, index) => (
                        <Buttons
                            answer={`${column}`}
                            setAnswerValue={setAnswerValue}
                            disabled={answerValue !== "  "}
                            key={`${column}_${index}`}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

export default AnswerButtons;