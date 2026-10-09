import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// English sub-skills. Add to this list as you build them out.
// Each one will eventually navigate to its own lesson/quiz flow,
// mirroring how MathMenu -> PracticeChallenge -> OperationScreen works.
const SKILLS = [
  { name: "Phonics", symbol: "🔤", color: "#7E57C2" },
  { name: "Sight Words", symbol: "📖", color: "#26A69A" },
  { name: "Spelling", symbol: "✏️", color: "#FF7043" },
];

export default function EnglishMenu({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#F3F0FF" }}>
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "rgb(57, 61, 241)",
            marginBottom: 8,
          }}
        >
          Pick a skill to practice!
        </Text>
        {SKILLS.map((skill) => (
          <TouchableOpacity
            key={skill.name}
            // TODO: wire up navigation to the real English screens once built.
            onPress={() => {}}
            activeOpacity={0.8}
            style={{
              width: 260,
              backgroundColor: skill.color,
              borderRadius: 16,
              padding: 16,
              marginBottom: 14,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 40 }}>{skill.symbol}</Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
              {skill.name}
            </Text>
            <Text style={{ fontSize: 14, color: "white", marginTop: 6 }}>Coming soon</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
