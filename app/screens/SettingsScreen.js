import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Platform, Text, TouchableWithoutFeedback, Alert, View } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import DropDownPicker from "react-native-dropdown-picker";

const SettingsScreen = ({ route, navigation }) => {
  const appData = require("../../app.json");
  const [translationLanguageMenuOpen, setTranslationLanguageMenuOpen] = useState(false);
  const [translationLanguageMenuValue, setTranslationLanguageMenuValue] = useState(null);
  const [translationLanguageMenuItems, setTranslationLanguageMenuItems] = useState([
    { label: "English", value: "1" },
    { label: "日本語", value: "2" },
  ]);
  const [reviewBatchSizeMenuOpen, setReviewBatchSizeMenuOpen] = useState(false);
  const [reviewBatchSizeMenuValue, setReviewBatchSizeMenuValue] = useState(null);
  const [reviewBatchSizeMenuItems, setReviewBatchSizeMenuItems] = useState([
    { label: "5", value: "5" },
    { label: "10", value: "10" },
    { label: "15", value: "15" },
    { label: "20", value: "20" },
    { label: "25", value: "25" },
    { label: "30", value: "30" },
    { label: "35", value: "35" },
    { label: "40", value: "40" },
    { label: "45", value: "45" },
    { label: "50", value: "50" },
  ]);

  const getTranslationLanguage = async () => {
    const currentTranslationLanguage = await AsyncStorage.getItem("@translationLanguage");

    if (!currentTranslationLanguage) {
      await AsyncStorage.setItem("@translationLanguage", JSON.stringify("1"));
    }
  };

  const getReviewBatchSize = async () => {
    const currentReviewBatchSize = await AsyncStorage.getItem("@reviewBatchSize");

    if (!currentReviewBatchSize) {
      await AsyncStorage.setItem("@reviewBatchSize", JSON.stringify("5"));
    }
  };

  useEffect(() => {
    getTranslationLanguage();
  }, []);

  useEffect(() => {
    getReviewBatchSize();
  }, []);

  const clearData = async () => {
    Toast.show("Data cleared", {
      duration: Toast.durations.SHORT,
      backgroundColor: "gray",
      shadow: false,
      opacity: 0.8,
    });
    AsyncStorage.clear();
  };

  const confirmDelete = () => {
    Alert.alert(
      "Clear",
      "Are you sure you want to clear your data?\n\nThis action will remove all of your vocabulary words and progress, it cannot be undone.",
      [{ text: "Yes", onPress: () => clearData() }, { text: "No" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Translation language:</Text>
      <DropDownPicker
        textStyle={{
          fontSize: 15,
          fontFamily: "Roboto-Thin",
        }}
        style={{ width: "75%", marginLeft: 10 }}
        defaultValue={translationLanguageMenuValue}
        placeholder="Select a language"
        open={translationLanguageMenuOpen}
        value={translationLanguageMenuValue}
        items={translationLanguageMenuItems}
        setOpen={setTranslationLanguageMenuOpen}
        setValue={setTranslationLanguageMenuValue}
        setItems={setTranslationLanguageMenuItems}
        onChangeValue={async () => {
          await AsyncStorage.setItem("@translationLanguage", JSON.stringify(translationLanguageMenuValue));
          Toast.show("Saved changes", {
            duration: Toast.durations.SHORT,
            backgroundColor: "gray",
            shadow: false,
            opacity: 0.8,
          });
        }}
      />
      <Text style={styles.text2}>Review batch size:</Text>
      <DropDownPicker
        textStyle={{
          fontSize: 15,
          fontFamily: "Roboto-Thin",
        }}
        style={{ width: "75%", marginLeft: 10 }}
        defaultValue={reviewBatchSizeMenuValue}
        placeholder="Select a review batch size"
        open={reviewBatchSizeMenuOpen}
        value={reviewBatchSizeMenuValue}
        items={reviewBatchSizeMenuItems}
        setOpen={setReviewBatchSizeMenuOpen}
        setValue={setReviewBatchSizeMenuValue}
        setItems={setReviewBatchSizeMenuItems}
        onChangeValue={async () => {
          await AsyncStorage.setItem("@reviewBatchSize", JSON.stringify(reviewBatchSizeMenuValue));
          Toast.show("Saved changes", {
            duration: Toast.durations.SHORT,
            backgroundColor: "gray",
            shadow: false,
            opacity: 0.8,
          });
        }}
      />
      <View style={styles.container2}>
        <Text style={styles.text3}>Clear data:</Text>
        <TouchableWithoutFeedback onPress={() => confirmDelete()}>
          <Text style={[styles.deleteButton, { backgroundColor: COLORS.pastel_red }]}>CLEAR</Text>
        </TouchableWithoutFeedback>
      </View>
      <Text style={{ fontFamily: "Roboto-Regular", fontSize: 15, color: "white", marginTop: 15, alignSelf: "center" }}>
        {"Version " + appData.expo.version}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: "center",
    padding: 25,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  text: {
    fontFamily: "Roboto-Black",
    alignSelf: "flex-start",
    fontSize: 25,
    margin: 5,
    marginLeft: 10,
    marginTop: 25,
    color: "white",
  },
  text2: {
    fontFamily: "Roboto-Black",
    alignSelf: "flex-start",
    fontSize: 25,
    margin: 5,
    marginLeft: 10,
    marginTop: 85,
    color: "white",
  },
  container2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignSelf: "flex-start",
  },
  text3: {
    fontFamily: "Roboto-Black",
    fontSize: 25,
    margin: 5,
    marginLeft: 10,
    color: "white",
  },
  deleteButton: {
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    fontSize: 25,
    color: "white",
    width: 150,
    height: 75,
    overflow: "hidden",
    marginLeft: 10,
    lineHeight: Platform.OS === "ios" ? 75 : null,
  },
});

export default SettingsScreen;
