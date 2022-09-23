import react from "react";
import { View } from "react-native";
import Buttons from "./Buttons";

const AnswerButtons = ({rows, values, setAnswerValue, answerValue}) => {
    let rowedValues = [];
    while (values?.length > 0) rowedValues.push(values.splice(0, rows));

    return (
        rowedValues && rowedValues.map((row, index) => (
            <View
                style={{
                    flexDirection: "row",
                }}
                key={`${row}_index`}
            >
                {
                    row.map(column => 
                        <Buttons
                            answer={`${column}`}
                            setAnswerValue={setAnswerValue}
                            disabled={answerValue !== " "}
                            key={`${column}_index`}
                        />
                    )
                }
            </View>
        ))
    )
}

export default AnswerButtons;