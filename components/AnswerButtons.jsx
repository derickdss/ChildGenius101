import React from "react";
import { View } from "react-native";
import Buttons from "./Buttons";

const AnswerButtons = ({ values, setAnswerValue, answerValue }) => {
  const rows = [];
  for (let i = 0; i < values.length; i += 2) {
    rows.push(values.slice(i, i + 2));
  }

  return (
    <View>
      {rows.map((row, rowIndex) => (
        <View style={{ flexDirection: "row" }} key={rowIndex}>
          {row.map((value, colIndex) => (
            <Buttons
              answer={`${value}`}
              setAnswerValue={setAnswerValue}
              disabled={answerValue !== "  "}
              key={`${value}_${colIndex}`}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default AnswerButtons;
