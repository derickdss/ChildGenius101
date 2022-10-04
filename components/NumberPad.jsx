import react, {useState} from "react";
import { TiTickOutline } from "react-icons/ti";
import { BsBackspace } from "react-icons/bs";
import { View, Button, Text } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
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
                        <TiTickOutline />
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
                        <BsBackspace />
                    </View>
                </TouchableHighlight>
            </View>
            {/* <View
                style={{
                    flexDirection: "row",
                }}
            >
                <View style={{ flex: 1 }}>
                    <Button
                        title={"Enter"}
                        onPress={setAnswerValue}
                        disabled={false}
                        color={"green"}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Button
                        title={"|<- Backspace"}
                        onPress={backspaceNumpadValue}
                        disabled={false}
                        color={"green"}
                        style={{ flex: 1, marginLeft: 10 }}
                    />
                </View>
            </View> */}
        </View>
    );
};

export default NumberPad;