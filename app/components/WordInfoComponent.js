import React from 'react';
import { StyleSheet, SafeAreaView, Platform, View, ActivityIndicator, Button, Text, TouchableWithoutFeedback } from 'react-native';
import { COLORS } from '../config/colors';

const WordInfoComponent = (props) => {
  
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
        <TouchableWithoutFeedback onPress={() => console.log("ADD")}>
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
    marginTop: 15,
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