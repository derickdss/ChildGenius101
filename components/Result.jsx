import React from "react";
import { Button, FlatList, SafeAreaView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const computeBestStreak = (result) => {
  let best = 0;
  let current = 0;
  result.forEach((item) => {
    current = item.answerCorrect ? current + 1 : 0;
    if (current > best) best = current;
  });
  return best;
};

const ResultStatement = ({ mode, result, gameStats }) => {
  const correctAnswerCount = result.filter((res) => res.answerCorrect).length;
  const wrongAnswerCount = result.length - correctAnswerCount;
  const bestStreak = computeBestStreak(result);
  const timePerQuestion =
    mode === "Challenge" && result.length ? (60 / result.length).toFixed(1) : null;

  return (
    <View style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>You Scored</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}>
        <Text style={{ color: "green" }}>{` ${correctAnswerCount} `}</Text>
        correct and{" "}
        <Text style={{ color: "red" }}>{` ${wrongAnswerCount} `}</Text>
        incorrect answers
      </Text>
      {bestStreak >= 2 && (
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 6 }}>
          🔥 Best streak: {bestStreak} in a row!
        </Text>
      )}
      {timePerQuestion && (
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 6 }}>
          {`${timePerQuestion}s per question`}
        </Text>
      )}
      {gameStats?.isNewBest ? (
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "orange", marginTop: 8 }}>
          🏆 New best score!
        </Text>
      ) : gameStats && gameStats.best > 0 ? (
        <Text style={{ fontSize: 16, marginTop: 8 }}>
          Your {mode === "Challenge" ? "challenge" : "practice"} best: {gameStats.best}
        </Text>
      ) : null}
    </View>
  );
};

const ResultOptions = ({ reloadPage }) => {
  const navigation = useNavigation();
  return (
    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: 10 }}>
      <View style={{ marginLeft: 10, marginRight: 5, width: 80 }}>
        <Button title="Retake" onPress={reloadPage} />
      </View>
      <View style={{ marginLeft: 10, marginRight: 5, width: 80 }}>
        <Button title="Home" onPress={() => navigation.navigate("Home")} />
      </View>
    </View>
  );
};

const Answers = ({ result }) => (
  <SafeAreaView style={{ paddingTop: 10, flex: 1, paddingLeft: 20 }}>
    <Text style={{ fontWeight: "bold" }}>Answers:</Text>
    <FlatList
      data={result}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <View>
          <Text>
            {item.question}
            <Text style={{ color: item.answerCorrect ? "green" : "red" }}>
              {item.answerInput}
              {!item.answerCorrect && (
                <Text>
                  {" → "}
                  {item.correctAnswer}
                </Text>
              )}
            </Text>
          </Text>
        </View>
      )}
    />
  </SafeAreaView>
);

const Result = ({ mode, result, reloadPage, gameStats }) => {
  return (
    <View style={{ display: "flex", justifyContent: "center", marginTop: -50 }}>
      <ResultStatement result={result} mode={mode} gameStats={gameStats} />
      <ResultOptions reloadPage={reloadPage} />
      {result.length > 0 && <Answers result={result} />}
    </View>
  );
};

export default Result;
