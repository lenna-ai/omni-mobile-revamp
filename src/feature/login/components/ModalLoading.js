import * as React from "react";

import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

//Import External
import { useDispatch, useSelector } from "react-redux";
import Modal, { ModalContent } from "react-native-modals";

//Import Internal
import { onLoadingLogin } from "./../../../modules/redux/actions/inLogin";
import { moderateScale } from "../../other/Scaling";

const dimenWidht = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const ModalLoading = () => {
  const dispatch = useDispatch();
  const selData = useSelector(state => state.mDataLogin);
  let dataIsLoadingLogin = selData.isLoadingLogin;

  if (dataIsLoadingLogin) {
    return (
      <TouchableOpacity
        // onPress={() => dispatch(onLoadingLogin(false))}
        style={{
          width: dimenWidht,
          height: dimenHeight,
          alignItems: "center",
          position: "absolute",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: moderateScale(100),
            height: moderateScale(100),
            backgroundColor: "#FFFFFF",
            borderRadius: moderateScale(18)
          }}
        >
          <ActivityIndicator color="#049FFF" size="large" />
          <Text
            style={{
              fontSize: 14,
              color: "#049FFF",
              textAlign: "center",

              marginTop: moderateScale(6)
            }}
          >
            Loading
          </Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  containerModal: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default ModalLoading;
