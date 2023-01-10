import * as React from "react";

import {
  Text,
  View,
  Platform,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

//Import External
import { Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import { IconX } from "../../../assets/icons";
import { moderateScale, verticalScale } from "../../other/Scaling";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";
const dimenWidht = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

export const BSAddInformation = ({
  refRBSheetAddInfo,
  onAddInfo,
  loadingBs
}) => {
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const onAdditionalInfo = () => {
    onAddInfo(title, desc);
    setTimeout(() => {
      setTitle("");
      setDesc("");
    }, 2000);
  };

  return (
    <RBSheet
      duration={400}
      ref={refRBSheetAddInfo}
      closeOnPressMask={false}
      closeOnPressBack={true}
      height={dimenHeight / moderateScale(2)}
      customStyles={{
        container: {
          backgroundColor: "transparent"
        }
      }}
    >
      <View
        style={[
          styles.BSView,
          { alignItems: "center", paddingTop: verticalScale(20) }
        ]}
      >
        <View
          style={{
            alignItems: "flex-end",
            width: Dimensions.get("screen").width
          }}
        >
          <TouchableOpacity
            onPress={() => refRBSheetAddInfo.current.close()}
            style={{
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

              fontSize: moderateScale(20),
              marginTop: verticalScale(8),
              marginBottom: verticalScale(16)
            }}
          >
            Additional Information
          </Text>
        </View>
        <View style={{ marginBottom: verticalScale(16) }}>
          <Text
            style={{
              color: "#4F4F4F",
              letterSpacing: 0.1,

              textTransform: "capitalize",
              fontSize: moderateScale(16),
              marginBottom: verticalScale(8)
            }}
          >
            title
          </Text>
          <TextInput
            value={title}
            keyboardType="default"
            style={{
              color: "#4F4F4F",
              letterSpacing: 0.1,

              borderColor: "#c0c2c4",
              fontSize: moderateScale(16),
              borderWidth: moderateScale(1),
              borderRadius: moderateScale(10),
              paddingVertical: verticalScale(8),
              width: dimenWidht - moderateScale(40),
              paddingHorizontal: moderateScale(16)
            }}
            placeholder="Insert Title"
            onChangeText={title => setTitle(title)}
          />
        </View>
        <View style={{ marginBottom: verticalScale(16) }}>
          <Text
            style={{
              color: "#4F4F4F",
              letterSpacing: 0.1,

              textTransform: "capitalize",
              fontSize: moderateScale(16),
              marginBottom: verticalScale(8)
            }}
          >
            description
          </Text>
          <TextInput
            value={desc}
            keyboardType="default"
            style={{
              color: "#4F4F4F",
              letterSpacing: 0.1,

              borderColor: "#c0c2c4",
              fontSize: moderateScale(16),
              borderWidth: moderateScale(1),
              borderRadius: moderateScale(10),
              paddingVertical: verticalScale(8),
              width: dimenWidht - moderateScale(40),
              paddingHorizontal: moderateScale(16)
            }}
            placeholder="Insert Description"
            onChangeText={desc => setDesc(desc)}
          />
        </View>
        <View
          style={{
            marginTop: verticalScale(28),
            flexDirection: "row"
          }}
        >
          {loadingBs
            ? <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderColor: "#003473",
                  justifyContent: "center",
                  backgroundColor: "#003473",
                  borderWidth: moderateScale(1),
                  borderRadius: moderateScale(10),
                  paddingVertical: verticalScale(8),
                  marginHorizontal: moderateScale(20)
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    alignSelf: "center",

                    textTransform: "capitalize",
                    fontSize: moderateScale(16),
                    marginRight: moderateScale(8)
                  }}
                >
                  Loading
                </Text>
                <ActivityIndicator
                  color={"#fff"}
                  width={moderateScale(16)}
                  height={moderateScale(16)}
                />
              </View>
            : <TouchableOpacity
                onPress={() => onAdditionalInfo()}
                style={{
                  flex: 1,
                  borderColor: "#003473",
                  backgroundColor: "#003473",
                  borderWidth: moderateScale(1),
                  borderRadius: moderateScale(10),
                  paddingVertical: verticalScale(8),
                  marginHorizontal: moderateScale(20)
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    alignSelf: "center",

                    textTransform: "capitalize",
                    fontSize: moderateScale(16)
                  }}
                >
                  save
                </Text>
              </TouchableOpacity>}
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
    alignItems: "center",
    backgroundColor: "white",
    width: Dimensions.get("screen").width,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20)
  }
});
