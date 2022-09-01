import { Text, View, Button } from "react-native";
import styles from "../styles/App.styles";

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
                        onPress={() => navigation.navigate("Addition")}
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
                        onPress={() => navigation.navigate("Subtraction")}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Button
                        style={{}}
                        title={"Multiplication"}
                        onPress={() => navigation.navigate("Multiplication")}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Button
                        style={{}}
                        title={"Division"}
                        onPress={() => navigation.navigate("Division")}
                    />
                </View>
            </View>
        </View>
    );
}
