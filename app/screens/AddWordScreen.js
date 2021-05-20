import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Platform, View, ActivityIndicator, Text } from "react-native";
import { SearchBar } from "react-native-elements";
import { COLORS } from "../config/colors.js";
import WordInfoComponent from "../components/WordInfoComponent.js";
import { ScrollView } from "react-native-gesture-handler";

const AddWordScreen = ({ route, navigation }) => {
  const [searchInputText, setSearchInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordFound, setWordFound] = useState(false);
  const [word, setWord] = useState("");
  const [translatedWordList, setTranslatedWordList] = useState([]);
  const [definitionsList, setDefinitionsList] = useState([]);

  const parseString = require("react-native-xml2js").parseString;

  //Find word item that contains translated word and translated definition
  const findItemIndex = (jsonData) => {
    var itemIndex = 0;
    const item = jsonData.channel.item;

    if (Array.isArray(item)) {
      while (true) {
        if (Array.isArray(item[itemIndex].sense)) {
          break;
        }
        if (item[itemIndex].sense.translation !== undefined) {
          break;
        }
        itemIndex++;
      }
    }
    return itemIndex;
  };

  const createWord = (jsonData) => {
    let newTranslatedWordList = [];
    let newDefinitionsList = [];
    let itemIndex = findItemIndex(jsonData);

    //Set the states using the correct word item
    if (Array.isArray(jsonData.channel.item)) {
      setWord(jsonData.channel.item[itemIndex].word._text);
      if (Array.isArray(jsonData.channel.item[itemIndex].sense)) {
        for (let sense of jsonData.channel.item[itemIndex].sense) {
          newTranslatedWordList.push(sense.translation.trans_word._cdata);
          newDefinitionsList.push(sense.translation.trans_dfn._cdata);
        }
      } else {
        newTranslatedWordList.push(jsonData.channel.item[itemIndex].sense.translation.trans_word._cdata);
        newDefinitionsList.push(jsonData.channel.item[itemIndex].sense.translation.trans_dfn._cdata);
      }
    } else {
      setWord(jsonData.channel.item.word._text);
      if (Array.isArray(jsonData.channel.item.sense)) {
        for (let sense of jsonData.channel.item.sense) {
          newTranslatedWordList.push(sense.translation.trans_word._cdata);
          newDefinitionsList.push(sense.translation.trans_dfn._cdata);
        }
      } else {
        newTranslatedWordList.push(jsonData.channel.item.sense.translation.trans_word._cdata);
        newDefinitionsList.push(jsonData.channel.item.sense.translation.trans_dfn._cdata);
      }
    }
    setTranslatedWordList(newTranslatedWordList);
    setDefinitionsList(newDefinitionsList);
  };

  const handleSearch = (text) => {
    setWordFound(false);
    setIsLoading(true);
    let url =
      "https://krdict.korean.go.kr/api/search?certkey_no=2546&key=BB8FF875370D0FF767AEA6E2586E62A4&type_search=search&method=WORD_INFO&part=word&sort=dict&translated=y&trans_lang=1&q=" +
      text;
    fetch(url)
      .then((response) => response.text())
      .then((response) => {
        parseString(response, function (err, res) {
          let convert = require("xml-js");
          let xml = response;
          let result = convert.xml2json(xml, { compact: true, spaces: 2 });
          let jsonData = JSON.parse(result);

          if (jsonData.channel.item === undefined) {
            setWordFound(false);
          } else {
            createWord(jsonData);
            setWordFound(true);
          }
          setIsLoading(false);
        });
      })
      .catch((e) => {
        console.log("There was a problem searching for a word: ", e);
      });
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
          autoFocus
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
      <ScrollView style={{ width: "100%" }}>
        <View>
          {wordFound ? (
            <View style={styles.wordContainer}>
              <WordInfoComponent word={word} translatedWordList={translatedWordList} definitionsList={definitionsList}></WordInfoComponent>
            </View>
          ) : null}
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
