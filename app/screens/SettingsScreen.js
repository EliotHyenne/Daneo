import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Platform, Text } from "react-native";
import { COLORS } from "../config/colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import DropDownPicker from "react-native-dropdown-picker";

const SettingsScreen = ({ route, navigation }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "English", value: "1" },
    { label: "日本語", value: "2" },
  ]);

  const getTranslationLanguage = async () => {
    const currentTranslationLanguage = await AsyncStorage.getItem("@translationLanguage");

    if (!currentTranslationLanguage) {
      console.log("Here");
      await AsyncStorage.setItem("@translationLanguage", JSON.stringify("1"));
    }
  };

  useEffect(() => {
    getTranslationLanguage();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Translation language:</Text>
      <DropDownPicker
        textStyle={{
          fontSize: 15,
          fontFamily: "Roboto-Thin",
        }}
        defaultValue={value}
        placeholder="Select a language"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={async () => {
          await AsyncStorage.setItem("@translationLanguage", JSON.stringify(value));
          Toast.show("Saved changes", {
            duration: Toast.durations.SHORT,
            backgroundColor: "gray",
            shadow: false,
            opacity: 0.8,
          });
        }}
      />
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
    marginLeft: 0,
    color: "white",
  },
});

export default SettingsScreen;
