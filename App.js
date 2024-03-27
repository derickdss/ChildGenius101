import react from 'react';
// import { StatusBar } from 'expo-status-bar';
import Addition from './components/Addition';
import Subtraction from './components/Subtraction';
import Multiplication from './components/Multiplication';
import Division from './components/Division';
import PracticeChallenge from './components/PracticeChallenge';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home';
import Decimal from './components/Decimal';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Child Genius',
            headerStyle: {
              backgroundColor: 'rgb(82, 82, 194)',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Addition"
          component={Addition}
          options={{
            title: 'Addition',
            headerStyle: {
              backgroundColor: 'rgb(82, 82, 194)'
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Subtraction"
          component={Subtraction}
          options={{
            title: 'Subtraction',
            headerStyle: {
              backgroundColor: 'rgb(82, 82, 194)'
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Multiplication"
          component={Multiplication}
          options={{
            title: 'Multiplication',
            headerStyle: {
              backgroundColor: 'rgb(82, 82, 194)'
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Division"
          component={Division}
          options={{
            title: 'Division',
            headerStyle: {
              backgroundColor: 'rgb(82, 82, 194)'
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Decimal"
          component={Decimal}
          options={{
            title: 'Decimal',
            headerStyle: {
              backgroundColor: 'rgb(82, 82, 194)'
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="PracticeChallenge"
          component={PracticeChallenge}
          options={{
            title: 'Practice or Challenge?',
            headerStyle: {
              backgroundColor: 'rgb(82, 82, 194)'
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
