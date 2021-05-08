import React, { useState } from "react";
import { StyleSheet, Text, SafeAreaView, TouchableWithoutFeedback, Platform, StatusBar, View } from "react-native";
import { COLORS } from "../config/colors.js";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [vocabWordsListFound, setVocabWordsListFound] = useState(false);
  const [vocabWordsListLength, setVocabWordsListLength] = useState(0);

  //Re-render when going to this screen through navigation to update states
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setVocabWordsListFound(false);
    });
    return unsubscribe;
  }, [navigation]);

  const getVocabWordsListLength = async () => {
    const currentVocabWordsList = await AsyncStorage.getItem("vocabWords");

    if (!currentVocabWordsList) {
      setVocabWordsListLength(0);
    } else {
      setVocabWordsListLength(JSON.parse(currentVocabWordsList).length);
    }
    setVocabWordsListFound(true);
  };

  if (!vocabWordsListFound) {
    getVocabWordsListLength();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={{ top: Platform.OS === "ios" ? 50 : 0 }}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("WordList", { title: "WORD LIST" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_orange }]}>{"WORDS" + " (" + vocabWordsListLength + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("LESSON")}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_blue }]}>LESSON</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("REVIEW")}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_yellow }]}>REVIEW</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("AddWord", { title: "ADD WORD" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_green }]}>ADD</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 40 : 0,
  },
  button: {
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: 25,
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    fontSize: 25,
    color: "white",
    width: 300,
    height: 100,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        lineHeight: 100, // as same as height
      },
      android: {},
    }),
  },
});

export default HomeScreen;
