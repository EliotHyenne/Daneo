import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableNativeFeedback, Platform } from 'react-native';
import { COLORS } from '../config/colors.js';
import { useFonts } from "expo-font";
import AppLoading from 'expo-app-loading';

function HomeScreen ({ navigation }) {
  const [isLoaded] = useFonts({
    'Roboto-Black': require("../assets/fonts/Roboto-Black.ttf"),
    'Roboto-BlackItalic': require("../assets/fonts/Roboto-BlackItalic.ttf"),
    'Roboto-Bold': require("../assets/fonts/Roboto-Bold.ttf"),
    'Roboto-BoldItalic': require("../assets/fonts/Roboto-BoldItalic.ttf"),
    'Roboto-Italic': require("../assets/fonts/Roboto-Italic.ttf"),
    'Roboto-Light': require("../assets/fonts/Roboto-Light.ttf"),
    'Roboto-LightItalic': require("../assets/fonts/Roboto-LightItalic.ttf"),
    'Roboto-Medium': require("../assets/fonts/Roboto-Medium.ttf"),
    'Roboto-MediumItalic': require("../assets/fonts/Roboto-MediumItalic.ttf"),
    'Roboto-Regular': require("../assets/fonts/Roboto-Regular.ttf"),
    'Roboto-Thin': require("../assets/fonts/Roboto-Thin.ttf"),
    'Roboto-ThinItalic': require("../assets/fonts/Roboto-ThinItalic.ttf"),
  });

  if (!isLoaded) {
    return <AppLoading/>;
  }

  return (
    <SafeAreaView style={ styles.container }>
      <TouchableNativeFeedback onPress={() => console.log("WORDS")}>
        <Text style={ [styles.button, {backgroundColor:COLORS.pastel_orange}]}>
          WORDS
        </Text>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => console.log("LESSON")}>
        <Text style={ [styles.button, {backgroundColor:COLORS.pastel_blue}]}>
          LESSON
        </Text>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => console.log("REVIEW")}>
        <Text style={ [styles.button, {backgroundColor:COLORS.pastel_yellow}]}>
          REVIEW 
        </Text>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => navigation.navigate('AddWord', {
        title: "ADD WORD",
      })}>
        <Text style={ [styles.button, {backgroundColor:COLORS.pastel_green}]}>
          ADD 
        </Text>
      </TouchableNativeFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? 75 : 0,
  },
  title: {
    fontFamily: 'Roboto-Black',
    color: 'white',
  },
  button: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 25,
    borderRadius: 25,
    fontFamily: 'Roboto-Black',
    fontSize: 25,
    color: 'white',
    width: 300,
    height: 100,
  }
});

export default HomeScreen;