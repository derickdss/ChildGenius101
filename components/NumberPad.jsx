import react, {useState} from "react";
import { AntDesign } from '@expo/vector-icons'; 
import { View, Text, TouchableHighlight } from "react-native";
import Buttons from "./Buttons";

const NumberPad = ({
    rows,
    values,
    answerValue,
    setNumpadValue,
    setAnswerValue,
    backspaceNumpadValue,
}) => {
    const rowedValues = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ];

    return (
        <View>
            {rowedValues.map((row, index) => (
                <View
                    style={{
                        flexDirection: "row",
                    }}
                    key={`${row}_index`}
                >
                    {row.map((column) => (
                        <Buttons
                            answer={`${column}`}
                            setAnswerValue={setNumpadValue}
                            disabled={false}
                            key={`${column}_index`}
                            style={{
                                margin: 4,
                                width: 100,
                            }}
                        />
                    ))}
                </View>
            ))}
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                <TouchableHighlight
                    onPress={setAnswerValue}
                    disabled={!answerValue}
                    style={{
                        margin: 4,
                        width: 100,
                        backgroundColor: answerValue ? "green" : "grey",
                        color: "white",
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ color: "white" }}>Enter</Text>
                        <AntDesign name="checkcircleo" size={24} color="white" />
                    </View>
                </TouchableHighlight>
                <Buttons
                    answer={`0`}
                    setAnswerValue={setNumpadValue}
                    disabled={false}
                    key={`0_index`}
                    style={{
                        margin: 4,
                        width: 100,
                    }}
                />
                <TouchableHighlight
                    onPress={backspaceNumpadValue}
                    disabled={!answerValue}
                    style={{
                        margin: 4,
                        width: 100,
                        backgroundColor: answerValue ? "red" : "grey",
                        color: "white",
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ color: "white" }}>Backspace</Text>
                        <AntDesign name="stepbackward" size={24} color="white" />
                    </View>
                </TouchableHighlight>
            </View>
        </View>
    );
};

export default NumberPad;