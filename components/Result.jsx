import react from "react";
import { Text, Button, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ResultStatement = ({ result }) => {
    const correctAnswerCount = result.filter((res)=> res.answerCorrect).length;
    const wrongAnswerCount = result.length - correctAnswerCount;
    return (
        <Text style={{fontSize:20, fontWeight: 'bold'}}>
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

const Answers = ({result}) => (
        <View style={{ marginTop:25}}>
            <Text style={{fontWeight: 'bold', marginTop: 20}}>Answers:</Text>
            <View style={{alignItems:'center'}}>
            <FlatList 
                data={result}
                renderItem={({item, index}) => 
                    <View>
                        <Text>
                            {item.question}
                        <Text 
                            style={{
                                textDecoration: item.answerInput !== item.correctAnswer ? 'under-line' : 'none',
                                color: item.answerInput === item.correctAnswer ? 'green' : 'red', 
                            }}>
                                {item.answerInput}{ item.answerInput !== item.correctAnswer &&
                            <Text style={{color:  'green'}}>
                                {` => ${item.correctAnswer}`}
                            </Text>
                        }
                        </Text>
                        
                        </Text>
                    </View>
                } />
                
                
            </View>
        </View>
    )

const Result = ({ correctAnswerCount, wrongAnswerCount, reloadPage, result }) => {
    return (
        <View style={{display:'flex', justifyContent:'center'}}>
            <ResultStatement
                correctAnswerCount={correctAnswerCount}
                wrongAnswerCount={wrongAnswerCount}
                result={result}
            />
            <ResultOptions reloadPage={reloadPage} />
            <Answers result={result}/>
        </View>
    );
};

export default Result;
