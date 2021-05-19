import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, TouchableWithoutFeedback, Platform, StatusBar, View } from "react-native";
import { COLORS } from "../config/colors.js";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [wordListFound, setWordListFound] = useState(false);
  const [wordListLength, setWordListLength] = useState(0);
  const [numNewWords, setNumNewWords] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

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
      var newWordsCounter = 0;
      var reviewsCounter = 0;

      for (let word of JSON.parse(currentWordList)) {
        var currentWordObject = JSON.parse(await AsyncStorage.getItem(word));

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

  return (
    <SafeAreaView style={styles.container}>
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
    ...Platform.select({
      ios: {
        lineHeight: 100, // as same as height
      },
      android: {},
    }),
  },
});

export default HomeScreen;
