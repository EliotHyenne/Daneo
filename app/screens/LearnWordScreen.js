import React, { useState, useRef } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text, TouchableWithoutFeedback } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";

const LearnWordScreen = ({ route, navigation }) => {
  const [vocabList, setVocabList] = useState([]);
  const [lessonList] = useState([]);
  const [lessonListFound, setLessonListFound] = useState(false);
  const [noLessons, setNoLessons] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const scrollRef = useRef();

  const getLessonList = async () => {
    const currentVocabList = await AsyncStorage.getItem("@vocabList");

    if (currentVocabList) {
      setVocabList(JSON.parse(currentVocabList));

      for (var i = 0; i < vocabList.length; i++) {
        if (vocabList[i].level == "Unseen") {
          lessonList.push({ index: i, element: vocabList[i] });
        }
      }
      if (lessonList.length > 0) {
        setNoLessons(false);
      }
    }
    setLessonListFound(true);
  };

  if (!lessonListFound) {
    getLessonList();
  }

  const renderSenses = (index) => {
    return lessonList[index].element.translatedWordList.map((data, key) => {
      return (
        <View key={key}>
          <Text style={styles.translatedWordList}>
            {key + 1}. {data}
          </Text>
          <Text style={styles.definitionsList}>{lessonList[index].element.definitionsList[key]}</Text>
        </View>
      );
    });
  };

  const changeLevel = async () => {
    vocabList[lessonList[currentWordIndex].index].level = "Unranked";

    await AsyncStorage.setItem("@vocabList", JSON.stringify(vocabList))
      .then(() => {
        console.log("Vocab word level changed.");
      })
      .catch((e) => {
        console.log("There was an error while changing the vocab word level: ", e);
      });
  };

  const nextWord = () => {
    changeLevel();

    Toast.show("Word ready for review", {
      duration: Toast.durations.SHORT,
      backgroundColor: "gray",
      shadow: false,
      opacity: 0.8,
    });

    var tempCounter = currentWordIndex;
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
        {!lessonListFound || noLessons ? <Text style={[styles.error, { marginTop: Platform.OS === "android" ? 300 : 175 }]}>¯\(°_o)/¯</Text> : null}
        <ScrollView ref={scrollRef} style={{ width: "100%" }}>
          {lessonListFound && !noLessons ? (
            <View>
              <Text style={styles.counter}>{currentWordIndex + 1 + " / " + lessonList.length}</Text>
              <Text style={styles.vocabWord}>{lessonList[currentWordIndex].element.vocabWord}</Text>
              {renderSenses(currentWordIndex)}
              <TouchableWithoutFeedback onPress={() => nextWord()}>
                <Text style={[styles.nextButton, { backgroundColor: COLORS.light_gray }]}>NEXT</Text>
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
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    color: "white",
    marginTop: Platform.OS === "android" ? 5 : 0,
    textAlign: "right",
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

export default LearnWordScreen;
