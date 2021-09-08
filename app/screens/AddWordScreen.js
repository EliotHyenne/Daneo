import React, { useState } from "react";
import { FlatList, StyleSheet, SafeAreaView, Platform, View, ActivityIndicator, Text } from "react-native";
import { SearchBar } from "react-native-elements";
import { COLORS } from "../config/colors.js";
import WordInfoComponent from "../components/WordInfoComponent.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddWordScreen = ({ route, navigation }) => {
  const [searchInputText, setSearchInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordFound, setWordFound] = useState(false);
  const [translationLanguageFound, setTranslationLanguageFound] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState("");
  const [wordList, setWordList] = useState([]);

  const parseString = require("react-native-xml2js").parseString;

  React.useEffect(() => {
    setTimeout(() => this.search.focus(), 50);
  }, []);

  const createWordList = (jsonData) => {
    if (parseInt(jsonData.channel.total._text) > 1) {
      for (let currentItem of jsonData.channel.item) {
        if (Array.isArray(currentItem.sense) || currentItem.sense.translation !== undefined) {
          createWord(currentItem);
        }
      }
    } else {
      if (Array.isArray(jsonData.channel.item.sense) || jsonData.channel.item.sense.translation !== undefined) {
        createWord(jsonData.channel.item);
      }
    }
  };

  const getTranslationLanguage = async () => {
    const currentTranslationLanguage = await AsyncStorage.getItem("@translationLanguage");

    if (!currentTranslationLanguage) {
      await AsyncStorage.setItem("@translationLanguage", JSON.stringify("1"));
    }
    setTranslationLanguage(JSON.parse(currentTranslationLanguage));
    setTranslationLanguageFound(true);
  };

  if (!translationLanguageFound) {
    getTranslationLanguage();
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.wordContainer}>
        <WordInfoComponent word={item[0]} translatedWordList={item[1]} definitionsList={item[2]}></WordInfoComponent>
      </View>
    );
  };

  const createWord = (item) => {
    let newTranslatedWordList = [];
    let newDefinitionsList = [];
    let newWordItem = [];

    //Set the states using the correct word item
    if (Array.isArray(item)) {
      newWordItem.push(item[itemIndex].word._text);
      if (Array.isArray(item[itemIndex].sense)) {
        for (let sense of item[itemIndex].sense) {
          newTranslatedWordList.push(sense.translation.trans_word._cdata);
          newDefinitionsList.push(sense.translation.trans_dfn._cdata);
        }
      } else {
        newTranslatedWordList.push(item[itemIndex].sense.translation.trans_word._cdata);
        newDefinitionsList.push(item[itemIndex].sense.translation.trans_dfn._cdata);
      }
    } else {
      newWordItem.push(item.word._text);
      if (Array.isArray(item.sense)) {
        for (let sense of item.sense) {
          newTranslatedWordList.push(sense.translation.trans_word._cdata);
          newDefinitionsList.push(sense.translation.trans_dfn._cdata);
        }
      } else {
        newTranslatedWordList.push(item.sense.translation.trans_word._cdata);
        newDefinitionsList.push(item.sense.translation.trans_dfn._cdata);
      }
    }
    newWordItem.push(newTranslatedWordList);
    newWordItem.push(newDefinitionsList);

    setWordList((wordList) => [...wordList, newWordItem]);
  };

  const handleSearch = (text) => {
    if (text) {
      setWordList([]);
      setWordFound(false);
      setIsLoading(true);
      let url =
        "https://krdict.korean.go.kr/api/search?certkey_no=2546&key=BB8FF875370D0FF767AEA6E2586E62A4&type_search=search&method=WORD_INFO&part=word&sort=dict&translated=y&trans_lang=" +
        translationLanguage +
        "&q=" +
        text;
      fetch(url)
        .then((response) => response.text())
        .then((response) => {
          parseString(response, function (err, res) {
            let convert = require("xml-js");
            let xml = response;
            let result = convert.xml2json(xml, { compact: true, spaces: 2 });
            let jsonData = JSON.parse(result);

            if (parseInt(jsonData.channel.total._text) === 0) {
              setWordFound(false);
            } else {
              createWordList(jsonData);
              setWordFound(true);
            }
            setIsLoading(false);
          });
        })
        .catch((e) => {
          console.log("There was a problem searching for a word: ", e);
        });
    } else {
      setWordFound(false);
    }
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
      <View style={styles.loading}>{isLoading ? <ActivityIndicator size="large" color="white" /> : null}</View>
      <View style={{ top: 200 }}>{!wordFound && !isLoading ? <Text style={styles.error}>¯\(°_o)/¯</Text> : null}</View>
      <FlatList data={wordList} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
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
  loading: {
    top: 200,
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

export default AddWordScreen;
