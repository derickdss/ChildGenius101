import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import MathMenu from "./components/MathMenu";
import EnglishMenu from "./components/EnglishMenu";
import OperationScreen from "./components/OperationScreen";
import PracticeChallenge from "./components/PracticeChallenge";

const HEADER_OPTIONS = {
  headerStyle: {
    backgroundColor: "rgb(82, 82, 194)",
  },
  headerTintColor: "#fff",
  headerTitleAlign: "center",
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const OPERATIONS = ["Addition", "Subtraction", "Multiplication", "Division", "Decimal"];

const makeOperationScreen = (operation) => {
  const Screen = (props) => <OperationScreen operation={operation} {...props} />;
  return Screen;
};

// Built once at module level so component identity stays stable across renders.
const OPERATION_SCREENS = OPERATIONS.map((name) => ({
  name,
  component: makeOperationScreen(name),
}));

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={HEADER_OPTIONS}>
        <Stack.Screen name="Home" component={Home} options={{ title: "Child Genius" }} />
        <Stack.Screen name="Math" component={MathMenu} options={{ title: "Math" }} />
        <Stack.Screen name="English" component={EnglishMenu} options={{ title: "English" }} />
        {OPERATION_SCREENS.map(({ name, component }) => (
          <Stack.Screen key={name} name={name} component={component} options={{ title: name }} />
        ))}
        <Stack.Screen
          name="PracticeChallenge"
          component={PracticeChallenge}
          options={{ title: "Practice or Challenge?" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
