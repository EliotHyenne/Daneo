import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Platform, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useFonts } from 'expo-font';
import { COLORS } from '../config/colors.js';
import AppLoading from 'expo-app-loading';

function AddWordScreen ({route, navigation}) {
  const [searchInputText, setSearchInputText] = useState("")
  const [isLoaded] = useFonts({
    'Roboto-Black': require("../assets/fonts/Roboto-Black.ttf"),
    'Roboto-BlackItalic': require("../assets/fonts/Roboto-BlackItalic.ttf"),
    'Roboto-Bold': require("../assets/fonts/Roboto-Bold.ttf"),
    'Roboto-BoldItalic': require("../assets/fonts/Roboto-BoldItalic.ttf"),
    'Roboto-Italic': require("../assets/fonts/Roboto-Italic.ttf"),
    'Roboto-Light': require("../assets/fonts/Roboto-Light.ttf"),
    'Roboto-LightItalic': require("../assets/fonts/Roboto-LightItalic.ttf"),
    'Roboto-Medium': require("../assets/fonts/Roboto-Medium.ttf"),
    'Roboto-MediumItalic': require("../assets/fonts/Roboto-MediumItalic.ttf"),
    'Roboto-Regular': require("../assets/fonts/Roboto-Regular.ttf"),
    'Roboto-Thin': require("../assets/fonts/Roboto-Thin.ttf"),
    'Roboto-ThinItalic': require("../assets/fonts/Roboto-ThinItalic.ttf"),
  });

  if (!isLoaded) {
    return <AppLoading/>;
  }

  const parseString = require('react-native-xml2js').parseString;
 
  const handleSearch =  (text) => {
    var url = 'https://krdict.korean.go.kr/api/search?certkey_no=2546&key=BB8FF875370D0FF767AEA6E2586E62A4&type_search=search&method=WORD_INFO&part=word&sort=dict&translated=y&trans_lang=2&q=' + text
    fetch(url)
      .then(response => response.text())
      .then((response) => {
          parseString(response, function (err, result) {
              console.log(response)
              var convert = require('xml-js');
              var xml = response
              var result1 = convert.xml2json(xml, {compact: true, spaces: 2});
              console.log("result1----"+result1);
              console.log("result2----"+result2);
          });
        }).catch((err) => {
          console.log("search", err)
        })
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar
          round
          autoFocus
          searchIcon={{size: 25, color: 'white', paddingLeft:10}}
          clearIcon={{size: 20, color: 'white'}}
          onChangeText={setSearchInputText}
          onSubmitEditing={(event) => handleSearch(event.nativeEvent.text)}
          placeholder="Search word..."
          placeholderTextColor="#EDEDED"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  searchBar: {
    width: '100%',
    height: 65,
    alignSelf: 'flex-start',
    fontFamily: 'Roboto-Regular',
    fontSize: 21,
  }
});

export default AddWordScreen;