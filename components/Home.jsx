import { Text, View, Button } from "react-native";

export default function Home({ navigation }) {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <View style={{ width: 250 }}>
                <View>
                    <Button
                        style={{}}
                        title={"Addition"}
                        onPress={() => navigation.navigate('PracticeChallenge', {operation :'Addition'})}
                    />
                    {/* I see the button text used from the title tag, 
                    dont see the purpose of the content here */}
                    {/* Math{" "}
                    </Button> */}
                </View>
                <View style={{ marginTop: 10 }}>
                    <Button
                        style={{}}
                        title={"Subtraction"}
                        onPress={() => navigation.navigate('PracticeChallenge', {operation :'Subtraction'})}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Button
                        style={{}}
                        title={"Multiplication"}
                        onPress={() => navigation.navigate('PracticeChallenge', {operation :'Multiplication'})}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Button
                        style={{}}
                        title={"Division"}
                        onPress={() => navigation.navigate('PracticeChallenge', {operation :'Division'})}
                    />
                </View>
            </View>
        </View>
    );
}
