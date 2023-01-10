import * as React from "react";

import { Text, View, Platform, StyleSheet, Dimensions } from "react-native";

//Import Assets
import { imageIllustrationNoActiveChat } from "./../../assets/icons";
import { moderateScale } from "./Scaling";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

export default (EmptyComponent = () => {
  return (
    <View style={styles.containListEmpty}>
      {imageIllustrationNoActiveChat("100%", moderateScale(250))}
      <Text style={styles.txt1ListEmpty}>No active chat yet</Text>
      <Text style={styles.txt2ListEmpty}>
        It looks like your screen is still clean! {"\n"}
        Why don't you start serving customers?
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containListEmpty: {
    width: dimenWidth,
    alignItems: "center",
    justifyContent: "center",
    height: dimenHeight / 1.33,
    paddingHorizontal: moderateScale(10)
  },
  txt1ListEmpty: {
    color: "#A5A5A5",
    fontWeight: "500",
    letterSpacing: 0.1,

    fontSize: moderateScale(22),
    textTransform: "capitalize",
    lineHeight: moderateScale(24)
  },
  txt2ListEmpty: {
    color: "#A5A5A5",
    fontWeight: "300",
    letterSpacing: 0.1,

    textTransform: "capitalize",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(24)
  }
});
