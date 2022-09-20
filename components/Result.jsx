import react from "react";
import { Text, Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ResultStatement = ({ result }) => {
    const correctAnswerCount = result.filter((res)=> res.answerCorrect).length;
    const wrongAnswerCount = result.length - correctAnswerCount;
    return (
        <Text style={{fontSize:20, fontWeight: 500}}>
            You Scored{" "}
            <Text style={{ color: "green" }}>{correctAnswerCount}</Text> correct
            and <Text style={{ color: "red" }}>{wrongAnswerCount}</Text>{" "}
            incorrect answers
        </Text>
    );
};

const ResultOptions = ({ reloadPage }) => {
    const navigation = useNavigation();
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                margin: 10,
            }}
        >
            <View style={{ flexGrow: 1, marginLeft: 10, marginRight: 5 }}>
                <Button title="Retake" onPress={reloadPage} />
            </View>
            <View style={{ flexGrow: 1, marginLeft: 10, marginRight: 5 }}>
                <Button
                    title="Home"
                    onPress={() => navigation.navigate("Home")}
                />
            </View>
        </View>
    );
};

const Answers = ({result}) => {
    return (
        <div style={{ marginTop:25}}>
            <span style={{marginTop: 20}}>Answers:</span>
            <div style={{display: 'flex', justifyContent:'center'}}>   
                    <ul>
                    {result.map((res, i) => (
                        <li key={i}>
                            {res.question}
                            <span style={{
                                textDecoration: res.answerInput !== res.correctAnswer ? 'under-line' : 'none',
                                color: res.answerInput === res.correctAnswer ? 'green' : 'red', 
                            }}>
                                {res.answerInput}
                            </span>
                            { res.answerInput !== res.correctAnswer &&
                                <span style={{color:  'green'}}>
                                    {` => ${res.correctAnswer}`}
                                </span>
                            }
                        </li>
                    ))}
                    </ul>
            </div>
        </div>
    )
}

const Result = ({ correctAnswerCount, wrongAnswerCount, reloadPage, result }) => {
    return (
        <>
            <ResultStatement
                correctAnswerCount={correctAnswerCount}
                wrongAnswerCount={wrongAnswerCount}
                result={result}
            />
            <ResultOptions reloadPage={reloadPage} />
            <Answers result={result}/>
        </>
    );
};

export default Result;
