import React, { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, TouchableWithoutFeedback, Platform, StatusBar, View } from "react-native";
import { COLORS } from "../config/colors.js";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useAppState } from "@react-native-community/hooks";
import { PieChart } from "react-native-svg-charts";
import * as svg from "react-native-svg";

const HomeScreen = ({ navigation }) => {
  const [wordListLength, setWordListLength] = useState(0);
  const [numNewWords, setNumNewWords] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [data, setData] = useState([]);
  const appState = useAppState();

  //Re-render when going to this screen through navigation to update states
  React.useEffect(() => {
    return navigation.addListener("focus", () => {
      getCounters();
    });
  }, [navigation]);

  const getCounters = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");

    if (!currentWordList) {
      setWordListLength(0);
    } else {
      setWordListLength(JSON.parse(currentWordList).length);
      let newWordsCounter = 0;
      let reviewsCounter = 0;
      let apprenticeCounter = 0;
      let guruCounter = 0;
      let masterCounter = 0;
      let enlightenCounter = 0;
      let burnCounter = 0;

      for (let word of JSON.parse(currentWordList)) {
        let currentWordObject = JSON.parse(await AsyncStorage.getItem(word));

        if (currentWordObject.learn) {
          newWordsCounter++;
        } else if (currentWordObject.nextReview - Date.now() <= 0) {
          currentWordObject.review = true;
          reviewsCounter++;
          await AsyncStorage.setItem(word, JSON.stringify(currentWordObject));
        }

        switch (currentWordObject.level) {
          case "Unranked":
            newWordsCounter++;
            break;
          case "Apprentice 1":
            apprenticeCounter++;
            break;
          case "Apprentice 2":
            apprenticeCounter++;
            break;
          case "Apprentice 3":
            apprenticeCounter++;
            break;
          case "Apprentice 4":
            apprenticeCounter++;
            break;
          case "Guru 1":
            guruCounter++;
            break;
          case "Guru 2":
            guruCounter++;
            break;
          case "Master":
            masterCounter++;
            break;
          case "Enlighten":
            enlightenCounter++;
            break;
          case "Burn":
            burnCounter++;
            break;
        }
      }

      let tempData = [
        { key: 0, amount: newWordsCounter, title: "Unseen", svg: { fill: "#dcdcdc" } },
        { key: 1, amount: apprenticeCounter, title: "Apprentice", svg: { fill: "#d3d3d3" } },
        { key: 2, amount: guruCounter, title: "Guru", svg: { fill: "#c0c0c0" } },
        { key: 3, amount: masterCounter, title: "Master", svg: { fill: "#a9a9a9" } },
        { key: 4, amount: enlightenCounter, title: "Enlighten", svg: { fill: "#808080" } },
        { key: 5, amount: burnCounter, title: "Burn", svg: { fill: "#696969" } },
      ];

      let finalData = [];
      for (let element of tempData) {
        if (element.amount > 0) {
          finalData.push(element);
        }
      }

      setData(finalData);
      setNumReviews(reviewsCounter);
      setNumNewWords(newWordsCounter);
    }
  };

  useEffect(() => {
    getCounters();
  }, []);

  useEffect(() => {
    if (appState !== "active") {
      console.log("Inactive");
      try {
        Notifications.setBadgeCountAsync(numReviews);
        console.log("Badge count number set to " + numReviews);
      } catch (err) {
        console.log("Counldn't change badge count number", err);
      }
    }
  }, [appState]);

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid } = slice;
      return (
        <svg.Text
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1] - 5}
          fontFamily={"Roboto-Thin"}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={15}
        >
          {data[index].title}
        </svg.Text>
      );
    });
  };
  const Counts = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid } = slice;
      return (
        <svg.Text
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1] + 15}
          fontFamily={"Roboto-Thin"}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"bottom"}
          fontSize={15}
        >
          {data[index].amount}
        </svg.Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Settings", { title: "SETTINGS" })}>
        <Ionicons style={styles.settings} name="settings-sharp" size={24} color="white" />
      </TouchableWithoutFeedback>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ top: Platform.OS === "ios" ? 50 : 0 }}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("WordList", { title: "WORD LIST" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_red }]}>{"WORDS" + " (" + wordListLength + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("LearnWord", { title: "LEARN WORD" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_blue }]}>{"LEARN" + " (" + numNewWords + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("Review", { title: "REVIEW" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_yellow }]}>{"REVIEW" + " (" + numReviews + ")"}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.navigate("AddWord", { title: "ADD WORD" })}>
              <Text style={[styles.button, { backgroundColor: COLORS.pastel_green }]}>ADD</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {wordListLength > 0 ? (
          <View>
            <PieChart style={{ height: 300 }} valueAccessor={({ item }) => item.amount} data={data} spacing={0} outerRadius={"100%"} innerRadius={55}>
              <Labels />
              <Counts />
            </PieChart>
            <Text style={{ fontFamily: "Roboto-Regular", fontSize: 15, color: "white", margin: 5, marginTop: 20, alignSelf: "center" }}>1.0.3</Text>
          </View>
        ) : null}
      </ScrollView>
      {wordListLength === 0 ? (
        <Text style={{ fontFamily: "Roboto-Regular", fontSize: 15, color: "white", margin: 5, marginTop: 20, alignSelf: "center" }}>1.0.3</Text>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 40 : 0,
  },
  button: {
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: 25,
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    fontSize: 25,
    color: "white",
    width: 300,
    height: 100,
    overflow: "hidden",
    lineHeight: Platform.OS === "ios" ? 100 : null,
  },
  settings: {
    alignSelf: "flex-end",
    margin: 20,
    marginTop: 0,
  },
});

export default HomeScreen;
