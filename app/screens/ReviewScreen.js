import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Platform, Text, View, TouchableWithoutFeedback, TextInput, ScrollView } from "react-native";
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
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [firstMeaningAttempt, setFirstMeaningAttempt] = useState(true);
  const [firstReadingAttempt, setFirstReadingAttempt] = useState(true);

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
      setReadingList(tempReadingList);

      if (tempMeaningList.length > 0 || tempReadingList.length > 0) {
        setNoReviews(false);
      }
    }
    setReviewListFound(true);
  };

  useEffect(() => {
    getWordBatch(); // This is be executed when 'reviewListFound' state changes
  }, [reviewListFound]);

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

    if (text != "" || text != null) {
      if (!meaningState && text == wordBatch[currentWordIndex].word) {
        currentWord.readingAnswered = true;
        currentWord.readingAnswer = true;
        setAnswer(true);
        console.log("RIGHT ANSWER :)");
      } else if (!meaningState && text != wordBatch[currentWordIndex].word) {
        currentWord.readingAnswered = true;
        currentWord.readingAnswer = false;
        setAnswer(false);
        console.log("WRONG ANSWER :(");
      } else {
        let correctReading = false;
        for (let translation of wordBatch[currentWordIndex].translatedWordList) {
          if (
            (translation != null &&
              translation
                .toLowerCase()
                .split(/[\s;]+/)
                .includes(text.toLowerCase())) ||
            (translation != null && translation.toLowerCase() === text.toLowerCase())
          ) {
            correctReading = true;
            break;
          }
        }
        if (correctReading) {
          currentWord.meaningAnswered = true;
          currentWord.meaningAnswer = true;
          setAnswer(true);

          console.log("RIGHT ANSWER :)");
        } else {
          currentWord.meaningAnswered = true;
          currentWord.meaningAnswer = false;
          setAnswer(false);
          console.log("WRONG ANSWER :(");
        }
      }
    }

    if (meaningState && firstMeaningAttempt) {
      await AsyncStorage.setItem(wordBatch[currentWordIndex].word, JSON.stringify(currentWord));
      changeLevel(currentWord);
      setFirstMeaningAttempt(false);
    } else if (!meaningState && firstReadingAttempt) {
      await AsyncStorage.setItem(wordBatch[currentWordIndex].word, JSON.stringify(currentWord));
      changeLevel(currentWord);
      setFirstReadingAttempt(false);
    }
    setAnswered(true);
  };

  const changeLevel = async (currentWord) => {
    let ONE_HOUR_IN_MILLIS = 3600000;
    let ONE_DAY_IN_MILLIS = 86400000;

    if (currentWord.meaningAnswered && currentWord.readingAnswered) {
      if (currentWord.meaningAnswer && currentWord.readingAnswer) {
        console.log("CHANGE TO HIGHER LEVEL");
        switch (currentWord.level) {
          case "Unranked":
            currentWord.level = "Apprentice 1";
            currentWord.nextReview = Date.now() + 4 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 1":
            currentWord.level = "Apprentice 2";
            currentWord.nextReview = Date.now() + 8 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 2":
            currentWord.level = "Apprentice 3";
            currentWord.nextReview = Date.now() + 23 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 3":
            currentWord.level = "Apprentice 4";
            currentWord.nextReview = Date.now() + 47 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 4":
            currentWord.level = "Guru 1";
            currentWord.nextReview = Date.now() + 7 * ONE_DAY_IN_MILLIS;
            break;
          case "Guru 1":
            currentWord.level = "Guru 2";
            currentWord.nextReview = Date.now() + 14 * ONE_DAY_IN_MILLIS;
            break;
          case "Guru 2":
            currentWord.level = "Master";
            currentWord.nextReview = Date.now() + 30 * ONE_DAY_IN_MILLIS;
            break;
          case "Master":
            currentWord.level = "Enlighten";
            currentWord.nextReview = Date.now() + 120 * ONE_DAY_IN_MILLIS;
            break;
          case "Enlighten":
            currentWord.level = "Burn";
            currentWord.nextReview = Date.now() + 365 * ONE_DAY_IN_MILLIS;
            break;
        }
      } else {
        console.log("CHANGE TO LOWER LEVEL");
        switch (currentWord.level) {
          case "Unranked":
            currentWord.nextReview = Date.now() + 4 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 1":
            currentWord.nextReview = Date.now() + 4 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 2":
          case "Apprentice 3":
          case "Apprentice 4":
            currentWord.level = "Apprentice 1";
            currentWord.nextReview = Date.now() + 4 * ONE_HOUR_IN_MILLIS;
            break;
          case "Guru 1":
          case "Guru 2":
          case "Master":
            currentWord.level = "Apprentice 4";
            currentWord.nextReview = Date.now() + 43 * ONE_HOUR_IN_MILLIS;
            break;
          case "Enlighten":
            currentWord.level = "Guru 1";
            currentWord.nextReview = Date.now() + 7 * ONE_DAY_IN_MILLIS;
            break;
          case "Burn":
            currentWord.level = "Master";
            currentWord.nextReview = Date.now() + 14 * ONE_DAY_IN_MILLIS;
            break;
        }
      }
      currentWord.review = false;
      currentWord.meaningAnswered = false;
      currentWord.meaningAnswer = false;
      currentWord.readingAnswered = false;
      currentWord.readingAnswer = false;
    }
    await AsyncStorage.setItem(wordBatch[currentWordIndex].word, JSON.stringify(currentWord));
  };

  const nextWord = () => {
    let tempCounter = currentWordIndex;
    if (answer) {
      tempCounter++;

      setFirstMeaningAttempt(true);
      setFirstReadingAttempt(true);

      if (wordBatch[tempCounter]) {
        setCurrentWordIndex(tempCounter);
      } else {
        if (meaningState && readingList.length > 0) {
          setMeaningState(false);
          getWordBatch();
        } else if (!meaningState && meaningList.length > 0) {
          setMeaningState(true);
          getWordBatch();
        } else {
          setNoReviews(true);
        }
      }
    }
    setAnswered(false);
    setText("");
    input.focus();
  };

  const renderSenses = () => {
    return wordBatch[currentWordIndex].translatedWordList.map((data, key) => {
      return (
        <View key={key}>
          <Text style={styles.translatedWordList}>
            {key + 1}. {data}
          </Text>
          <Text style={styles.definitionsList}>{wordBatch[currentWordIndex].definitionsList[key]}</Text>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {noReviews || wordBatch.length === 0 ? (
        <Text style={[styles.error, { marginTop: Platform.OS === "android" ? 300 : 175 }]}>¯\(°_o)/¯</Text>
      ) : null}
      {!noReviews && wordBatch.length > 0 && meaningState && !answered ? (
        <View>
          <Text style={styles.word1}>{wordBatch[currentWordIndex].word}</Text>
          <Text style={styles.reviewType}>Meaning</Text>
          <TextInput
            ref={(input) => (this.input = input)}
            autoFocus
            backgroundColor={COLORS.pastel_blue}
            style={styles.input}
            placeholder="ex: Milk"
            placeholderTextColor="#e3f3ff"
            onChangeText={setText}
            onSubmitEditing={() => checkAnswer()}
            value={text}
          />
        </View>
      ) : null}
      {!noReviews && wordBatch.length > 0 && !meaningState && !answered ? (
        <View>
          <Text style={[styles.translatedWord]}>{wordBatch[currentWordIndex].translatedWordList[0]}</Text>
          <Text style={styles.reviewType}>Reading</Text>
          <TextInput
            backgroundColor={COLORS.pastel_blue}
            autoFocus
            ref={(input) => (this.input = input)}
            style={styles.input}
            placeholder="ex: 우유"
            placeholderTextColor="#e3f3ff"
            onChangeText={setText}
            onSubmitEditing={() => checkAnswer()}
            value={text}
          />
        </View>
      ) : null}
      {meaningState && answered && !answer ? (
        <View>
          <Text style={styles.word1}>{wordBatch[currentWordIndex].word}</Text>
          <Text style={styles.reviewType}>Meaning</Text>
          <TextInput
            backgroundColor={COLORS.pastel_red}
            ref={(input) => (this.input = input)}
            style={styles.input}
            placeholder="ex: Milk"
            placeholderTextColor="#e3f3ff"
            onChangeText={setText}
            onSubmitEditing={() => checkAnswer()}
            value={text}
          />
        </View>
      ) : null}

      {!meaningState && answered && !answer ? (
        <View>
          <Text style={styles.translatedWord}>{wordBatch[currentWordIndex].translatedWordList[0]}</Text>
          <Text style={styles.reviewType}>Reading</Text>
          <TextInput
            backgroundColor={COLORS.pastel_red}
            ref={(input) => (this.input = input)}
            style={styles.input}
            placeholder="ex: 우유"
            placeholderTextColor="#e3f3ff"
            onChangeText={setText}
            onSubmitEditing={() => checkAnswer()}
            value={text}
          />
        </View>
      ) : null}

      {meaningState && answered && answer ? (
        <View>
          <Text style={styles.word1}>{wordBatch[currentWordIndex].word}</Text>
          <Text style={styles.reviewType}>Meaning</Text>
          <TextInput
            backgroundColor={COLORS.pastel_green}
            ref={(input) => (this.input = input)}
            style={styles.input}
            placeholder="ex: Milk"
            placeholderTextColor="#e3f3ff"
            onChangeText={setText}
            onSubmitEditing={() => checkAnswer()}
            value={text}
          />
        </View>
      ) : null}

      {!meaningState && answered && answer ? (
        <View>
          <Text style={styles.translatedWord}>{wordBatch[currentWordIndex].translatedWordList[0]}</Text>
          <Text style={styles.reviewType}>Reading</Text>
          <TextInput
            backgroundColor={COLORS.pastel_green}
            ref={(input) => (this.input = input)}
            style={styles.input}
            placeholder="ex: 우유"
            placeholderTextColor="#e3f3ff"
            onChangeText={setText}
            onSubmitEditing={() => checkAnswer()}
            value={text}
          />
        </View>
      ) : null}

      {answered ? (
        <TouchableWithoutFeedback onPress={() => nextWord()}>
          <Text style={styles.nextButton}>NEXT</Text>
        </TouchableWithoutFeedback>
      ) : null}
      {answered ? (
        <ScrollView>
          <Text style={styles.word2}>{wordBatch[currentWordIndex].word}</Text>
          {renderSenses()}
        </ScrollView>
      ) : null}
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
  word1: {
    fontFamily: "Roboto-Black",
    fontSize: 50,
    color: "white",
    marginTop: 100,
    marginBottom: 40,
    textAlign: "center",
  },
  word2: {
    fontFamily: "Roboto-Black",
    fontSize: 50,
    color: "white",
    marginTop: 5,
    marginBottom: 40,
    textAlign: "center",
  },
  translatedWord: {
    fontFamily: "Roboto-Black",
    fontSize: 50,
    color: "white",
    marginTop: 100,
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
    alignSelf: "center",
    width: "100%",
    height: 50,
    fontFamily: "Roboto-Regular",
    fontSize: 21,
    marginBottom: 25,
    borderRadius: 15,
    padding: 10,
    textAlign: "center",
    color: "white",
  },
  nextButton: {
    backgroundColor: COLORS.light_gray,
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "flex-end",
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    fontSize: 25,
    marginBottom: 25,
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
