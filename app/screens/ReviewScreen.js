import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Platform, Text, View, TouchableWithoutFeedback, TextInput } from "react-native";
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
  const [text, setText] = useState("");

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

  const checkAnswer = async () => {
    const currentWord = JSON.parse(await AsyncStorage.getItem(wordBatch[currentWordIndex].word));

    if (checkAnswer != "") {
      if (!meaningState && text == wordBatch[currentWordIndex].word) {
        currentWord.readingAnswered = true;
        currentWord.readingAnswer = true;
        console.log("RIGHT ANSWER :)");
      } else if (!meaningState && text != wordBatch[currentWordIndex].word) {
        currentWord.readingAnswered = true;
        currentWord.readingAnswer = false;
        console.log("WRONG ANSWER :( :(");
      } else {
        let correctReading = false;
        for (let translation of wordBatch[currentWordIndex].translatedWordList) {
          if (
            translation != null &&
            translation
              .toLowerCase()
              .split(/[\s;]+/)
              .includes(text.toLowerCase())
          ) {
            correctReading = true;
            break;
          }
        }
        if (correctReading) {
          currentWord.meaningAnswered = true;
          currentWord.meaningAnswer = true;
          console.log("RIGHT ANSWER :)");
        } else {
          currentWord.meaningAnswered = true;
          currentWord.meaningAnswer = false;
          console.log("WRONG ANSWER :(");
        }
      }
    }
    await AsyncStorage.setItem(wordBatch[currentWordIndex].word, JSON.stringify(currentWord));
    changeLevel(currentWord);
  };

  const changeLevel = async (currentWord) => {
    console.log(currentWord.readingAnswered);
    console.log(currentWord.meaningAnswered);
    if (currentWord.meaningAnswered && currentWord.readingAnswered) {
      if (currentWord.meaningAnswer && currentWord.readingAnswer) {
        console.log("CHANGE TO HIGHER LEVEL");
      } else {
        console.log("CHANGE TO LOWER LEVEL");
      }
      currentWord.review = false;
    }
    await AsyncStorage.setItem(wordBatch[currentWordIndex].word, JSON.stringify(currentWord));
  };

  const nextWord = () => {
    let tempCounter = currentWordIndex;
    tempCounter++;

    if (wordBatch[tempCounter]) {
      setCurrentWordIndex(tempCounter);
    } else {
      setMeaningState(!meaningState);
      if (meaningState && meaningList.length > 0) {
        getWordBatch();
      } else if (!meaningState && readingList.length > 0) {
        getWordBatch();
      } else {
        setNoReviews(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {noReviews || wordBatch.length === 0 ? (
        <Text style={[styles.error, { marginTop: Platform.OS === "android" ? 300 : 175 }]}>¯\(°_o)/¯</Text>
      ) : (
        <View>
          {meaningState ? (
            <View>
              <Text style={styles.word}>{wordBatch[currentWordIndex].word}</Text>
              <Text style={styles.reviewType}>Meaning</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: Milk"
                placeholderTextColor="#e3f3ff"
                onChangeText={setText}
                onSubmitEditing={() => checkAnswer()}
                value={text}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.translatedWord}>{wordBatch[currentWordIndex].translatedWordList[0]}</Text>
              <Text style={styles.reviewType}>Reading</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 우유"
                placeholderTextColor="#e3f3ff"
                onChangeText={setText}
                onSubmitEditing={() => checkAnswer()}
                value={text}
              />
            </View>
          )}
          <TouchableWithoutFeedback onPress={() => nextWord()}>
            <Text style={styles.nextButton}>NEXT</Text>
          </TouchableWithoutFeedback>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    padding: 25,
    paddingTop: Platform.OS === "android" ? 50 : 0,
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
    marginTop: 175,
    marginBottom: 40,
    textAlign: "center",
  },
  translatedWord: {
    fontFamily: "Roboto-Black",
    fontSize: 50,
    color: "white",
    marginTop: 175,
    marginBottom: 40,
    textAlign: "center",
  },
  reviewType: {
    fontFamily: "Roboto-Regular",
    fontSize: 28,
    marginBottom: 5,
    color: COLORS.pastel_yellow,
    textAlign: "center",
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
    alignSelf: "center",
    color: "#e3f3ff",
  },
  input: {
    backgroundColor: COLORS.pastel_blue,
    alignSelf: "center",
    width: "100%",
    height: 50,
    fontFamily: "Roboto-Regular",
    fontSize: 21,
    marginBottom: 25,
    borderRadius: 15,
    padding: 10,
    color: "white",
  },
  nextButton: {
    backgroundColor: COLORS.light_gray,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "flex-end",
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
