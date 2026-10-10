import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import TouchableOpacityButton from "./TouchableOpacityButton";

const LEVEL_CATEGORIES = [
  { category: "Easy", maxLevel: 4, color: "#FFD54F" },
  { category: "Medium", maxLevel: 8, color: "#FFA726" },
  { category: "Hard", maxLevel: 12, color: "#EF5350" },
];

const LEVELS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const BigButton = ({ title, onPress, color, marginTop }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={{
      backgroundColor: color,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      marginTop,
    }}
  >
    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{title}</Text>
  </TouchableOpacity>
);

export default function PracticeChallenge({ navigation, route }) {
  const [mathLevel, setMathLevel] = useState(4);
  // English skills (Phonics, Sight Words, ...) arrive with route.params.skill
  // and skip the level picker; math operations use route.params.operation.
  const isEnglish = Boolean(route.params.skill);
  const target = isEnglish ? route.params.skill : route.params.operation;

  const categorySwitcher = (category) => {
    const cat = LEVEL_CATEGORIES.find((c) => c.category === category);
    if (cat) setMathLevel(cat.maxLevel);
  };

  const navParams = (mode) =>
    isEnglish ? { mode } : { mode, mathLevel };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F3F0FF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ width: 280 }}>
        {isEnglish ? (
          <Text style={{ textAlign: "center", fontSize: 16, marginBottom: 20, color: "#444" }}>
            {target}: pick how to play!
          </Text>
        ) : (
          <>
            <Text style={{ textAlign: "center", fontSize: 16, marginBottom: 20, color: "#444" }}>
              Pick a level, then choose how to play.
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10 }}>
              {LEVEL_CATEGORIES.map((category, index) => (
                <TouchableOpacityButton
                  key={category.category}
                  title={category.category}
                  onPress={() => categorySwitcher(category.category)}
                  style={{
                    marginLeft: index !== 0 ? 5 : 0,
                    width: 80,
                    height: 26,
                    justifyContent: "center",
                    backgroundColor: category.color,
                    fontWeight: "bold",
                  }}
                />
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                margin: 4,
              }}
            >
              {LEVELS.map((level) => (
                <TouchableOpacityButton
                  key={level}
                  title={level}
                  onPress={() => setMathLevel(level)}
                  style={{
                    width: level === mathLevel ? 30 : 23,
                    height: level === mathLevel ? 30 : 23,
                    fontSize: 10,
                    borderRadius: 100,
                    backgroundColor: level > mathLevel ? "lightgrey" : "grey",
                    justifyContent: "center",
                  }}
                />
              ))}
            </View>
            <Text style={{ textAlign: "center", marginVertical: 12, color: "#555", fontWeight: "bold" }}>
              Level {mathLevel}
            </Text>
          </>
        )}
        <BigButton
          title="Practice — 10 questions"
          onPress={() => navigation.navigate(target, navParams("Practice"))}
          color="#7E57C2"
        />
        <BigButton
          title="Challenge — beat the clock!"
          onPress={() => navigation.navigate(target, navParams("Challenge"))}
          color="#FF7043"
          marginTop={12}
        />
      </View>
    </View>
  );
}
