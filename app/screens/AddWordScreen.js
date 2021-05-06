import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Platform, View, ActivityIndicator, Text } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useFonts } from 'expo-font';
import { COLORS } from '../config/colors.js';
import AppLoading from 'expo-app-loading';
import WordInfoComponent from '../components/WordInfoComponent.js';
import { ScrollView } from 'react-native-gesture-handler';

function AddWordScreen ({route, navigation}) {
  const [searchInputText, setSearchInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [wordFound, setWordFound] = useState(false)
  const [vocabWord, setVocabWord] = useState("")
  const [translatedWordList, setTranslatedWordList] = useState([])
  const [definitionsList, setDefinitionsList] = useState([])

  const parseString = require('react-native-xml2js').parseString;

  const createWord = (jsonData) => {
    var newTranslatedWordList = []
    var newDefinitionsList = []

    if (Array.isArray(jsonData.channel.item)) {
      setVocabWord(jsonData.channel.item[0].word._text);
      if (Array.isArray(jsonData.channel.item[0].sense)) {
        for (var i = 0; i < jsonData.channel.item[0].sense.length; i++) {
          newTranslatedWordList.push(jsonData.channel.item[0].sense[i].translation.trans_word._cdata);
          newDefinitionsList.push(jsonData.channel.item[0].sense[i].translation.trans_dfn._cdata);
        }
      } else {
        newTranslatedWordList.push(jsonData.channel.item[0].sense.translation.trans_word._cdata);
        newDefinitionsList.push(jsonData.channel.item[0].sense.translation.trans_dfn._cdata);
      }
    } else {
      setVocabWord(jsonData.channel.item.word._text);
      if (Array.isArray(jsonData.channel.item.sense)) {
        for (var i = 0; i < jsonData.channel.item[0].sense.length; i++) {
          newTranslatedWordList.push(jsonData.channel.item[0].sense[i].translation.trans_word._cdata);
          newDefinitionsList.push(jsonData.channel.item[0].sense[i].translation.trans_dfn._cdata);
        }
      } else {
        newTranslatedWordList.push(jsonData.channel.item.sense.translation.trans_word._cdata);
        newDefinitionsList.push(jsonData.channel.item.sense.translation.trans_dfn._cdata);
      }
    }
    setTranslatedWordList(newTranslatedWordList);
    setDefinitionsList(newDefinitionsList)
  }
 
  const handleSearch =  (text) => {
    if (text === '') {
      setWordFound(false)
    } else {
      setWordFound(false)
      setIsLoading(true)
      var url = 'https://krdict.korean.go.kr/api/search?certkey_no=2546&key=BB8FF875370D0FF767AEA6E2586E62A4&type_search=search&method=WORD_INFO&part=word&sort=dict&translated=y&trans_lang=1&q=' + text
      fetch(url)
        .then(response => response.text())
        .then((response) => {
            parseString(response, function (err, res) {
                var convert = require('xml-js');
                var xml = response
                var result = convert.xml2json(xml, {compact: true, spaces: 2});
                var jsonData = JSON.parse(result);

                console.log(result)

                if (jsonData.channel.total._text === "0") {
                  setWordFound(false)
                } else {
                  createWord(jsonData)
                  setWordFound(true)
                }
                setIsLoading(false)
            });
          }).catch((err) => {
            console.log("search", err)
          })
    }
  }

  const handleOnClear = () => {
    if (this.search != null) {
      this.search.focus()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar
          ref={search => this.search = search}
          onClear={handleOnClear}
          round
          autoFocus
          searchIcon={{size: 25, color: 'white', paddingLeft:10}}
          clearIcon={{size: 20, color: 'white'}}
          onChangeText={setSearchInputText}
          onSubmitEditing={(event) => handleSearch(event.nativeEvent.text)}
          placeholder="Search word.."
          placeholderTextColor="#e3f3ff"
          value={searchInputText}
          inputContainerStyle={{backgroundColor: COLORS.pastel_blue}}
          leftIconContainerStyle={{backgroundColor: COLORS.pastel_blue}}
          inputStyle={{
            backgroundColor: COLORS.pastel_blue,
            fontFamily: 'Roboto-Regular',
            fontSize: 21,
            color: 'white',
          }}
          containerStyle={{
            backgroundColor: COLORS.pastel_purple,
            justifyContent: 'space-around',
            borderTopWidth:0,
            borderBottomWidth:0,
          }}
        />
        
      </View>
      <View style={styles.loading}>
        {isLoading ? (
          <ActivityIndicator size="large" color='white'/>
        ) : null}
      </View>
      <View style={{top: 200}}>
        {!wordFound && !isLoading ? (
          <Text style={styles.error}>¯\(°_o)/¯ </Text>
        ) : null}
      </View>
      <ScrollView>
        <View>
          {wordFound ? (
              <WordInfoComponent vocabWord={vocabWord} translatedWordList={translatedWordList} definitionsList={definitionsList}></WordInfoComponent>
            ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: 'center',
  },
  loading: {
    top: 200,
  },
  searchBar: {
    width: '90%',
    height: 65,
    fontFamily: 'Roboto-Regular',
    fontSize: 21,
  },
  error: {
    height: 65,
    fontFamily: 'Roboto-Regular',
    fontSize: 25,
    color: '#e3f3ff',
  }
});

export default AddWordScreen;