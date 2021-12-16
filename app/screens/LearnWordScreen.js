import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";

const LearnWordScreen = ({ route, navigation }) => {
  const [lessonList, setLessonList] = useState([]);
  const [lessonListFound, setLessonListFound] = useState(false);
  const [wordList, setWordList] = useState([]);
  const [noLessons, setNoLessons] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef();

  const getLessonList = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");
    const parsedWordList = JSON.parse(currentWordList);
    setWordList(parsedWordList);
    let tempLessonList = [];

    if (currentWordList) {
      for (var i = 0; i < parsedWordList.length; i++) {
        if (parsedWordList[i].learn) {
          tempLessonList.push({ index: i, wordObject: parsedWordList[i] });
        }
      }
      setLessonList(tempLessonList);
      if (tempLessonList.length > 0) {
        setNoLessons(false);
      }
    }
    setLessonListFound(true);
    setIsLoading(false);
  };

  useEffect(() => {
    getLessonList();
  }, []);

  const renderSenses = (index) => {
    return lessonList[index].wordObject.translatedWordList.map((data, key) => {
      return (
        <View key={key}>
          <Text style={styles.translatedWordList}>
            {key + 1}. {data}
          </Text>
          <Text style={styles.definitionsList}>{lessonList[index].wordObject.definitionsList[key]}</Text>
        </View>
      );
    });
  };

  const changeLevel = async () => {
    wordList[lessonList[currentWordIndex].index].learn = false;
    wordList[lessonList[currentWordIndex].index].review = true;
    wordList[lessonList[currentWordIndex].index].level = "Unranked";

    await AsyncStorage.setItem("@wordList", JSON.stringify(wordList));
  };

  const nextWord = () => {
    changeLevel();

    Toast.show("Word ready for review", {
      duration: Toast.durations.SHORT,
      backgroundColor: "gray",
      shadow: false,
      opacity: 0.8,
    });

    let tempCounter = currentWordIndex;
    tempCounter++;

    if (lessonList[tempCounter]) {
      setCurrentWordIndex(tempCounter);
    } else {
      setNoLessons(true);
    }
    scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {!noLessons ? <Text style={styles.counter}>{currentWordIndex + 1 + " / " + lessonList.length}</Text> : null}
      <View style={styles.componentContainer}>
        <View style={styles.loading}>{isLoading ? <ActivityIndicator size="large" color="white" /> : null}</View>
        {!isLoading && (!lessonListFound || noLessons) ? (
          <Text style={[styles.error, { marginTop: Platform.OS === "android" ? 300 : 175 }]}>¯\(°_o)/¯</Text>
        ) : null}
        <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef} style={{ width: "100%" }}>
          {!noLessons ? (
            <View>
              <Text style={styles.word}>{lessonList[currentWordIndex].wordObject.word}</Text>
              {renderSenses(currentWordIndex)}
            </View>
          ) : null}
        </ScrollView>
      </View>
      {!noLessons ? (
        <TouchableWithoutFeedback onPress={() => nextWord()}>
          <Text style={styles.nextButton}>NEXT</Text>
        </TouchableWithoutFeedback>
      ) : null}
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
    margin: Platform.OS === "ios" ? 15 : 0,
  },
  word: {
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
    backgroundColor: COLORS.light_gray,
    alignSelf: "flex-end",
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    fontSize: 25,
    color: "white",
    width: 125,
    height: 75,
    margin: Platform.OS === "ios" ? 25 : 0,
    lineHeight: Platform.OS === "ios" ? 75 : null,
    overflow: "hidden",
  },
  loading: {
    top: 200,
  },
});

export default LearnWordScreen;
