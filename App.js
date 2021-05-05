import React from 'react';
import HomeScreen from './app/screens/HomeScreen';
import AddWordScreen from './app/screens/AddWordScreen';
import { StyleSheet, SafeAreaView, Platform, View, ActivityIndicator, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons'; 
import * as Device from 'expo-device';
import { COLORS } from './app/config/colors';

const Stack = createStackNavigator();

function App () {
  const modelNames = ["iPhone 6", "iPhone 6 Plus", "iPhone 6s", "iPhone 6s Plus", "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus"]

  return (
    <NavigationContainer>
      {modelNames.includes(Device.modelName) ? 
        <Stack.Navigator initialRouteName="Home" >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options = {({ navigation }) => ({
              headerShown: false,
            })}
            headerShown={false}
          />
          <Stack.Screen 
            name="AddWord" 
            component={AddWordScreen}
            options={({ navigation }) => ({
              title: '',
              headerStyle: {
                backgroundColor: COLORS.pastel_purple,
                borderBottomColor: COLORS.pastel_purple,
                shadowOffset: {
                  height: 0,
                },
              },
              headerLeft: () => (
                <View style={{marginLeft: 15}}>
                  <AntDesign name="arrowleft" size={20} color="white" onPress ={() => navigation.navigate('Home')}/>
                </View>
              ),
            })}
          />
        </Stack.Navigator> : 
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="AddWord" component={AddWordScreen}/>
        </Stack.Navigator>}
    </NavigationContainer>
  );
}

export default App;