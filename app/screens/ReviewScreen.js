import React, { useState, useRef } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text, TouchableWithoutFeedback } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReviewScreen = ({ route, navigation }) => {
  const [reviewListFound, setReviewListFound] = useState(false);
  const [meaningList, setMeaningList] = useState([]);
  const [readingList, setReadingList] = useState([]);
  const [noReviews, setNoReviews] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [meaningState, setMeaningState] = useState(true);

  const arrayShuffler = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  const getReviewList = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");
    var tempMeaningList = [];
    var tempReadingList = [];

    if (currentWordList) {
      for (var word of JSON.parse(currentWordList)) {
        var currentWordObject = JSON.parse(await AsyncStorage.getItem(word));

        if (!currentWordObject.meaningAnswered) {
          tempMeaningList.push(currentWordObject);
        } else if (!currentWordObject.readingAnswered) {
          tempReadingList.push(currentWordObject);
        }
      }
      setMeaningList(arrayShuffler(tempMeaningList));
      setReadingList(arrayShuffler(tempReadingList));

      if (tempMeaningList.length > 0 || tempReadingList.length > 0) {
        setNoReviews(false);
      }
    }
    setReviewListFound(true);
  };

  const getWordGroup = () => {
    setCurrentWordIndex(0);

    if (meaningState) {
      if (meaningList.length >= 5) {
        setWordGroup(meaningList.splice(0, 5));
      } else if (meaningList.length > 0) {
        setWordGroup(meaningList.splice(0, meaningList.length));
      } else {
        setMeaningState(false);
      }
    } else {
      if (readingList.length >= 5) {
        setWordGroup(readingList.splice(0, 5));
      } else if (readingList.length > 0) {
        setWordGroup(readingList.splice(0, readingList.length));
      } else {
        setMeaningState(true);
      }
    }
  };

  if (!reviewListFound) {
    getReviewList();
  }

  return <SafeAreaView style={styles.container}></SafeAreaView>;
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
  vocabWord: {
    fontFamily: "Roboto-Black",
    fontSize: 50,
    color: "white",
    flex: 1,
    marginTop: 50,
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
    alignSelf: "flex-end",
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
