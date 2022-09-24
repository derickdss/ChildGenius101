import react, {useState} from "react";
import { View, Button } from "react-native";
import Buttons from "./Buttons";

const NumberPad = ({rows, values, setNumpadValue, setAnswerValue, backspaceNumpadValue}) => {
    const rowedValues = [[1,2,3],[4,5,6],[7,8,9]];

    return (
        <View >
            {
                rowedValues.map((row, index) => (
                
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                        key={`${row}_index`}
                    >
                        {
                            row.map(column => 
                                <Buttons
                                    answer={`${column}`}
                                    setAnswerValue={setNumpadValue}
                                    disabled={false}
                                    key={`${column}_index`}
                                    style={{
                                        margin: 4,
                                        width: 100
                                    }}
                                />
                            )
                        }
                    </View>
                ))
            }
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: 'center'
                }}
                key={`${0}_index`}
            >
                <Buttons
                    answer={`0`}
                    setAnswerValue={setNumpadValue}
                    disabled={false}
                    key={`0_index`}
                    style={{
                        margin: 4,                                       
                        width: 100
                    }}
                />
            </View>
            <View style={{
                            flexDirection: "row",
                        }}>
                
                <View style={{flex:1}}>
                    <Button
                        title={'Enter'} onPress={setAnswerValue} disabled={false} color={'green'} 
                    />
                </View>
                <View style={{flex:1, marginLeft: 10}}>
                    <Button
                        title={'|<- Backspace'} onPress={backspaceNumpadValue} disabled={false} color={'green'} style={{flex:1, marginLeft: 10}}
                    />
                </View>
            </View>
        </View>
    )
}

export default NumberPad;