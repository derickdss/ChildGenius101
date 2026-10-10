import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Renders the four answer options for an English question in a 2x2 grid.
// options: [{ label, emoji? }]
// chosenIndex: index of the option the kid tapped (null before answering)
// correctIndex: index of the correct option (used for colouring after answering)
export default function EnglishAnswerButtons({ options, chosenIndex, correctIndex, onPick }) {
  const answered = chosenIndex !== null && chosenIndex !== undefined;
  const rows = [];
  for (let i = 0; i < options.length; i += 2) rows.push(options.slice(i, i + 2));

  return (
    <View style={{ width: "100%" }}>
      {rows.map((row, rowIndex) => (
        <View style={{ flexDirection: "row", marginBottom: 10 }} key={rowIndex}>
          {row.map((opt, i) => {
            const index = rowIndex * 2 + i;
            let bg = "#fff";
            if (answered) {
              if (index === correctIndex) bg = "#C8E6C9";
              else if (index === chosenIndex) bg = "#FFCDD2";
            }
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onPick(index)}
                disabled={answered}
                style={{
                  flex: 1,
                  margin: 5,
                  backgroundColor: bg,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: "#7E57C2",
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                {opt.emoji ? <Text style={{ fontSize: 30 }}>{opt.emoji}</Text> : null}
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
