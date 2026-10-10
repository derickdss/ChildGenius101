import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { loadStats } from "../utils/storage";

// English sub-skills. Each one navigates to its own quiz flow:
// EnglishMenu -> PracticeChallenge -> EnglishScreen (skill).
const SKILLS = [
  { name: "Phonics", symbol: "🔤", color: "#7E57C2", subtitle: "Letter sounds & CVC words" },
  { name: "Sight Words", symbol: "📖", color: "#26A69A", subtitle: "Words you know by sight" },
  { name: "Spelling", symbol: "✏️", color: "#FF7043", subtitle: "Missing letters & pictures" },
  { name: "Phonemes", symbol: "🔊", color: "#42A5F5", subtitle: "The sounds in words" },
  { name: "Syllables", symbol: "👏", color: "#FFA726", subtitle: "Clap the beats" },
];

export default function EnglishMenu({ navigation }) {
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
          SKILLS.map((skill) => {
            const practiceBest = (stats.bestPractice && stats.bestPractice[skill.name]) || 0;
            const challengeBest = (stats.bestChallenge && stats.bestChallenge[skill.name]) || 0;
            return (
              <TouchableOpacity
                key={skill.name}
                onPress={() => navigation.navigate("PracticeChallenge", { skill: skill.name })}
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
                <Text style={{ fontSize: 13, color: "white", marginTop: 4 }}>{skill.subtitle}</Text>
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
