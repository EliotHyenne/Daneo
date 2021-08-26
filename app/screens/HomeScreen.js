import React, { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, TouchableWithoutFeedback, Platform, StatusBar, View } from "react-native";
import { COLORS } from "../config/colors.js";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useAppState } from "@react-native-community/hooks";

const HomeScreen = ({ navigation }) => {
  const [wordListFound, setWordListFound] = useState(false);
  const [wordListLength, setWordListLength] = useState(0);
  const [numNewWords, setNumNewWords] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const appState = useAppState();

  //Re-render when going to this screen through navigation to update states
  React.useEffect(() => {
    return navigation.addListener("focus", () => {
      setWordListFound(false);
    });
  }, [navigation]);

  const getCounters = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");

    if (!currentWordList) {
      setWordListLength(0);
    } else {
      setWordListLength(JSON.parse(currentWordList).length);
      let newWordsCounter = 0;
      let reviewsCounter = 0;

      for (let word of JSON.parse(currentWordList)) {
        let currentWordObject = JSON.parse(await AsyncStorage.getItem(word));

        if (currentWordObject.learn) {
          newWordsCounter++;
        } else if (currentWordObject.nextReview - Date.now() <= 0) {
          currentWordObject.review = true;
          reviewsCounter++;
          await AsyncStorage.setItem(word, JSON.stringify(currentWordObject));
        }
      }
      setNumReviews(reviewsCounter);
      setNumNewWords(newWordsCounter);
    }
    setWordListFound(true);
  };

  if (!wordListFound) {
    getCounters();
  }

  useEffect(() => {
    if (appState !== "active") {
      console.log("Inactive");
      try {
        const setAppBadgeCount = Notifications.setBadgeCountAsync(numReviews);
        console.log("Badge count number set to " + numReviews);
      } catch (err) {
        console.log("did not manage to show notif app badge count!", err);
      }
    }
  }, [appState]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Settings", { title: "SETTINGS" })}>
        <Ionicons style={styles.settings} name="settings-sharp" size={24} color="white" />
      </TouchableWithoutFeedback>
      <ScrollView>
        <View>
          <View style={{ top: Platform.OS === "ios" ? 50 : 0 }}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("WordList", { title: "WORD LIST" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_red }]}>{"WORDS" + " (" + wordListLength + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("LearnWord", { title: "LEARN WORD" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_blue }]}>{"LEARN" + " (" + numNewWords + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("Review", { title: "REVIEW" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_yellow }]}>{"REVIEW" + " (" + numReviews + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("AddWord", { title: "ADD WORD" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_green }]}>ADD</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
      <Text style={{ fontFamily: "Roboto-Regular", fontSize: 15, color: "white", margin: 5 }}>1.0.3</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 40 : 0,
  },
  button: {
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: 25,
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    fontSize: 25,
    color: "white",
    width: 300,
    height: 100,
    overflow: "hidden",
    lineHeight: Platform.OS === "ios" ? 100 : null,
  },
  settings: {
    alignSelf: "flex-end",
    margin: 20,
    marginTop: 0,
  },
});

export default HomeScreen;
