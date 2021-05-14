import React, { useState, useRef } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text, TouchableWithoutFeedback } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReviewScreen = ({ route, navigation }) => {
  const [vocabList, setVocabList] = useState([]);
  const [reviewListFound, setReviewListFound] = useState(false);
  const [reviewList] = useState([]);
  const [currentWords, setCurrentWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [meaningState, setMeaningState] = useState(true);
  const [noReviews, setNoReviews] = useState(true);
  const [wordGroupFound, setWordGroupFound] = useState(false);

  const getReviewList = async () => {
    const currentVocabList = await AsyncStorage.getItem("@vocabList");

    if (currentVocabList) {
      setVocabList(JSON.parse(currentVocabList));

      for (var i = 0; i < vocabList.length; i++) {
        if (vocabList[i].review) {
          reviewList.push({ index: i, element: vocabList[i] });
        }
      }
      if (reviewList.length > 0) {
        setNoReviews(false);
      }
    }
    setReviewListFound(true);
  };

  const getWordGroup = () => {
    setCurrentWordIndex(0);
    var counter = 0;
    var randomIndex = Math.floor(Math.random() * reviewList.length);

    if (meaningState) {
      if (reviewList.length > 5) {
        while (counter != 5) {
          while (reviewList[randomIndex].element.meaningAnswered) {
            randomIndex = Math.floor(Math.random() * reviewList.length);
          }
          currentWords.push(reviewList[randomIndex]);
          counter++;
        }
      } else {
        for (let item of reviewList) {
          console.log(item);
          if (!item.element.meaningAnswered) {
            currentWords.push(item);
          }
        }
      }
    } else {
      if (reviewList.length > 5) {
        while (counter != 5) {
          while (reviewList[randomIndex].element.readingAnswered) {
            randomIndex = Math.floor(Math.random() * reviewList.length);
          }
          currentWords.push(reviewList[randomIndex]);
          counter++;
        }
      } else {
        for (let item of reviewList) {
          if (!item.element.readingAnswered) {
            currentWords.push(item);
          }
        }
      }
    }
    setWordGroupFound(true);
  };

  if (!reviewListFound) {
    getReviewList();
  }

  if (reviewListFound && !wordGroupFound) {
    getWordGroup();
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
