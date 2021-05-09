import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, TouchableWithoutFeedback, Platform, StatusBar, View } from "react-native";
import { COLORS } from "../config/colors.js";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [vocabListFound, setVocabListFound] = useState(false);
  const [vocabListLength, setVocabListLength] = useState(0);
  const [numNewWords, setNumNewWords] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  //Re-render when going to this screen through navigation to update states
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setVocabListFound(false);
    });
    return unsubscribe;
  }, [navigation]);

  const getCounters = async () => {
    const currentVocabList = await AsyncStorage.getItem("@vocabList");

    if (!currentVocabList) {
      setVocabListLength(0);
    } else {
      const vocabList = JSON.parse(currentVocabList);
      setVocabListLength(vocabList.length);
      var newWordsCounter = 0;
      var reviewsCounter = 0;
      for (var i = 0; i < vocabList.length; i++) {
        if (vocabList[i].level == "Unseen") {
          newWordsCounter++;
        } else {
          reviewsCounter++;
        }
      }
      setNumReviews(reviewsCounter);
      setNumNewWords(newWordsCounter);
    }
    setVocabListFound(true);
  };

  if (!vocabListFound) {
    getCounters();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={{ top: Platform.OS === "ios" ? 50 : 0 }}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("WordList", { title: "WORD LIST" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_red }]}>{"WORDS" + " (" + vocabListLength + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("LESSON")}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_blue }]}>{"LEARN" + " (" + numNewWords + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("REVIEW")}>
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
