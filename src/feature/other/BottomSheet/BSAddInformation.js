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

  return (
    <RBSheet
      duration={400}
      ref={refRBSheetAddInfo}
      closeOnPressMask={false}
      closeOnPressBack={true}
      height={dimenHeight / 2}
      customStyles={{
        container: {
          backgroundColor: "transparent"
        }
      }}
    >
      <View style={[styles.BSView, { alignItems: "center", paddingTop: 20 }]}>
        <View
          style={{
            alignItems: "flex-end",
            width: Dimensions.get("screen").width
          }}
        >
          <TouchableOpacity
            onPress={() => refRBSheetAddInfo.current.close()}
            style={{
              marginRight: 14
            }}
          >
            <IconX height={22} width={22} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              marginTop: 10,
              marginBottom: 20,
              color: "#2E3034",
              fontWeight: "bold",
              alignSelf: "center"
            }}
          >
            Additional Information
          </Text>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              marginBottom: 8,
              color: "#4F4F4F",
              letterSpacing: 0.1,

              textTransform: "capitalize"
            }}
          >
            title
          </Text>
          <TextInput
            value={title}
            keyboardType="default"
            style={{
              fontSize: 16,
              lineHeight: 24,
              borderWidth: 1,
              borderRadius: 10,
              color: "#4F4F4F",
              paddingVertical: 8,
              letterSpacing: 0.1,
              width: dimenWidht - 40,
              paddingHorizontal: 16,

              borderColor: "#c0c2c4"
            }}
            placeholder="Insert Title"
            onChangeText={title => setTitle(title)}
          />
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              marginBottom: 8,
              color: "#4F4F4F",
              letterSpacing: 0.1,

              textTransform: "capitalize"
            }}
          >
            description
          </Text>
          <TextInput
            value={desc}
            keyboardType="default"
            style={{
              fontSize: 16,
              lineHeight: 24,
              borderWidth: 1,
              borderRadius: 10,
              color: "#4F4F4F",
              paddingVertical: 8,
              letterSpacing: 0.1,
              width: dimenWidht - 40,
              paddingHorizontal: 16,

              borderColor: "#c0c2c4"
            }}
            placeholder="Insert Description"
            onChangeText={desc => setDesc(desc)}
          />
        </View>
        <View
          style={{
            marginTop: 28,
            flexDirection: "row"
          }}
        >
          {loadingBs
            ? <View
                style={{
                  borderWidth: 1,
                  marginRight: 20,
                  borderRadius: 10,
                  paddingVertical: 8,
                  flexDirection: "row",
                  paddingHorizontal: 18,
                  borderColor: "#003473",
                  backgroundColor: "#003473"
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    marginRight: 8,
                    fontWeight: "800",
                    alignSelf: "center",

                    textTransform: "capitalize"
                  }}
                >
                  Loading
                </Text>
                <ActivityIndicator width={16} height={16} color={"#fff"} />
              </View>
            : <TouchableOpacity
                onPress={() => onAddInfo(title, desc)}
                style={{
                  backgroundColor: "#003473",
                  paddingVertical: 8,
                  paddingHorizontal: 18,
                  borderRadius: 10,
                  marginRight: 20,
                  borderWidth: 1,
                  borderColor: "#003473"
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "800",
                    alignSelf: "center",

                    textTransform: "capitalize"
                  }}
                >
                  save
                </Text>
              </TouchableOpacity>}
          <TouchableOpacity
            onPress={() => refRBSheetAddInfo.current.close()}
            style={{
              backgroundColor: "#fff",
              paddingVertical: 8,
              paddingHorizontal: 18,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#003473"
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#003473",
                fontWeight: "800",
                alignSelf: "center",

                textTransform: "capitalize"
              }}
            >
              cancel
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
  }
});
