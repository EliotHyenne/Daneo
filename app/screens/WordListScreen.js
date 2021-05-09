import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Platform, View, Text } from "react-native";
import { SearchBar } from "react-native-elements";
import { COLORS } from "../config/colors.js";
import WordInfoComponent from "../components/WordInfoComponent.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native";

const WordListScreen = ({ route, navigation }) => {
  const [searchInputText, setSearchInputText] = useState("");
  const [vocabList, setVocabList] = useState();
  const [filteredVocabList, setFilteredVocabList] = useState();
  const [vocabListFound, setVocabListFound] = useState(false);
  const [vocabListEmpty, setVocabListEmpty] = useState(true);

  const getVocabWordList = async () => {
    const currentVocabList = await AsyncStorage.getItem("@vocabList");

    if (!currentVocabList) {
      setVocabList([]);
      setFilteredVocabList([]);
    } else {
      setVocabList(JSON.parse(currentVocabList).reverse());
      setFilteredVocabList(JSON.parse(currentVocabList).reverse());
      if (JSON.parse(currentVocabList).length > 0) {
        setVocabListEmpty(false);
      }
    }
    setVocabListFound(true);
  };

  if (!vocabListFound) {
    getVocabWordList();
  }

  const handleOnClear = () => {
    if (this.search != null) {
      this.search.focus();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.wordContainer}>
        <WordInfoComponent
          vocabWord={item.vocabWord}
          translatedWordList={item.translatedWordList}
          definitionsList={item.definitionsList}
        ></WordInfoComponent>
      </View>
    );
  };

  const filter = (text, element) => {
    if (element.vocabWord === text) {
      return true;
    }

    for (var i = 0; i < element.vocabWord.length; i++) {
      if (element.vocabWord.charAt(i) === text) {
        return true;
      }
    }

    for (i = 0; i < element.translatedWordList.length; i++) {
      if (
        element.translatedWordList[i]
          .toLowerCase()
          .split(/[\s;]+/)
          .includes(text.toLowerCase())
      ) {
        return true;
      }
    }

    for (i = 0; i < element.definitionsList.length; i++) {
      if (
        element.definitionsList[i]
          .toLowerCase()
          .split(/[\s,.;:]+/)
          .includes(text.toLowerCase())
      ) {
        return true;
      }
    }
  };

  const handleSearch = (text) => {
    const data = vocabList;
    if (text) {
      const filteredList = data.filter((element) => filter(text, element));
      setFilteredVocabList(filteredList);
    } else {
      setFilteredVocabList(data);
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
      {!vocabListFound || vocabListEmpty ? (
        <View style={{ top: 200 }}>
          <Text style={styles.error}>¯\(°_o)/¯</Text>
        </View>
      ) : null}
      <FlatList data={filteredVocabList} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
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
