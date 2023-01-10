import * as React from "react";

import { Text, Platform, Image, StyleSheet } from "react-native";

//Import Internal
import { moderateScale } from "./../../other/Scaling";

//Import External
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from "react-redux";

import {
  onStatusLogin,
  onResetStatusMessageLogin
} from "./../../../modules/redux/actions/inLogin";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const BottomSheetStatus = ({ refRBSheetStatus }) => {
  const dispatch = useDispatch();
  const selDataMessage = useSelector(state => state.mDataLogin);

  let dataIsStatusMessage = selDataMessage.statusMessageLogin;

  const closeModalStatus = () => {
    dispatch(onResetStatusMessageLogin());
    dispatch(onStatusLogin(false));
  };

  return (
    <RBSheet
      duration={400}
      ref={refRBSheetStatus}
      height={moderateScale(150)}
      closeOnPressMask={() => closeModalStatus()}
      closeOnPressBack={() => closeModalStatus()}
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
      <Image
        style={styles.image}
        source={require("./../../../assets/image/img_oops.png")}
      />
      <Text
        style={{
          color: "#000",
          textAlign: "center",
          fontSize: moderateScale(14),
          marginTop: moderateScale(10)
        }}
      >
        {dataIsStatusMessage}
      </Text>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 80
  }
});

export default React.memo(BottomSheetStatus);
