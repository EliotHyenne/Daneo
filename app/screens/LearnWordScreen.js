import React, { useState, useRef } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text, TouchableWithoutFeedback } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";

const LearnWordScreen = ({ route, navigation }) => {
  const [lessonList, setLessonList] = useState([]);
  const [lessonListFound, setLessonListFound] = useState(false);
  const [noLessons, setNoLessons] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const scrollRef = useRef();

  const getLessonList = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");
    let tempLessonList = [];

    if (currentWordList) {
      for (let word of JSON.parse(currentWordList)) {
        let currentWordObject = JSON.parse(await AsyncStorage.getItem(word));
        if (currentWordObject.learn) {
          tempLessonList.push(currentWordObject);
        }
      }
      setLessonList(tempLessonList);
      if (tempLessonList.length > 0) {
        setNoLessons(false);
      }
    }
    setLessonListFound(true);
  };

  if (!lessonListFound) {
    getLessonList();
  }

  const renderSenses = (index) => {
    return lessonList[index].translatedWordList.map((data, key) => {
      return (
        <View key={key}>
          <Text style={styles.translatedWordList}>
            {key + 1}. {data}
          </Text>
          <Text style={styles.definitionsList}>{lessonList[index].definitionsList[key]}</Text>
        </View>
      );
    });
  };

  const changeLevel = async () => {
    lessonList[currentWordIndex].learn = false;
    lessonList[currentWordIndex].review = true;
    lessonList[currentWordIndex].level = "Unranked";

    await AsyncStorage.setItem(lessonList[currentWordIndex].word, JSON.stringify(lessonList[currentWordIndex]));
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
      <View style={styles.componentContainer}>
        {!lessonListFound || noLessons ? (
          <Text style={[styles.error, { marginTop: Platform.OS === "android" ? 300 : 175 }]}>¯\(°_o)/¯</Text>
        ) : (
          <Text style={styles.counter}>{currentWordIndex + 1 + " / " + lessonList.length}</Text>
        )}
        <ScrollView ref={scrollRef} style={{ width: "100%" }}>
          {!noLessons ? (
            <View>
              <Text style={styles.word}>{lessonList[currentWordIndex].word}</Text>
              {renderSenses(currentWordIndex)}
              <TouchableWithoutFeedback onPress={() => nextWord()}>
                <Text style={styles.nextButton}>NEXT</Text>
              </TouchableWithoutFeedback>
            </View>
          ) : null}
        </ScrollView>
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

export default LearnWordScreen;
