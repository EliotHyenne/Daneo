import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text } from "react-native";
import { SearchBar } from "react-native-elements";
import { COLORS } from "../config/colors.js";
import WordInfoComponent from "../components/WordInfoComponent.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native";

const LearnWordScreen = ({ route, navigation }) => {
  const [vocabList, setVocabList] = useState([]);
  const [lessonList, setLessonList] = useState([]);
  const [lessonListFound, setLessonListFound] = useState(false);
  const [noLessons, setNoLessons] = useState(true);

  const getLessonList = async () => {
    const currentVocabList = await AsyncStorage.getItem("@vocabList");

    if (currentVocabList) {
      setVocabList(JSON.parse(currentVocabList));

      var tempLessonList = [];

      for (var i = 0; i < vocabList.length; i++) {
        if (vocabList[i].level == "Unseen") {
          tempLessonList.push(vocabList[i]);
        }
      }
      if (tempLessonList.length > 0) {
        setNoLessons(false);
        setLessonList(tempLessonList);
      }
    }
    setLessonListFound(true);
  };

  if (!lessonListFound) {
    getLessonList();
  }

  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
});

export default LearnWordScreen;
