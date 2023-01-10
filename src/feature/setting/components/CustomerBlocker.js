import * as React from "react";

import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";

// Import Asset
import IconBack from "./../../../assets/image/icon_back.svg";

// Import Asset
import CodingTwoColor from "./../../../assets/image/coding__two_color.svg";

// Import Third Party
import { Header, Avatar } from "react-native-elements";
import { moderateScale } from "./../../other/Scaling";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";
const dimenWidht = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const CustomerBlocker = ({ navigation }) => {
  const HeaderComponent = () => {
    return (
      <Header
        placement="left"
        centerComponent={() => {
          return (
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "82%",
                  height: 43
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <IconBack />
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "##4F4F4F",

                    textTransform: "uppercase"
                  }}
                >
                  Back to the real world
                </Text>
              </View>
            </View>
          );
        }}
        containerStyle={{
          height: 88,
          paddingTop: 5,
          marginHorizontal: -12,
          backgroundColor: "#FFF",
          justifyContent: "center",
          borderBottomColor: "#fff"
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderComponent />
      <View style={styles.container}>
        <CodingTwoColor />
        <Text
          style={{
            fontSize: moderateScale(28),
            color: "#A5A5A5",
            fontStyle: "normal",
            fontWeight: "500"
          }}
        >
          Hang on!
        </Text>
        <Text
          style={{
            marginTop: moderateScale(12),
            fontSize: moderateScale(18),
            textAlign: "center",
            color: "#A5A5A5",
            fontStyle: "normal",
            fontWeight: "500"
          }}
        >
          This page is still under development.
        </Text>
        <Text
          style={{
            marginVertical: moderateScale(4),
            fontSize: moderateScale(18),
            textAlign: "center",
            color: "#A5A5A5",
            fontStyle: "normal",
            fontWeight: "500"
          }}
        >
          It will be ready very soon!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: moderateScale(20)
  }
});

export default CustomerBlocker;
