import { Text, View, Button } from "react-native";

export default function Math({ navigation }) {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <View style={{ width: 250 }}>
                <View style={{ marginBottom: 10 }}>
                    <Button
                        style={{}}
                        title={"Addition [2 + 3 = 5]"}
                        onPress={() => navigation.navigate("Addition")}
                    >
                        Addition (a + b){" "}
                    </Button>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Button
                        style={{}}
                        title={"Subtraction [4 - 2 = 2]"}
                        onPress={() => navigation.navigate("Subtraction")}
                    >
                        Subtraction (a - b){" "}
                    </Button>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Button
                        style={{}}
                        title={"Multiplication [3 * 3 = 9]"}
                        onPress={() => navigation.navigate("Multiplication")}
                    >
                        Multiplication (a * b){" "}
                    </Button>
                </View>
                <View>
                    <Button
                        style={{}}
                        title={"Division [6 / 2 = 3]"}
                        onPress={() => navigation.navigate("Division")}
                    >
                        Division (a / b){" "}
                    </Button>
                </View>
            </View>
        </View>
    );
}
