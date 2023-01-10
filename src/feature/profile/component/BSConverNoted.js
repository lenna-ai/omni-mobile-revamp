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
const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

export const BSConverNoted = ({
  refRBSheetAddInfo,
  onChangeConverNoted,
  loadingBs,
  dataConvernotedCutomprof
}) => {
  const [content, setContent] = React.useState(
    dataConvernotedCutomprof != null ? dataConvernotedCutomprof : ""
  );

  return (
    <RBSheet
      duration={400}
      height={dimenHeight / moderateScale(2.1)}
      closeOnPressBack={true}
      ref={refRBSheetAddInfo}
      closeOnPressMask={false}
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
            <IconX width={22} height={22} />
          </TouchableOpacity>
          <Text
            style={{
              color: "#2E3034",
              fontWeight: "bold",
              alignSelf: "center",

              fontSize: moderateScale(20),
              marginTop: verticalScale(10),
              marginBottom: verticalScale(20)
            }}
          >
            Conversation Notes
          </Text>
        </View>
        <View style={{ marginBottom: verticalScale(16) }}>
          <TextInput
            multiline={true}
            value={content}
            keyboardType="default"
            style={{
              letterSpacing: 0.1,
              borderColor: "#969696",

              textAlignVertical: "top",
              backgroundColor: "#f5f5f5",
              fontSize: moderateScale(16),
              borderWidth: moderateScale(1),
              borderRadius: moderateScale(10),
              paddingVertical: verticalScale(14),
              width: dimenWidth - moderateScale(60),
              paddingHorizontal: moderateScale(18),
              minHeight: dimenHeight / verticalScale(6)
            }}
            placeholder="Insert Note"
            onChangeText={content => setContent(content)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: verticalScale(18)
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
                onPress={() => onChangeConverNoted(content)}
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
