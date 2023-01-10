import * as React from "react";

import {
  Text,
  View,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";

//Import External
import { Icon } from "react-native-elements";
import { RNCamera } from "react-native-camera";
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from "react-redux";

//Import Internal
import {
  onStatusLogin,
  onLoadingLogin,
  onStatusMessageLogin
} from "./../../../modules/redux/actions/inLogin";
import { moderateScale, verticalScale } from "../../other/Scaling";
import { IconX } from "../../../assets/icons";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const BottomSheetCamera = ({ actionLogin, refRBSheetCamera, refCamera }) => {
  const dispatch = useDispatch();

  const [isActive, setIsActive] = React.useState(false);

  const onContactAdmin = () => {};

  return (
    <RBSheet
      ref={refRBSheetCamera}
      height={dimenHeight - dimenHeight / 7}
      closeOnPressMask={() => true}
      closeOnPressBack={() => true}
      duration={400}
      customStyles={{
        container: {
          backgroundColor: "transparent",
          alignItems: "center"
        }
      }}
    >
      <View style={styles.BSView}>
        <View
          style={{
            flex: 0.23,
            alignItems: "flex-end",
            width: Dimensions.get("screen").width
          }}
        >
          <TouchableOpacity
            onPress={() => refRBSheetCamera.current.close()}
            style={{
              marginTop: verticalScale(14),
              marginRight: moderateScale(14)
            }}
          >
            <IconX height={22} width={22} />
          </TouchableOpacity>
          <Text
            style={{
              color: "#2E3034",
              fontWeight: "bold",
              alignSelf: "center",

              fontSize: moderateScale(20)
            }}
          >
            Scan to login
          </Text>
          <Text
            style={{
              marginTop: "5%",
              color: "#2E3034",
              fontWeight: "800",
              textAlign: "center",
              alignSelf: "center",

              fontSize: moderateScale(16),
              paddingHorizontal: moderateScale(40)
            }}
          >
            Open Omni Messaging to get the QR code
          </Text>
        </View>
        <View
          style={{
            flex: 0.57,
            backgroundColor: "black",
            width: Dimensions.get("screen").width / 1.4
          }}
        >
          <RNCamera
            ref={refCamera}
            style={styles.preview}
            type={RNCamera.Constants.Type.font}
            flashMode={RNCamera.Constants.FlashMode.on}
            zoom={Platform.OS == "android" ? 0.1 : 0}
            androidCameraPermissionOptions={{
              buttonPositive: "Ok",
              buttonNegative: "Cancel",
              title: "Permission to use camera",
              message: "We need your permission to use your camera"
            }}
            onBarCodeRead={barcode => {
              console.log("INI_HASIL_BARCODE", barcode);
              if (!isActive) {
                setIsActive(true);
                if (
                  barcode.type == "QR_CODE" ||
                  barcode.type == "org.iso.QRCode"
                ) {
                  refRBSheetCamera.current.close();
                  setIsActive(false);
                  setTimeout(() => {
                    dispatch(onLoadingLogin(true));
                    actionLogin(barcode.data);
                  }, 1000);
                } else {
                  refRBSheetCamera.current.close();
                  setIsActive(false);
                  setTimeout(() => {
                    dispatch(
                      onStatusMessageLogin(
                        "Barcode yang discan \nbukan QR Code!"
                      )
                    );
                    dispatch(onStatusLogin(true));
                  }, 1000);
                }
              }
            }}
          />
        </View>
        <View
          style={{
            flex: 0.2,
            width: Dimensions.get("screen").width
          }}
        >
          <Text
            style={{
              marginTop: "5%",
              color: "#2E3034",
              fontWeight: "800",
              marginBottom: "3%",
              textAlign: "center",

              fontSize: moderateScale(16),
              paddingHorizontal: moderateScale(40)
            }}
          >
            Can’t find QR code to scan?
          </Text>
          <TouchableOpacity
            onPress={() => onContactAdmin()}
            // onPress={() => refRBSheetCamera.current.open()}
            style={{
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              height: moderateScale(44),
              backgroundColor: "#5588C3",
              borderRadius: moderateScale(8),
              marginBottom: moderateScale(10),
              width: dimenWidth - moderateScale(60)
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",

                fontSize: moderateScale(14),
                lineHeight: moderateScale(22)
              }}
            >
              Contact Adminstrator
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  BSView: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    width: Dimensions.get("screen").width
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end"
  }
});

export default React.memo(BottomSheetCamera);
