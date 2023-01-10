import * as React from "react";
import IconBell from "./../../../../assets/image/icon_bell.svg";
import LinearGradient from "react-native-linear-gradient";

import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { Text, View, Platform, StyleSheet, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { verticalScale, moderateScale } from "../../../other/Scaling";

const dimenWidth = Dimensions.get("screen").width;
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default (HeaderHome = () => {
  const disProfileWasLogin = useSelector(state => state.mProfileWasLogin);
  let dataProfWasLogin = disProfileWasLogin.changeProfileWasLogin;
  let loadProfWasLogin = disProfileWasLogin.loadingProfileWasLogin;

  const HeaderContent = () => {
    return (
      <View style={[styles.containerHeader]}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <Text numberOfLines={1} style={styles.textHeaderTitle}>
            {dataProfWasLogin.name}
          </Text>
          <Text numberOfLines={1} style={styles.textHeaderSubTitle}>
            Have a good day!
          </Text>
        </View>
        <IconBell width={moderateScale(22)} height={moderateScale(24)} />
      </View>
    );
  };

  const HeaderContentShimmer = () => {
    return (
      <ShimmerPlaceHolder
        autoRun={true}
        height={verticalScale(60)}
        width={dimenWidth - moderateScale(48)}
        style={styles.continerShimmerHeaderHome}
      />
    );
  };

  const HeaderComponent = () => {
    if (loadProfWasLogin) {
      return <HeaderContentShimmer />;
    } else {
      return <HeaderContent />;
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <HeaderComponent />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerHeader: {
    alignItems: "center",
    flexDirection: "row",
    height: moderateScale(60),
    marginTop: moderateScale(30),
    justifyContent: "space-between",
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(11),
    width: dimenWidth - moderateScale(48)
  },
  textHeaderTitle: {
    color: "#2E3034",
    fontWeight: "bold",

    textTransform: "capitalize",
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(2),
    marginRight: moderateScale(30)
  },
  textHeaderSubTitle: {
    color: "#2E3034",

    fontSize: moderateScale(14)
  },
  continerShimmerHeaderHome: {
    marginTop: verticalScale(30),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(11)
  }
});
