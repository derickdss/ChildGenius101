import { View, Button } from "react-native";

export default function Home({ navigation, route }) {
    console.log('derd, pract navigation', navigation)
    console.log('derd, pract route', route)
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <View style={{ width: 250 }}>
                <View>
                    <Button
                        style={{}}
                        title={"Practice"}
                        onPress={() => navigation.navigate(route.params.operation, {mode: 'Practice'})}
                    />
                    {/* I see the button text used from the title tag, 
                    dont see the purpose of the content here */}
                    {/* Math{" "}
                    </Button> */}
                </View>
                <View style={{ marginTop: 10 }}>
                    <Button
                        style={{}}
                        title={"Challenge"}
                        onPress={() => navigation.navigate(route.params.operation, {mode: 'Challenge'})}
                    />
                </View>
            </View>
        </View>
    );
}
