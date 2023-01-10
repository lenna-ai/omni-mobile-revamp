import * as React from "react";

import {
  Text,
  View,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";

import { moderateScale } from "../../../../other/Scaling";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";
const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const ChangePassword = ({ onChangePassword }) => {
  const [txtOldPass, setTxtOldPass] = React.useState("");
  const [txtNewPass, setTxtNewPass] = React.useState("");
  const [txtConfirmNewPass, setTxtConfirmNewPass] = React.useState("");

  let newPasswordInput = React.useRef();
  let cNewPasswordInput = React.useRef();

  const changeTextOld = txt => {
    setTxtOldPass(txt);
  };

  const changeTextNew = txt => {
    setTxtNewPass(txt);
  };

  const changeTextConfirmNew = txt => {
    setTxtConfirmNewPass(txt);
  };

  const onSaveChanges = () => {
    onChangePassword(txtConfirmNewPass, txtNewPass, txtOldPass);
    setTimeout(() => {
      setTxtOldPass("");
      setTxtNewPass("");
      setTxtConfirmNewPass("");
    }, 400);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={styles.containerStyle}>
        <View style={styles.containContainerInput}>
          <Text style={styles.textContainInput}>Old Password</Text>
          <View style={styles.containInput}>
            <TextInput
              value={txtOldPass}
              returnKeyType="next"
              keyboardType="default"
              secureTextEntry={true}
              style={styles.textInput}
              onSubmitEditing={() => newPasswordInput.focus()}
              onChangeText={txtOldPass => changeTextOld(txtOldPass)}
            />
          </View>
        </View>
        <View style={styles.containContainerInput}>
          <Text style={styles.textContainInput}>New Password</Text>
          <View style={styles.containInput}>
            <TextInput
              value={txtNewPass}
              returnKeyType="next"
              keyboardType="default"
              style={styles.textInput}
              ref={input => (newPasswordInput = input)}
              onSubmitEditing={() => cNewPasswordInput.focus()}
              onChangeText={txtNewPass => changeTextNew(txtNewPass)}
            />
          </View>
        </View>
        <View style={styles.containContainerInput}>
          <Text style={styles.textContainInput}>Confirm New Password</Text>
          <View style={styles.containInput}>
            <TextInput
              returnKeyType="go"
              keyboardType="default"
              style={styles.textInput}
              value={txtConfirmNewPass}
              onSubmitEditing={() => onSaveChanges()}
              ref={input => (cNewPasswordInput = input)}
              onChangeText={txtConfirmNewPass =>
                changeTextConfirmNew(txtConfirmNewPass)}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onSaveChanges()}
          style={styles.bottomSaveChanges}
        >
          <Text style={styles.textBottomSaveChanges}>Save Changes</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerStyle: {
    paddingTop: moderateScale(32),
    paddingHorizontal: moderateScale(22)
  },
  textContainInput: {
    marginLeft: 6,
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",

    textTransform: "uppercase",
    marginLeft: moderateScale(12),
    marginBottom: moderateScale(6)
  },
  containContainerInput: {
    marginVertical: moderateScale(8)
  },
  containInput: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: moderateScale(12)
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(13)
  },
  bottomSaveChanges: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(44),
    backgroundColor: "#2889C6",
    borderRadius: moderateScale(8),
    marginTop: moderateScale(38)
  },
  textBottomSaveChanges: {
    color: "#fff",
    fontWeight: "bold",

    fontSize: moderateScale(14),
    lineHeight: moderateScale(22)
  }
});

export default React.memo(ChangePassword);
