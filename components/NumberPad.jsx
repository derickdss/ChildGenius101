import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Dimensions, Text, TouchableHighlight, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const NumberPad = ({
  answerValue,
  setNumpadValue,
  setAnswerValue,
  backspaceNumpadValue,
  operation,
}) => {
  const width = screenWidth < 800 ? screenWidth / 3.5 : 200;
  const rows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  return (
    <View style={{ flex: 1 }}>
      {rows.map((row) => (
        <View style={{ flexDirection: "row", flex: 1, paddingVertical: 6, alignItems: "center" }} key={row[0]}>
          {row.map((column) => (
            <TouchableHighlight
              key={column}
              onPress={() => setNumpadValue(column)}
              style={{
                marginHorizontal: 6,
                height: "100%",
                maxHeight: 80,
                width,
                backgroundColor: "rgb(33, 150, 243)",
                justifyContent: "center",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "white", fontSize: 24 }}>{column}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </View>
      ))}
      <View style={{ flexDirection: "row", flex: 1, paddingVertical: 6, alignItems: "center" }}>
        <TouchableHighlight
          onPress={() => setNumpadValue(0)}
          style={{
            marginHorizontal: 6,
            height: "100%",
            maxHeight: 80,
            width: width * 1.525,
            backgroundColor: "rgb(33, 150, 243)",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 24 }}>0</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => setNumpadValue(".")}
          disabled={operation !== "Decimal"}
          style={{
            marginHorizontal: 6,
            height: "100%",
            maxHeight: 80,
            width: width * 1.525,
            backgroundColor: operation !== "Decimal" ? "grey" : "rgb(33, 150, 243)",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 24 }}>.</Text>
          </View>
        </TouchableHighlight>
      </View>
      <View style={{ flexDirection: "row", flex: 1, paddingVertical: 6, alignItems: "center" }}>
        <TouchableHighlight
          onPress={backspaceNumpadValue}
          disabled={!answerValue}
          style={{
            marginHorizontal: 6,
            height: "100%",
            maxHeight: 80,
            padding: 6,
            width: width * 1.525,
            backgroundColor: answerValue ? "red" : "grey",
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
            marginHorizontal: 6,
            height: "100%",
            maxHeight: 80,
            padding: 6,
            width: width * 1.525,
            backgroundColor: answerValue ? "green" : "grey",
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