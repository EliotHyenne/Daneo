import React from 'react';
import { StyleSheet, Platform, View, Text, TouchableWithoutFeedback } from 'react-native';
import { COLORS } from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage'

const WordInfoComponent = (props) => {

  const addVocabWord = async () => {
    const vocabWordToAdd = {vocabWord: props.vocabWord, translatedWordsList: props.translatedWordList, definitionsList: props.definitionsList}
    const currentVocabWordsList = await AsyncStorage.getItem('vocabWords')

    if(!currentVocabWordsList) {
      const newVocabWordsList = []
      newVocabWordsList.push(vocabWordToAdd)
      await AsyncStorage.setItem('vocabWords', JSON.stringify(newVocabWordsList))
      .then(() => {
        console.log("Vocab words list created and word added.")
      })
      .catch((e) => {
        console.log("There was an error while creating the vocab words list: ", e)
      })
    } else {
      const newVocabWordsList = JSON.parse(currentVocabWordsList)
      newVocabWordsList.push(vocabWordToAdd)
      console.log(newVocabWordsList)
      await AsyncStorage.setItem('vocabWords', JSON.stringify(newVocabWordsList))
      .then(() => {
        console.log("Word added to vocab words list.")
      })
      .catch((e) => {
        console.log("There was an error while saving the vocab words list: ", e)
      })
    }
  }

  const renderSenses= () => {
    return (
      props.translatedWordList.map((data, index) => {
        return (
          <View key={index}>
            <Text style={styles.translatedWordList}>{index + 1}. {data}</Text>
            <Text style={styles.definitionsList}>{props.definitionsList[index]}</Text>
          </View>
        );
      })
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.vocabWord}>{props.vocabWord}</Text>
        {renderSenses()}
        <TouchableWithoutFeedback onPress={() => addVocabWord()}>
          <Text style={[styles.button, {backgroundColor:COLORS.pastel_green}]}>
            ADD 
          </Text>
        </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light_gray,
    margin: 25,
    padding: 25,
    borderRadius: 25,
  },
  vocabWord: {
    fontFamily: 'Roboto-Black',
    fontSize: 40,
    color: 'white',
  },
  translatedWordList: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: 'white',
    marginTop: 15,
  },
  definitionsList: {
    fontFamily: 'Roboto-Light',
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
  },
  button: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 25,
    fontFamily: 'Roboto-Black',
    fontSize: 25,
    color: 'white',
    width: 125,
    height: 75,
    overflow: 'hidden',
    marginTop: 25,
    ...Platform.select({
      ios: {
          lineHeight: 75 // as same as height
      },
      android: {}
    }),
  }
});

export default WordInfoComponent;