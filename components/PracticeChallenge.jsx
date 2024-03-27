import { useState } from "react";
import { View, Button } from "react-native";
import TouchableOpacityButton from "./TouchableOpacityButton";

export default function PracticeChallenge({ navigation, route }) {
    const [mathLevel, setMathLevel] = useState(4);
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
    const easyMaxLevel = levelCategories[0].maxLevel;

    const categorySwitcher = (category) => {
        const catLevel = levelCategories.findIndex(
            (cat) => cat.category === category
        );
        setMathLevel(levelCategories[catLevel][`maxLevel`]);
    };

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
                                        marginLeft: index !== 0 ? 5 : 0,
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
                            alignItems: 'center',
                            margin: 4,
                        }}
                    >
                        {levels.map((level, index) => (
                            <TouchableOpacityButton
                                key={`${index}_${level}`}
                                title={level}
                                mathLevel={mathLevel}
                                onPress={() =>
                                    level <= 4
                                        ? setMathLevel(easyMaxLevel)
                                        : setMathLevel(level)
                                }
                                style={{
                                    width: level === mathLevel ? 30 : 23,
                                    height: level === mathLevel ? 30 : 23,
                                    fontSize: 10,
                                    borderRadius: 100,
                                    textDecoration: level === mathLevel ? 'underline' : 'none',
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
