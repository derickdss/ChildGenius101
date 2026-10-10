import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { loadStats } from "../utils/storage";

const OPERATIONS = [
  { name: "Addition", symbol: "+", color: "#4CAF50" },
  { name: "Subtraction", symbol: "−", color: "#2196F3" },
  { name: "Multiplication", symbol: "×", color: "#FF9800" },
  { name: "Division", symbol: "÷", color: "#9C27B0" },
  { name: "Decimal", symbol: ".", color: "#F44336" },
];

export default function MathMenu({ navigation }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    loadStats().then((all) => {
      if (mounted) setStats(all);
    });
    return () => {
      mounted = false;
    };
  }, []);

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
        {stats && stats.totalGames > 0 && (
          <Text style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
            Games played: {stats.totalGames} • Correct answers: {stats.totalCorrect}
          </Text>
        )}
        {stats === null ? (
          <ActivityIndicator size="large" color="rgb(82, 82, 194)" style={{ marginTop: 40 }} />
        ) : (
          OPERATIONS.map((op) => {
            const practiceBest = (stats.bestPractice && stats.bestPractice[op.name]) || 0;
            const challengeBest = (stats.bestChallenge && stats.bestChallenge[op.name]) || 0;
            return (
              <TouchableOpacity
                key={op.name}
                onPress={() => navigation.navigate("PracticeChallenge", { operation: op.name })}
                activeOpacity={0.8}
                style={{
                  width: 260,
                  backgroundColor: op.color,
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
                <Text style={{ fontSize: 40, fontWeight: "bold", color: "white" }}>
                  {op.symbol}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
                  {op.name}
                </Text>
                {practiceBest > 0 || challengeBest > 0 ? (
                  <Text style={{ fontSize: 14, color: "white", marginTop: 6 }}>
                    🏆 Practice best: {practiceBest} • ⏱ Challenge best: {challengeBest}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 14, color: "white", marginTop: 6 }}>
                    Not played yet — try it!
                  </Text>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
