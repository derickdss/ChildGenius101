import React, { useState } from "react";
import { View } from "react-native";
import QuestionBlock from "./QuestionBlock";
import Result from "./Result";

/**
 * Single screen used by all five operations (Addition, Subtraction, ...).
 * Previously each operation had its own nearly identical file.
 */
const OperationScreen = ({ operation, route }) => {
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
        <QuestionBlock
          operation={operation}
          mode={route.params.mode}
          mathLevel={route.params.mathLevel}
          onQuizComplete={handleQuizComplete}
        />
      ) : (
        <Result
          mode={route.params.mode}
          result={results}
          reloadPage={reloadPage}
          gameStats={gameStats}
        />
      )}
    </View>
  );
};

export default OperationScreen;
