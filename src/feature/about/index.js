import * as React from "react";

import {
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";

// Import Image Icons
import {
  imageLogoLennaOmni,
  imageLogoOmnimobile,
  imageIllustrationBg
} from "./../../assets/icons";
import { moderateScale } from "../other/Scaling";

import { imageIconBackBlack } from "./../../assets/icons";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const AboutApp = ({ navigation }) => {
  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <View
        style={{
          position: "absolute",
          top: 0,
          flexDirection: "row",
          alignItems: "center",
          width: "90%",
          height: 60,
          zIndex: 5,
          marginTop: Platform.OS === "ios" ? 30 : 0
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {imageIconBackBlack(moderateScale(32), moderateScale(32))}
        </TouchableOpacity>
      </View>
      {imageIllustrationBg(dimenWidth, dimenHeight)}

      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <View style={{ marginVertical: dimenHeight / 15 }}>
          {Platform.OS == "android"
            ? imageLogoLennaOmni(moderateScale(100), moderateScale(46))
            : <Image
                width={moderateScale(100)}
                height={moderateScale(46)}
                source={require("./../../assets/image/logo_lenna.png")}
              />}
        </View>
        <View>
          {imageLogoOmnimobile(dimenWidth - 160, 307)}
        </View>
        <Text
          style={{
            color: "#4F4F4F",
            fontSize: moderateScale(12),
            lineHeight: moderateScale(24),
            marginTop: moderateScale(40)
          }}
        >
          Version 1.2.1
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AboutApp;
