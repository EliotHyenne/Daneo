import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import { COLORS } from "../config/colors.js";
import WordInfoComponent from "../components/WordInfoComponent.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WordListScreen = ({ route, navigation }) => {
  const [searchInputText, setSearchInputText] = useState("");
  const [wordList, setWordList] = useState([]);
  const [filteredWordList, setFilteredWordList] = useState([]);

  const getWordList = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");

    if (currentWordList) {
      setWordList(JSON.parse(currentWordList));
      setFilteredWordList(JSON.parse(currentWordList));
    }
  };

  useEffect(() => {
    getWordList();
  }, []);

  const handleOnClear = () => {
    if (this.search != null) {
      this.search.focus();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.wordContainer}>
        <WordInfoComponent
          word={item.word}
          level={item.level}
          nextReview={item.nextReview}
          translatedWordList={item.translatedWordList}
          definitionsList={item.definitionsList}
        ></WordInfoComponent>
      </View>
    );
  };

  const filter = (text, element) => {
    if (element.word === text) {
      return true;
    }

    for (let i = 0; i < element.word.length; i++) {
      if (element.word.charAt(i) === text) {
        return true;
      }
    }

    for (let translation of element.translatedWordList) {
      if (translation != null && translation.toLowerCase() === text.toLowerCase()) {
        return true;
      }
    }

    for (let translation of element.translatedWordList) {
      if (
        translation != null &&
        translation
          .toLowerCase()
          .split(/[\s;【】・。]+/)
          .includes(text.toLowerCase())
      ) {
        return true;
      }
    }

    for (let definition of element.definitionsList) {
      if (
        definition != null &&
        definition
          .toLowerCase()
          .split(/[\s,.;:【】・。]+/)
          .includes(text.toLowerCase())
      ) {
        return true;
      }
    }
  };

  const handleSearch = (text) => {
    const data = wordList;
    if (text) {
      const filteredList = data.filter((element) => filter(text, element));
      setFilteredWordList(filteredList);
    } else {
      setFilteredWordList(data);
    }
    setSearchInputText(text);
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
          value={searchInputText}
          onChangeText={(value) => handleSearch(value)}
          placeholder="Search word.."
          placeholderTextColor="#e3f3ff"
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
      <FlatList
        data={filteredWordList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={[styles.error, { marginTop: 200 }]}>¯\(°_o)/¯</Text>}
      />
    </SafeAreaView>
  );
};

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
