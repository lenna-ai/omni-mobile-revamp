import * as React from "react";

import { Text, Platform, ActivityIndicator } from "react-native";

//Import Internal
import { moderateScale } from "./../../other/Scaling";

//Import External
import RBSheet from "react-native-raw-bottom-sheet";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const BottomSheetLoading = ({ refRBSheetLoading }) => {
  return (
    <RBSheet
      duration={400}
      ref={refRBSheetLoading}
      height={moderateScale(150)}
      closeOnPressMask={false}
      closeOnPressBack={false}
      customStyles={{
        container: {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderTopLeftRadius: moderateScale(10),
          borderTopRightRadius: moderateScale(10)
        }
      }}
    >
      <ActivityIndicator color="#049FFF" size="large" />
      <Text
        style={{
          color: "#000",
          textAlign: "center",

          fontSize: moderateScale(14),
          marginTop: moderateScale(10)
        }}
      >
        Memuat...
      </Text>
    </RBSheet>
  );
};

export default React.memo(BottomSheetLoading);
