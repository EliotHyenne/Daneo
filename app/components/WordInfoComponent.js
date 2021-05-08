import React, { useState } from "react";
import { StyleSheet, Platform, View, Text, TouchableWithoutFeedback } from "react-native";
import { COLORS } from "../config/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

const WordInfoComponent = (props) => {
  const [wordIndex, setWordIndex] = useState(-1);
  const [checkedExists, setCheckedExists] = useState(false);

  const checkWordExists = async () => {
    const currentVocabWordsList = await AsyncStorage.getItem("vocabWords");

    if (currentVocabWordsList) {
      setWordIndex(JSON.parse(currentVocabWordsList).findIndex((element) => element.vocabWord === props.vocabWord));
    }
  };

  const deleteVocabWord = async (index) => {
    const currentVocabWordsList = await AsyncStorage.getItem("vocabWords");

    const newVocabWordsList = JSON.parse(currentVocabWordsList);
    newVocabWordsList.splice(index, 1);

    await AsyncStorage.setItem("vocabWords", JSON.stringify(newVocabWordsList))
      .then(() => {
        setCheckedExists(false);
        console.log("Word deleted and vocab words list updated.");
      })
      .catch((e) => {
        console.log("There was an error while delete a vocab word from the vocab words list: ", e);
      });
  };

  const addVocabWord = async () => {
    Toast.show("Word added", {
      duration: Toast.durations.SHORT,
      backgroundColor: "gray",
      shadow: false,
      opacity: 0.8,
    });

    const vocabWordToAdd = {
      vocabWord: props.vocabWord,
      translatedWordList: props.translatedWordList,
      definitionsList: props.definitionsList,
    };

    const currentVocabWordsList = await AsyncStorage.getItem("vocabWords");

    if (!currentVocabWordsList) {
      const newVocabWordsList = [];
      newVocabWordsList.push(vocabWordToAdd);
      await AsyncStorage.setItem("vocabWords", JSON.stringify(newVocabWordsList))
        .then(() => {
          setCheckedExists(false);
          console.log("Vocab words list created and word added.");
        })
        .catch((e) => {
          console.log("There was an error while creating the vocab words list: ", e);
        });
    } else {
      const newVocabWordsList = JSON.parse(currentVocabWordsList);
      newVocabWordsList.push(vocabWordToAdd);
      await AsyncStorage.setItem("vocabWords", JSON.stringify(newVocabWordsList))
        .then(() => {
          setCheckedExists(false);
          console.log("Word added to vocab words list.");
        })
        .catch((e) => {
          console.log("There was an error while setting the vocab words list: ", e);
        });
    }
  };

  if (!checkedExists) {
    checkWordExists();
    setCheckedExists(true);
  }

  const renderSenses = () => {
    return props.translatedWordList.map((data, index) => {
      return (
        <View key={index}>
          <Text style={styles.translatedWordList}>
            {index + 1}. {data}
          </Text>
          <Text style={styles.definitionsList}>{props.definitionsList[index]}</Text>
        </View>
      );
    });
  };

  return (
    <View>
      <Text style={styles.vocabWord}>{props.vocabWord}</Text>
      {renderSenses()}
      {wordIndex === -1 ? (
        <TouchableWithoutFeedback onPress={() => addVocabWord()}>
          <Text style={[styles.addButton, { backgroundColor: COLORS.pastel_green }]}>ADD</Text>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={() => deleteVocabWord(wordIndex)}>
          <Text style={[styles.deleteButton, { backgroundColor: COLORS.pastel_orange }]}>DELETE</Text>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  vocabWord: {
    fontFamily: "Roboto-Black",
    fontSize: 40,
    color: "white",
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
    ...Platform.select({
      ios: {
        lineHeight: 75, // as same as height
      },
      android: {},
    }),
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
    ...Platform.select({
      ios: {
        lineHeight: 75, // as same as height
      },
      android: {},
    }),
  },
});

export default WordInfoComponent;
