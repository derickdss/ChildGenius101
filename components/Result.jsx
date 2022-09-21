import react, {useState, useEffect} from "react";
import { Text, Button, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ResultStatement = ({ result, resultTime }) => {
    const correctAnswerCount = result.filter((res)=> res.answerCorrect).length;
    const wrongAnswerCount = result.length - correctAnswerCount;
    const [showText, setShowText] = useState(true);
    useEffect(() => {
        // Change the state every second or the time given by User.
        const interval = setInterval(() => {
          setShowText((showText) => !showText);
        }, 500);
        return () => clearInterval(interval);
      }, []);
    
    return (
        <Text style={{fontSize:20, fontWeight: 'bold', width: 550, display: 'flex', flexDirection: 'column', alignItems:'center'}}>
            <Text>You Scored</Text>
            <Text><Text style={{ color: "green" }}>{` ${correctAnswerCount} `}</Text>correct and </Text>
            <Text><Text style={{ color: "red" }}>{` ${wrongAnswerCount} `}</Text>incorrect answers</Text>
            <Text>{showText && resultTime ? <Text>{`Time: ${resultTime}`}</Text> :<Text>         </Text>}</Text>
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
                justifyContent: "center",
                margin: 10,
            }}
        >
            <View style={{  marginLeft: 10, marginRight: 5 }}>
                <Button title="Retake" onPress={reloadPage} />
            </View>
            <View style={{ marginLeft: 10, marginRight: 5 }}>
                <Button
                    title="Home"
                    onPress={() => navigation.navigate("Home")}
                />
            </View>
        </View>
    );
};

const Answers = ({result}) => {
    return(
        <View style={{ marginTop:25, alignItems:'center'}}>
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
                                color: item.answerInput === item.correctAnswer ? 'green' : 'red', 
                            }}>
                                {item.answerInput}
                                { item.answerInput !== item.correctAnswer ?
                                    <Text style={{color:  'green'}}>
                                        {` => ${item.correctAnswer}`}
                                    </Text>:
                                    null
                                }
                        </Text>
                        
                        </Text>
                    </View>
                } />                
            </View>
        </View>
    )}

const Result = ({ correctAnswerCount, wrongAnswerCount, reloadPage, result, resultTime }) => {
    console.log('derd, result time', resultTime)
    return (
        <View style={{display:'flex', justifyContent:'center'}}>
            <ResultStatement
                result={result}
                resultTime={resultTime}
            />
            <ResultOptions reloadPage={reloadPage} />
            <Answers result={result}/>
        </View>
    );
};

export default Result;
