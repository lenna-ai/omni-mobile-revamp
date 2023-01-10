import * as React from "react";

import { Text, View, TextInput, TouchableOpacity } from "react-native";

//Import External
import { Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import { IconX } from "../../../assets/icons";

export const BSNoteBeforeResolved = () => {
  return (
    <RBSheet
      duration={400}
      ref={refRBSheetEndNotes}
      closeOnPressMask={() => cancelNoted()}
      closeOnPressBack={() => cancelNoted()}
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
            onPress={() => cancelNoted()}
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
              marginBottom: 6,
              color: "#2E3034",
              fontWeight: "bold",
              alignSelf: "center"
            }}
          >
            Mark as resolved
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 20,
              color: "#2E3034",
              fontWeight: "800",
              alignSelf: "center"
            }}
          >
            End Notes
          </Text>
        </View>
        <TextInput
          multiline={true}
          value={notedSend}
          keyboardType="default"
          style={styles.inputEndNoted}
          onChangeText={notedSend => changeTextNoted(notedSend)}
        />
        <View
          style={{
            marginTop: 20,
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            onPress={() => onResolved()}
            style={{
              backgroundColor: "#003473",
              paddingVertical: 8,
              paddingHorizontal: 18,
              borderRadius: 10,
              marginRight: 20
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                fontWeight: "800",
                alignSelf: "center"
              }}
            >
              Resolve Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => cancelNoted()}
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
                alignSelf: "center"
              }}
            >
              Cancel
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
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(10),
    paddingTop: moderateScale(10),
    marginBottom: moderateScale(-10),
    width: moderateScale(150),
    borderRadius: moderateScale(10),
    marginRight: moderateScale(10),
    alignSelf: "flex-end"
  }
});
