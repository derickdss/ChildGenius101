import React, { useState } from "react";
import { View } from "react-native";
import EnglishQuestionBlock from "./EnglishQuestionBlock";
import SpellingDictation from "./SpellingDictation";
import Result from "./Result";

// Wrapper for one English skill (Phonics, Sight Words, Spelling, Phonemes, Syllables).
// Runs the quiz, then shows the Result screen with the game stats.
const EnglishScreen = ({ skill, route }) => {
  const [results, setResults] = useState([]);
  const [gameStats, setGameStats] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleQuizComplete = (finalResults, stats) => {
    setResults(finalResults);
    setGameStats(stats || null);
    setQuizComplete(true);
  };

  const reloadPage = () => {
    setResults([]);
    setQuizComplete(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F0FF", alignItems: "center" }}>
      {!quizComplete ? (
        skill === "Spelling" ? (
          <SpellingDictation mode={route.params.mode} onQuizComplete={handleQuizComplete} />
        ) : (
          <EnglishQuestionBlock skill={skill} mode={route.params.mode} onQuizComplete={handleQuizComplete} />
        )
      ) : (
        <Result mode={route.params.mode} result={results} reloadPage={reloadPage} gameStats={gameStats} />
      )}
    </View>
  );
};

export default EnglishScreen;
