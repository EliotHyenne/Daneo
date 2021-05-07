import React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableWithoutFeedback, Platform, StatusBar, View, Image } from 'react-native';
import { COLORS } from '../config/colors.js';
import { ScrollView } from 'react-native-gesture-handler';

function HomeScreen ({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={{top: Platform.OS === "ios" ? 50 : 0}}>
            <TouchableWithoutFeedback onPress={() => console.log("WORDS")}>
              <Text style={[styles.button, {backgroundColor:COLORS.pastel_orange}]}>
                WORDS
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("LESSON")}>
              <Text style={[styles.button, {backgroundColor:COLORS.pastel_blue}]}>
                LESSON
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => console.log("REVIEW")}>
              <Text style={[styles.button, {backgroundColor:COLORS.pastel_yellow}]}>
                REVIEW 
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('AddWord', {
              title: "ADD WORD",
            })}>
              <Text style={[styles.button, {backgroundColor:COLORS.pastel_green}]}>
                ADD 
              </Text>
            </TouchableWithoutFeedback>
          </View>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 40 : 0,
  },
  button: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 25,
    borderRadius: 25,
    fontFamily: 'Roboto-Black',
    fontSize: 25,
    color: 'white',
    width: 300,
    height: 100,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
          lineHeight: 100 // as same as height
      },
      android: {}
    }),
  }
});

export default HomeScreen;