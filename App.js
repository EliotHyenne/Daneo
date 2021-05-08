import React from "react";
import HomeScreen from "./app/screens/HomeScreen";
import AddWordScreen from "./app/screens/AddWordScreen";
import WordListScreen from "./app/screens/WordListScreen";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import * as Device from "expo-device";
import { COLORS } from "./app/config/colors";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { RootSiblingParent } from "react-native-root-siblings";

const Stack = createStackNavigator();

const App = () => {
  const modelNames = [
    "iPhone 5",
    "iPhone 5s",
    "iPhone 6",
    "iPhone 6 Plus",
    "iPhone 6s",
    "iPhone 6s Plus",
    "iPhone 7",
    "iPhone 7 Plus",
    "iPhone 8",
    "iPhone 8 Plus",
  ];
  const [isLoaded] = useFonts({
    "Roboto-Black": require("./app/assets/fonts/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("./app/assets/fonts/Roboto-BlackItalic.ttf"),
    "Roboto-Bold": require("./app/assets/fonts/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("./app/assets/fonts/Roboto-BoldItalic.ttf"),
    "Roboto-Italic": require("./app/assets/fonts/Roboto-Italic.ttf"),
    "Roboto-Light": require("./app/assets/fonts/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("./app/assets/fonts/Roboto-LightItalic.ttf"),
    "Roboto-Medium": require("./app/assets/fonts/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("./app/assets/fonts/Roboto-MediumItalic.ttf"),
    "Roboto-Regular": require("./app/assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Thin": require("./app/assets/fonts/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("./app/assets/fonts/Roboto-ThinItalic.ttf"),
  });

  if (!isLoaded) {
    return <AppLoading />;
  } else {
    return (
      <RootSiblingParent>
        <NavigationContainer>
          {modelNames.includes(Device.modelName) ? (
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                  headerShown: false,
                })}
                headerShown={false}
              />
              <Stack.Screen
                name="AddWord"
                component={AddWordScreen}
                options={({ navigation }) => ({
                  title: "",
                  headerStyle: {
                    backgroundColor: COLORS.pastel_purple,
                    borderBottomColor: COLORS.pastel_purple,
                    shadowOffset: {
                      height: 0,
                    },
                  },
                  headerLeft: () => (
                    <View style={{ marginLeft: 15 }}>
                      <AntDesign
                        name="arrowleft"
                        size={20}
                        color="white"
                        onPress={() => navigation.navigate("Home")}
                      />
                    </View>
                  ),
                })}
              />
              <Stack.Screen
                name="WordList"
                component={WordListScreen}
                options={({ navigation }) => ({
                  title: "",
                  headerStyle: {
                    backgroundColor: COLORS.pastel_purple,
                    borderBottomColor: COLORS.pastel_purple,
                    shadowOffset: {
                      height: 0,
                    },
                  },
                  headerLeft: () => (
                    <View style={{ marginLeft: 15 }}>
                      <AntDesign
                        name="arrowleft"
                        size={20}
                        color="white"
                        onPress={() => navigation.navigate("Home")}
                      />
                    </View>
                  ),
                })}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AddWord" component={AddWordScreen} />
              <Stack.Screen name="WordList" component={WordListScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </RootSiblingParent>
    );
  }
};

export default App;
