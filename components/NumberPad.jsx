import react, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { View, Text, TouchableHighlight, Dimensions } from "react-native";
import Buttons from "./Buttons";

const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");

const NumberPad = ({
  rows,
  values,
  answerValue,
  setNumpadValue,
  setAnswerValue,
  backspaceNumpadValue,
  operation
}) => {
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  });

  const width =
    dimensions.window.width < 800 ? dimensions.window.width / 3.5 : 200;

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
            <TouchableHighlight
              key={column}
              onPress={() => setNumpadValue(column)}
              style={{
                margin: 6,
                height: 60,
                width,
                backgroundColor: "rgb(33, 150, 243)",
                color: "white",
                justifyContent: "center",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "white" }}>{column}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      ))}
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableHighlight
          onPress={() => setNumpadValue(0)}
          style={{
            margin: 6,
            height: 60,
            width: width * 1.525,
            backgroundColor: "rgb(33, 150, 243)",
            color: "white",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white" }}>0</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => setNumpadValue(".")}
          disabled={operation !== 'Decimal'}
          style={{
            margin: 6,
            height: 60,
            width: width * 1.525,
            backgroundColor: operation !== 'Decimal' ? "grey" : "rgb(33, 150, 243)" ,
            color: "white",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white" }}>.</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableHighlight
          onPress={backspaceNumpadValue}
          disabled={!answerValue}
          style={{
            margin: 6,
            height: 60,
            padding: 6,
            width: width * 1.525,
            backgroundColor: answerValue ? "red" : "grey",
            color: "white",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white" }}>Backspace</Text>
            <AntDesign name="stepbackward" size={24} color="white" />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={setAnswerValue}
          disabled={!answerValue}
          style={{
            margin: 6,
            height: 60,
            padding: 6,
            width: width * 1.525,
            backgroundColor: answerValue ? "green" : "grey",
            color: "white",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white" }}>Enter</Text>
            <AntDesign name="checkcircleo" size={24} color="white" />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default NumberPad;
