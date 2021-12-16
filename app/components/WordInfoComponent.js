import React, { useState } from "react";
import { StyleSheet, Platform, View, Text, TouchableWithoutFeedback, Alert } from "react-native";
import { COLORS } from "../config/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

const WordInfoComponent = (props) => {
  const [wordIndex, setWordIndex] = useState(-1);
  const [checkedExists, setCheckedExists] = useState(false);

  const checkWordExists = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");

    if (currentWordList) {
      setWordIndex(JSON.parse(currentWordList).findIndex((element) => element.word === props.word));
    }
  };

  const confirmDelete = (index, word) => {
    Alert.alert("Delete", "Are you sure you want to delete " + word + " ?", [{ text: "Yes", onPress: () => deleteVocabWord(index) }, { text: "No" }]);
  };

  const deleteVocabWord = async (index) => {
    Toast.show("Word deleted", {
      duration: Toast.durations.SHORT,
      backgroundColor: "gray",
      shadow: false,
      opacity: 0.8,
    });

    const currentWordList = await AsyncStorage.getItem("@wordList");

    const newWordList = JSON.parse(currentWordList);
    newWordList.splice(index, 1);

    await AsyncStorage.setItem("@wordList", JSON.stringify(newWordList))
      .then(() => {
        setCheckedExists(false);
        console.log("Word deleted and words list updated.");
      })
      .catch((e) => {
        console.log("There was an error while deleting a word from the words list: ", e);
      });
  };

  const addVocabWord = async () => {
    Toast.show("Word added", {
      duration: Toast.durations.SHORT,
      backgroundColor: "gray",
      shadow: false,
      opacity: 0.8,
    });

    const wordToAdd = {
      word: props.word,
      learn: true,
      review: false,
      meaningAnswered: false,
      readingAnswered: false,
      meaningAnswer: false,
      readingAnswer: false,
      level: "Unseen",
      nextReview: Date.now(),
      translatedWordList: props.translatedWordList,
      definitionsList: props.definitionsList,
    };

    const currentWordList = await AsyncStorage.getItem("@wordList");
    let newWordList = [];

    if (currentWordList) {
      newWordList = JSON.parse(currentWordList);
    }

    newWordList.push(wordToAdd);
    await AsyncStorage.setItem("@wordList", JSON.stringify(newWordList))
      .then(() => {
        setCheckedExists(false);
      })
      .catch((e) => {
        console.log("There was an error while creating the words list: ", e);
      });
  };

  if (!checkedExists) {
    checkWordExists();
    setCheckedExists(true);
  }

  const renderSenses = () => {
    return props.translatedWordList.map((data, key) => {
      return (
        <View key={key}>
          <Text style={styles.translatedWordList}>
            {key + 1}. {data}
          </Text>
          <Text style={styles.definitionsList}>{props.definitionsList[key]}</Text>
        </View>
      );
    });
  };

  const renderReviewDate = () => {
    let x = (props.nextReview - Date.now()) / 1000;
    const seconds = x % 60;
    x /= 60;
    const minutes = x % 60;
    x /= 60;
    const hours = x % 24;
    x /= 24;
    const days = x;

    let str = "Next review in ";

    if (Math.floor(days) > 0) {
      str += Math.floor(days) + " day(s) ";
    }
    if (Math.floor(hours) > 0) {
      str += Math.floor(hours) + " hour(s) ";
    }
    if (Math.floor(minutes) > 0) {
      str += Math.floor(minutes) + " min ";
    }
    if (Math.floor(seconds) > 0) {
      str += Math.floor(seconds) + " sec";
    }

    if (props.level != "Unseen" && props.nextReview - Date.now() <= 0) {
      return <Text style={styles.nextReview}>Can review now!</Text>;
    } else if (props.level != "Unseen") {
      return <Text style={styles.nextReview}>{str}</Text>;
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.word}>{props.word}</Text>
        {props.level ? <Text style={styles.level}>{props.level}</Text> : null}
        {props.nextReview ? renderReviewDate() : null}
      </View>
      {renderSenses()}
      {wordIndex === -1 ? (
        <TouchableWithoutFeedback onPress={() => addVocabWord()}>
          <Text style={[styles.addButton, { backgroundColor: COLORS.pastel_green }]}>ADD</Text>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={() => confirmDelete(wordIndex, props.word)}>
          <Text style={[styles.deleteButton, { backgroundColor: COLORS.pastel_red }]}>DELETE</Text>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  word: {
    fontFamily: "Roboto-Black",
    fontSize: 40,
    color: "white",
  },
  level: {
    fontFamily: "Roboto-Regular",
    fontSize: 20,
    marginTop: 5,
    color: COLORS.pastel_yellow,
  },
  nextReview: {
    fontFamily: "Roboto-Light",
    fontSize: 15,
    color: "white",
  },
  translatedWordList: {
    fontFamily: "Roboto-Bold",
    fontSize: 20,
    color: "white",
    marginTop: 10,
  },
  definitionsList: {
    fontFamily: "Roboto-Light",
    fontSize: 18,
    color: "white",
    marginBottom: 15,
  },
  addButton: {
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
    lineHeight: Platform.OS === "ios" ? 75 : null,
  },
  deleteButton: {
    alignSelf: "flex-end",
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    fontSize: 25,
    color: "white",
    width: 150,
    height: 75,
    overflow: "hidden",
    lineHeight: Platform.OS === "ios" ? 75 : null,
  },
});

export default WordInfoComponent;
