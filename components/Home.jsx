import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Top-level menu: one card per subject. The card's screen name matches the
// React Navigation screen name registered in App.js.
const SUBJECTS = [
  { name: "Math", symbol: "🔢", color: "#4CAF50", subtitle: "Addition, subtraction & more" },
  { name: "English", symbol: "📖", color: "#7E57C2", subtitle: "Phonics, words & spelling" },
];

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#F3F0FF" }}>
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "rgb(57, 61, 241)",
            marginBottom: 20,
          }}
        >
          Choose a subject!
        </Text>
        {SUBJECTS.map((subject) => (
          <TouchableOpacity
            key={subject.name}
            onPress={() => navigation.navigate(subject.name)}
            activeOpacity={0.8}
            style={{
              width: 280,
              backgroundColor: subject.color,
              borderRadius: 16,
              padding: 24,
              marginBottom: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 48 }}>{subject.symbol}</Text>
            <Text style={{ fontSize: 26, fontWeight: "bold", color: "white", marginTop: 6 }}>
              {subject.name}
            </Text>
            <Text style={{ fontSize: 14, color: "white", marginTop: 4 }}>{subject.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
