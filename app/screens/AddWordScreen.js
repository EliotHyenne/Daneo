import React from 'react';
import { StyleSheet, SafeAreaView, Platform, TextInput } from 'react-native';
import { COLORS } from '../config/colors.js';
import { Ionicons } from '@expo/vector-icons';

function AddWordScreen ({ route, navigation }) {
  
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons style={styles.searchIcon} name="md-search-sharp" color="#EDEDED" size={25}/>
      <TextInput 
        style={ styles.searchBar }
        placeholder="Search word"
        placeholderTextColor="#EDEDED">
      </TextInput>
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
  searchIcon: {
    backgroundColor: COLORS.pastel_blue,
    padding: 20,
    alignSelf: 'flex-start',
    width: 65,
    height: 65,
  },
  searchBar: {
    backgroundColor: COLORS.pastel_blue,
    color: 'white',
    width: '100%',
    height: 65,
    alignSelf: 'flex-start',
    fontFamily: 'Roboto-Regular',
    fontSize: 21,
  }
});

export default AddWordScreen;