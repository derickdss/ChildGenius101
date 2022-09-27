import { useState } from "react";
import { View, Button, Text } from "react-native";
import TouchableOpacityButton from "./TouchableOpacityButton";

export default function PracticeChallenge({ navigation, route }) {
    const [mathLevel, setMathLevel] = useState(2);
    const levelCategories = [
        {
            category: "Easy",
            maxLevel: 4,
            minLevel: 2,
            textWidth: 70,
            color: "yellow",
        },
        {
            category: "Medium",
            maxLevel: 8,
            minLevel: 5,
            textWidth: 95,
            color: "orange",
        },
        {
            category: "Hard",
            maxLevel: 12,
            minLevel: 9,
            textWidth: 90,
            color: "red",
        },
        /*{ category: "Epic", maxLeveL: 15, minLevel: 13}*/
    ];
    const levels = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 /*, 13, 14, 15*/];

    const categorySwitcher = (category) => {
        const catLevel = levelCategories.findIndex(
            (cat) => cat.category === category
        );
        console.log(
            "derd, cat finder",
            levelCategories.findIndex((cat) => cat.category === category)
        );
        setMathLevel(levelCategories[catLevel][`maxLevel`]);
    };

    console.log("derd, minLevel", levelCategories[0].minLevel);

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <View style={{ width: 250 }}>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginVertical: 50,
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginLeft: -10,
                            marginBottom: 5,
                        }}
                    >
                        {levelCategories.map((category, index) => (
                            <View
                                key={`${index}_${category.category}_${category.minLevel}`}
                                onClick={() =>
                                    categorySwitcher(category.category)
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <TouchableOpacityButton
                                    key={`${index}_${category.category}_${category.minLevel}`}
                                    title={`${category.category}`}
                                    style={{
                                        marginLeft: 5,
                                        width: category.textWidth,
                                        height: 20,
                                        justifyContent: "center",
                                        backgroundColor: category.color,
                                        fontWeight: "bold",
                                    }}
                                    onPress={() =>
                                        categorySwitcher(category.category)
                                    }
                                />
                            </View>
                        ))}
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        {levels.map((level, index) => (
                            <TouchableOpacityButton
                                key={`${index}_${level}`}
                                title={level}
                                mathLevel={mathLevel}
                                onPress={() =>
                                    level > 2 ? setMathLevel(level) : null
                                }
                                style={{
                                    width: 25,
                                    height: 25,
                                    fontSize: 10,
                                    borderRadius: 100,
                                    backgroundColor:
                                        level > mathLevel
                                            ? "lightgrey"
                                            : "grey",
                                    justifyContent: "center",
                                }}
                            />
                        ))}
                    </View>
                </View>
                <View>
                    <Button
                        style={{}}
                        title={"Practice"}
                        onPress={() =>
                            navigation.navigate(route.params.operation, {
                                mode: "Practice",
                                mathLevel: mathLevel,
                            })
                        }
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
                        onPress={() =>
                            navigation.navigate(route.params.operation, {
                                mode: "Challenge",
                                mathLevel: mathLevel,
                            })
                        }
                    />
                </View>
            </View>
        </View>
    );
}
