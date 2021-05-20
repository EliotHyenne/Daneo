import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Platform, Text, View, TouchableWithoutFeedback } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReviewScreen = ({ route, navigation }) => {
  const [reviewListFound, setReviewListFound] = useState(false);
  const [meaningList, setMeaningList] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const [wordBatch, setWordBatch] = useState([]);
  const [noReviews, setNoReviews] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [meaningState, setMeaningState] = useState(true);

  const arrayShuffler = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  const getReviewList = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");
    let tempMeaningList = [];
    let tempReadingList = [];

    if (currentWordList) {
      for (let word of JSON.parse(currentWordList)) {
        let currentWordObject = JSON.parse(await AsyncStorage.getItem(word));

        if (currentWordObject.review && !currentWordObject.meaningAnswered) {
          tempMeaningList.push(currentWordObject);
        }

        if (currentWordObject.review && !currentWordObject.readingAnswered) {
          tempReadingList.push(currentWordObject);
        }
      }
      arrayShuffler(tempMeaningList);
      arrayShuffler(tempReadingList);
      setMeaningList(tempMeaningList);
      setMeaningList(tempReadingList);

      if (tempMeaningList.length > 0 || tempReadingList.length > 0) {
        setNoReviews(false);
      }
    }
    getWordBatch();
    setReviewListFound(true);
  };

  const getWordBatch = () => {
    setCurrentWordIndex(0);

    const tempList = meaningState ? meaningList : readingList;

    if (tempList.length >= 5) {
      setWordBatch(tempList.splice(0, 5));
    } else if (tempList.length > 0) {
      setWordBatch(tempList.splice(0, tempList.length));
    } else {
      setMeaningState(!meaningState);
    }
  };

  if (!reviewListFound) {
    getReviewList();
  }

  const nextWord = () => {
    let tempCounter = currentWordIndex;
    tempCounter++;

    if (wordBatch[tempCounter]) {
      setCurrentWordIndex(tempCounter);
    } else {
      setNoReviews(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {noReviews || wordBatch.length === 0 ? (
        <Text style={[styles.error, { marginTop: Platform.OS === "android" ? 300 : 175 }]}>¯\(°_o)/¯</Text>
      ) : null}
      <View style={styles.componentContainer}>
        {wordBatch.length > 0 ? (
          <View>
            <Text style={styles.word}>{wordBatch[currentWordIndex].word}</Text>
            <TouchableWithoutFeedback onPress={() => nextWord()}>
              <Text style={[styles.nextButton, { backgroundColor: COLORS.light_gray }]}>NEXT</Text>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  componentContainer: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: "center",
    justifyContent: "center",
    padding: Platform.OS === "android" ? 0 : 25,
  },
  counter: {
    alignSelf: "flex-end",
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    color: "white",
    marginTop: Platform.OS === "android" ? 5 : 0,
  },
  word: {
    fontFamily: "Roboto-Black",
    fontSize: 50,
    color: "white",
    flex: 1,
    marginTop: 175,
    marginBottom: 40,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  translatedWordList: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    color: "white",
    marginTop: 15,
  },
  definitionsList: {
    fontFamily: "Roboto-Light",
    fontSize: 18,
    color: "white",
    marginBottom: 15,
  },
  error: {
    height: 65,
    fontFamily: "Roboto-Regular",
    fontSize: 25,
    color: "#e3f3ff",
  },
  nextButton: {
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    marginTop: 15,
    fontSize: 25,
    color: "white",
    width: 125,
    height: 75,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        lineHeight: 75, // as same as height
      },
      android: {},
    }),
  },
});

export default ReviewScreen;
