import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Platform, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { COLORS } from "../config/colors.js";
import WordInfoComponent from "../components/WordInfoComponent.js";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

function WordListScreen({ route, navigation }) {
  const [searchInputText, setSearchInputText] = useState("");
  const [vocabWordsList, setVocabWordsList] = useState();
  const [vocabWordsListFound, setvocabWordsListFound] = useState(false);

  const getVocabWordList = async () => {
    const currentVocabWordsList = await AsyncStorage.getItem("vocabWords");

    if (!currentVocabWordsList) {
      setVocabWordsList([]);
    } else {
      setVocabWordsList(JSON.parse(currentVocabWordsList));
    }
    setvocabWordsListFound(true);
  };

  if (!vocabWordsListFound) {
    getVocabWordList();
  }

  const handleSearch = (text) => {
    console.log("Search");
  };

  const handleOnClear = () => {
    if (this.search != null) {
      this.search.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar
          ref={(search) => (this.search = search)}
          onClear={handleOnClear}
          round
          searchIcon={{ size: 25, color: "white", paddingLeft: 10 }}
          clearIcon={{ size: 20, color: "white" }}
          onChangeText={setSearchInputText}
          onSubmitEditing={(event) => handleSearch(event.nativeEvent.text)}
          placeholder="Search word.."
          placeholderTextColor="#e3f3ff"
          value={searchInputText}
          inputContainerStyle={{ backgroundColor: COLORS.pastel_blue }}
          leftIconContainerStyle={{ backgroundColor: COLORS.pastel_blue }}
          inputStyle={{
            backgroundColor: COLORS.pastel_blue,
            fontFamily: "Roboto-Regular",
            fontSize: 21,
            color: "white",
          }}
          containerStyle={{
            backgroundColor: COLORS.pastel_purple,
            justifyContent: "space-around",
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
        />
      </View>
      <ScrollView style={{ width: "100%" }}>
        <View>
          {vocabWordsListFound
            ? vocabWordsList.reverse().map((data, index) => {
                return (
                  <View style={styles.wordContainer} key={index}>
                    <WordInfoComponent
                      vocabWord={vocabWordsList[index].vocabWord}
                      translatedWordList={
                        vocabWordsList[index].translatedWordList
                      }
                      definitionsList={vocabWordsList[index].definitionsList}
                    ></WordInfoComponent>
                  </View>
                );
              })
            : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  wordContainer: {
    backgroundColor: COLORS.light_gray,
    margin: 25,
    marginTop: 0,
    padding: 25,
    borderRadius: 25,
  },
  searchBar: {
    width: "90%",
    height: 65,
    fontFamily: "Roboto-Regular",
    fontSize: 21,
    marginBottom: 25,
  },
  error: {
    height: 65,
    fontFamily: "Roboto-Regular",
    fontSize: 25,
    color: "#e3f3ff",
  },
});

export default WordListScreen;
