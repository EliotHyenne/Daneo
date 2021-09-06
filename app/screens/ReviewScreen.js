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
  const [levelChange, setLevelChange] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState(false);
  const [firstMeaningAttempt, setFirstMeaningAttempt] = useState(true);
  const [firstReadingAttempt, setFirstReadingAttempt] = useState(true);
  const [currentWord, setCurrentWord] = useState(null);
  const [reviewBatchSize, setReviewBatchSize] = useState(null);

  const suffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  const getReviewBatchSize = async () => {
    const currentReviewBatchSize = await AsyncStorage.getItem("@reviewBatchSize");

    if (!currentReviewBatchSize) {
      await AsyncStorage.setItem("@reviewBatchSize", JSON.stringify("5"));
    }
    setReviewBatchSize(parseInt(JSON.parse(currentReviewBatchSize)));
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
      suffleArray(tempMeaningList);
      suffleArray(tempReadingList);
      setMeaningList(tempMeaningList);
      setReadingList(tempReadingList);

      if (tempMeaningList.length > 0 || tempReadingList.length > 0) {
        setNoReviews(false);
      }
    }
    setReviewListFound(true);
  };

  const getWordBatch = () => {
    setCurrentWordIndex(0);

    const tempMeaningState = readingList.length >= meaningList.length;
    setMeaningState(tempMeaningState);
    const tempList = tempMeaningState ? [...meaningList] : [...readingList];

    if (tempList.length === 0) {
      setWordBatch([]);
      return;
    }

    if (tempList.length >= reviewBatchSize) {
      setWordBatch(tempList.splice(0, reviewBatchSize));
    } else {
      setWordBatch(tempList.splice(0, tempList.length));
    }

    if (tempMeaningState) {
      setMeaningList(tempList);
    } else {
      setReadingList(tempList);
    }
  };

  useEffect(() => {
    getReviewBatchSize();
  }, []);

  useEffect(() => {
    getReviewList();
  }, []);

  useEffect(() => {
    getWordBatch(); // This is be executed when 'reviewListFound' state changes
  }, [reviewListFound]);

  useEffect(() => {
    if (wordBatch.length > 0) {
      setTimeout(() => input.focus(), 200);
    }
  }, [wordBatch]);

  const checkAnswer = async () => {
    const tempWord = JSON.parse(await AsyncStorage.getItem(wordBatch[currentWordIndex].word));

    if (text != "" || text != null) {
      if (!meaningState && text == wordBatch[currentWordIndex].word) {
        tempWord.readingAnswered = true;
        tempWord.readingAnswer = true;
        setAnswer(true);
        console.log("RIGHT ANSWER :)");
      } else if (!meaningState && text != wordBatch[currentWordIndex].word) {
        tempWord.readingAnswered = true;
        tempWord.readingAnswer = false;
        setAnswer(false);
        console.log("WRONG ANSWER :(");
      } else {
        let correctReading = false;
        for (let translation of wordBatch[currentWordIndex].translatedWordList) {
          if (
            (translation != null &&
              translation
                .toLowerCase()
                .split(/[\s;【】・。]+/)
                .includes(text.toLowerCase())) ||
            (translation != null && translation.toLowerCase() === text.toLowerCase())
          ) {
            correctReading = true;
            break;
          }
        }
        if (correctReading) {
          tempWord.meaningAnswered = true;
          tempWord.meaningAnswer = true;
          setAnswer(true);

          console.log("RIGHT ANSWER :)");
        } else {
          tempWord.meaningAnswered = true;
          tempWord.meaningAnswer = false;
          setAnswer(false);
          console.log("WRONG ANSWER :(");
        }
      }
    }

    if (meaningState && firstMeaningAttempt) {
      await AsyncStorage.setItem(wordBatch[currentWordIndex].word, JSON.stringify(tempWord));
      changeLevel(tempWord);
      setFirstMeaningAttempt(false);
    } else if (!meaningState && firstReadingAttempt) {
      await AsyncStorage.setItem(wordBatch[currentWordIndex].word, JSON.stringify(tempWord));
      changeLevel(tempWord);
      setFirstReadingAttempt(false);
    }
    setAnswered(true);
  };

  const changeLevel = async (tempWord) => {
    let ONE_HOUR_IN_MILLIS = 3600000;
    let ONE_DAY_IN_MILLIS = 86400000;

    if (tempWord.meaningAnswered && tempWord.readingAnswered) {
      if (tempWord.meaningAnswer && tempWord.readingAnswer) {
        console.log("CHANGE TO HIGHER LEVEL");
        setLevelChange(true);
        setFinalAnswer(true);
        switch (tempWord.level) {
          case "Unranked":
            tempWord.level = "Apprentice 1";
            tempWord.nextReview = Date.now() + 4 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 1":
            tempWord.level = "Apprentice 2";
            tempWord.nextReview = Date.now() + 8 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 2":
            tempWord.level = "Apprentice 3";
            tempWord.nextReview = Date.now() + 23 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 3":
            tempWord.level = "Apprentice 4";
            tempWord.nextReview = Date.now() + 47 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 4":
            tempWord.level = "Guru 1";
            tempWord.nextReview = Date.now() + 7 * ONE_DAY_IN_MILLIS;
            break;
          case "Guru 1":
            tempWord.level = "Guru 2";
            tempWord.nextReview = Date.now() + 14 * ONE_DAY_IN_MILLIS;
            break;
          case "Guru 2":
            tempWord.level = "Master";
            tempWord.nextReview = Date.now() + 30 * ONE_DAY_IN_MILLIS;
            break;
          case "Master":
            tempWord.level = "Enlighten";
            tempWord.nextReview = Date.now() + 120 * ONE_DAY_IN_MILLIS;
            break;
          case "Enlighten":
            tempWord.level = "Burn";
            tempWord.nextReview = Date.now() + 365 * ONE_DAY_IN_MILLIS;
            break;
        }
      } else {
        console.log("CHANGE TO LOWER LEVEL");
        setLevelChange(true);
        setFinalAnswer(false);
        switch (tempWord.level) {
          case "Unranked":
            tempWord.nextReview = Date.now() + 4 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 1":
            tempWord.nextReview = Date.now() + 4 * ONE_HOUR_IN_MILLIS;
            break;
          case "Apprentice 2":
          case "Apprentice 3":
          case "Apprentice 4":
            tempWord.level = "Apprentice 1";
            tempWord.nextReview = Date.now() + 4 * ONE_HOUR_IN_MILLIS;
            break;
          case "Guru 1":
          case "Guru 2":
          case "Master":
            tempWord.level = "Apprentice 4";
            tempWord.nextReview = Date.now() + 43 * ONE_HOUR_IN_MILLIS;
            break;
          case "Enlighten":
            tempWord.level = "Guru 1";
            tempWord.nextReview = Date.now() + 7 * ONE_DAY_IN_MILLIS;
            break;
          case "Burn":
            tempWord.level = "Master";
            tempWord.nextReview = Date.now() + 14 * ONE_DAY_IN_MILLIS;
            break;
        }
      }
      setCurrentWord(tempWord);

      tempWord.review = false;
      tempWord.meaningAnswered = false;
      tempWord.meaningAnswer = false;
      tempWord.readingAnswered = false;
      tempWord.readingAnswer = false;
    }
    await AsyncStorage.setItem(wordBatch[currentWordIndex].word, JSON.stringify(tempWord));
  };

  const nextWord = () => {
    console.log(wordBatch[currentWordIndex].translatedWordList[0]);
    let tempCounter = currentWordIndex;

    if (answer) {
      tempCounter++;

      setFirstMeaningAttempt(true);
      setFirstReadingAttempt(true);

      if (wordBatch[tempCounter]) {
        setCurrentWordIndex(tempCounter);
      } else {
        getWordBatch();
      }
    }
    setAnswered(false);
    setLevelChange(false);
    setText("");
    if (wordBatch[tempCounter]) {
      setTimeout(() => input.focus(), 200);
    }
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
          <Text style={[styles.translatedWord]}>{wordBatch[currentWordIndex].translatedWordList[0].split(/\r?\n|\r/g)}</Text>
          <Text style={styles.reviewType}>Reading</Text>
          <TextInput
            backgroundColor={COLORS.pastel_blue}
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
          <Text style={styles.translatedWord}>{wordBatch[currentWordIndex].translatedWordList[0].split(/\r?\n|\r/g)}</Text>
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

      {meaningState && answered && answer && !levelChange ? (
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

      {!meaningState && answered && answer && !levelChange ? (
        <View>
          <Text style={styles.translatedWord}>{wordBatch[currentWordIndex].translatedWordList[0].split(/\r?\n|\r/g)}</Text>
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

      {meaningState && answered && answer && finalAnswer && levelChange ? (
        <View>
          <Text style={styles.levelUp}>+ {currentWord.level}</Text>
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

      {!meaningState && answered && answer && finalAnswer && levelChange ? (
        <View>
          <Text style={styles.levelUp}>+ {currentWord.level}</Text>
          <Text style={styles.translatedWord}>{wordBatch[currentWordIndex].translatedWordList[0].split(/\r?\n|\r/g)}</Text>
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

      {meaningState && answered && answer && !finalAnswer && levelChange ? (
        <View>
          <Text style={styles.levelDown}>- {currentWord.level}</Text>
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

      {!meaningState && answered && answer && !finalAnswer && levelChange ? (
        <View>
          <Text style={styles.levelDown}>- {currentWord.level}</Text>
          <Text style={styles.translatedWord}>{wordBatch[currentWordIndex].translatedWordList[0].split(/\r?\n|\r/g)}</Text>
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

      {!meaningState && answered ? (
        <ScrollView>
          <Text style={styles.word2}>{wordBatch[currentWordIndex].word}</Text>
          {renderSenses()}
        </ScrollView>
      ) : null}

      {meaningState && answered ? <ScrollView>{renderSenses()}</ScrollView> : null}
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
  levelUp: {
    position: "absolute",
    alignSelf: "flex-end",
    fontFamily: "Roboto-LightItalic",
    fontSize: 18,
    color: COLORS.pastel_green,
    marginTop: Platform.OS === "android" ? 5 : 0,
    marginRight: Platform.OS === "ios" ? 20 : 0,
  },
  levelDown: {
    position: "absolute",
    alignSelf: "flex-end",
    fontFamily: "Roboto-LightItalic",
    fontSize: 18,
    color: COLORS.pastel_red,
    marginTop: Platform.OS === "android" ? 5 : 0,
    marginRight: Platform.OS === "ios" ? 20 : 0,
  },
  word1: {
    fontFamily: "Roboto-Black",
    fontSize: 40,
    color: "white",
    marginTop: 100,
    marginBottom: 35,
    textAlign: "center",
  },
  word2: {
    fontFamily: "Roboto-Black",
    fontSize: 40,
    color: "white",
    marginTop: 5,
    marginBottom: 35,
    textAlign: "center",
  },
  translatedWord: {
    fontFamily: "Roboto-Black",
    fontSize: 38,
    color: "white",
    marginTop: 100,
    marginBottom: 35,
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
    paddingHorizontal: Platform.OS === "android" ? 0 : 25,
  },
  definitionsList: {
    fontFamily: "Roboto-Light",
    fontSize: 18,
    color: "white",
    marginBottom: 15,
    paddingHorizontal: Platform.OS === "android" ? 0 : 25,
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
    height: 50,
    fontFamily: "Roboto-Regular",
    fontSize: 21,
    marginBottom: 25,
    borderRadius: 15,
    padding: 10,
    textAlign: "center",
    color: "white",
    width: "90%",
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
    marginRight: Platform.OS === "ios" ? 20 : 0,
    lineHeight: Platform.OS === "ios" ? 75 : null,
  },
});

export default ReviewScreen;
