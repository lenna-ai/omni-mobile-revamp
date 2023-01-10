import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  BannerAvatar,
  BgWorkspace,
  Icon3dot,
  IconBell,
  IconGhost,
  IconHumberger
} from "../../../../assets";
import { moderateScale } from "../../../other/Scaling";

const WelcomeBanner = () => {
  return (
    <View style={styles.contentBannerWelcome}>
      <View style={styles.txtWelcomeBanner}>
        <Text style={styles.txtTitle}>Welcome!</Text>
        <Text style={styles.txtDesc}>
          Lets increase conversions, build engagement, and create meaningful
          interactions with your customers.
        </Text>
      </View>
      <View style={styles.avatarStyle}>
        <BannerAvatar height={171} width={102} />
      </View>
    </View>
  );
};

export default WelcomeBanner;

const styles = StyleSheet.create({
  contentBannerWelcome: {
    height: moderateScale(148),
    width: "100%",
    backgroundColor: "#323F6B",
    borderRadius: moderateScale(8),
    marginTop: moderateScale(46),
    flexDirection: "row",
    position: "relative"
  },
  txtWelcomeBanner: {
    width: "65%",
    padding: moderateScale(16)
  },
  txtTitle: {
    fontWeight: "bold",
    fontSize: moderateScale(24),
    color: "white"
  },
  txtDesc: {
    color: "white",
    fontSize: moderateScale(12),
    marginTop: moderateScale(10)
  },
  avatarStyle: {
    height: 200,
    width: 100,
    position: "absolute",
    bottom: -10,
    right: 30
  }
});
