import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, SafeAreaView, TouchableWithoutFeedback, Platform, StatusBar, View } from "react-native";
import { COLORS } from "../config/colors.js";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-svg-charts";
import * as Notifications from "expo-notifications";
import * as svg from "react-native-svg";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HomeScreen = ({ navigation }) => {
  const [wordListLength, setWordListLength] = useState(0);
  const [numNewWords, setNumNewWords] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [data, setData] = useState([]);
  const [nextReviewTime, setNextReviewTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      getCounters();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCounters = async () => {
    const currentWordList = await AsyncStorage.getItem("@wordList");

    if (!currentWordList) {
      setWordListLength(0);
    } else {
      setWordListLength(JSON.parse(currentWordList).length);
      let newWordsCounter = 0;
      let unseenCounter = 0;
      let reviewsCounter = 0;
      let apprenticeCounter = 0;
      let guruCounter = 0;
      let masterCounter = 0;
      let enlightenCounter = 0;
      let burnCounter = 0;
      let tempNextReviewTime = Infinity;

      for (let word of JSON.parse(currentWordList)) {
        let currentWordObject = JSON.parse(await AsyncStorage.getItem(word));

        if (currentWordObject.learn) {
          newWordsCounter++;
          unseenCounter++;
        } else if (currentWordObject.nextReview - Date.now() <= 0) {
          currentWordObject.review = true;
          reviewsCounter++;
          await AsyncStorage.setItem(word, JSON.stringify(currentWordObject));
        }

        if (!currentWordObject.learn) {
          if (currentWordObject.nextReview - Date.now() > 0 && currentWordObject.nextReview - Date.now() < tempNextReviewTime) {
            tempNextReviewTime = currentWordObject.nextReview - Date.now();
          }
        }

        switch (currentWordObject.level) {
          case "Unranked":
            unseenCounter++;
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
        { key: 0, amount: unseenCounter, title: "Unseen", svg: { fill: "#dcdcdc" } },
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
      setNextReviewTime(tempNextReviewTime);
    }
  };

  useEffect(() => {
    getCounters();
  }, []);

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid } = slice;
      return (
        <svg.Text
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1] - 5}
          fontFamily={Platform.OS === "android" ? "Roboto-Bold" : ""}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={Platform.OS === "android" ? 17 : 15}
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
          fontFamily={Platform.OS === "android" ? "Roboto-Bold" : ""}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"bottom"}
          fontSize={Platform.OS === "android" ? 17 : 15}
        >
          {data[index].amount}
        </svg.Text>
      );
    });
  };

  const renderNextReviewTime = () => {
    let x = nextReviewTime / 1000;
    const seconds = x % 60;
    x /= 60;
    const minutes = x % 60;
    x /= 60;
    const hours = x % 24;
    x /= 24;
    const days = x;

    let str = "Next review in ";

    if (Math.floor(days) > 0) {
      str += Math.floor(days) + " day(s) ";
    }
    if (Math.floor(hours) > 0) {
      str += Math.floor(hours) + " hour(s) ";
    }
    if (Math.floor(minutes) > 0) {
      str += Math.floor(minutes) + " min ";
    }
    if (Math.floor(seconds) > 0) {
      str += Math.floor(seconds) + " sec";
    }

    if (nextReviewTime < Infinity) {
      return <Text style={styles.nextReviewTime}>{str}</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Settings", { title: "SETTINGS" })}>
        <Ionicons style={styles.settings} name="settings-sharp" size={24} color="white" />
      </TouchableWithoutFeedback>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View>
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
            {renderNextReviewTime()}
          </View>
        </View>
        {wordListLength > 0 ? (
          <View>
            <PieChart
              style={{ height: Dimensions.get("window").width - 25, marginBottom: 25 }}
              valueAccessor={({ item }) => item.amount}
              data={data}
              spacing={0}
              outerRadius={"100%"}
              innerRadius={55}
            >
              <Labels />
              <Counts />
            </PieChart>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pastel_purple,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 0,
  },
  button: {
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    marginBottom: 25,
    borderRadius: 25,
    fontFamily: "Roboto-Black",
    fontSize: 25,
    color: "white",
    height: 100,
    width: Dimensions.get("window").width - 70,
    overflow: "hidden",
    lineHeight: Platform.OS === "ios" ? 100 : null,
  },
  nextReviewTime: {
    textAlign: "center",
    textAlignVertical: "center",
    alignSelf: "center",
    marginBottom: 25,
    borderRadius: 25,
    fontFamily: "Roboto-Light",
    fontSize: 15,
    color: "white",
  },
  settings: {
    alignSelf: "flex-end",
    margin: 20,
    marginTop: 0,
  },
});

export default HomeScreen;
