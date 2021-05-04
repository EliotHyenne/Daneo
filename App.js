import React from 'react';
import HomeScreen from './app/screens/HomeScreen';
import AddWordScreen from './app/screens/AddWordScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App () {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="AddWord" component={AddWordScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;