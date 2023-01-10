import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import {
  imageIllustrationBg,
  imageLogoLennaOmni,
  imageLogoOmnimobile,
} from "../../assets/icons";
import { moderateScale } from "../other/Scaling";

const { height, width } = Dimensions.get("screen");

const Splash = ({ navigation }) => {
  const disNav = useSelector((state) => state.mDataNavigation);
  let isBoard = disNav.isOnBoard;
  let userToken = disNav.isLogin;
  let changeChannel = disNav.isChooseChannel;

  React.useEffect(() => {
    setTimeout(() => {
      isBoard
        ? userToken
          ? navigation.replace("WasLogin")
          : changeChannel
          ? navigation.replace("ChooseChannels")
          : navigation.replace("Auth")
        : navigation.replace("OnBoard");
    }, 3000);
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <View style={{ flex: 1, position: "relative" }}>
          {imageIllustrationBg(width, height)}
        </View>
        <View style={styles.containerContent}>
          <View style={{ marginBottom: moderateScale(76) }}>
            {Platform.OS == "android" ? (
              imageLogoLennaOmni(moderateScale(100), moderateScale(46))
            ) : (
              <Image
                style={{
                  width: moderateScale(120),
                  height: moderateScale(60),
                  resizeMode: "contain",
                }}
                source={require("../../assets/image/logo_lenna.png")}
              />
            )}
          </View>
          <View style={{ marginBottom: moderateScale(70) }}>
            {imageLogoOmnimobile(
              width - moderateScale(160),
              moderateScale(280)
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  containerContent: {
    height: height,
    width: width,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 80,
  },
});
