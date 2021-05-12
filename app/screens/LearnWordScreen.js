import React, { useState, useRef } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text, TouchableWithoutFeedback } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const LearnWordScreen = ({ route, navigation }) => {
  const [vocabList, setVocabList] = useState([]);
  const [lessonList, setLessonList] = useState([]);
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
          lessonList.push(vocabList[i]);
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

  const nextWord = () => {
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
      {!lessonListFound || noLessons ? <Text style={[styles.error, { marginTop: 200 }]}>¯\(°_o)/¯</Text> : null}
      <ScrollView ref={scrollRef} style={{ width: "100%" }}>
        {lessonListFound && !noLessons ? (
          <View>
            <Text style={styles.vocabWord}>{lessonList[currentWordIndex].vocabWord}</Text>
            {renderSenses(currentWordIndex)}
            <TouchableWithoutFeedback onPress={() => nextWord()}>
              <Text style={[styles.nextButton, { backgroundColor: COLORS.light_gray }]}>NEXT</Text>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </ScrollView>
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
  vocabWord: {
    fontFamily: "Roboto-Black",
    fontSize: 50,
    color: "white",
    flex: 1,
    marginTop: 50,
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
