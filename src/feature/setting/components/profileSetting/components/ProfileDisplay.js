import * as React from "react";

import {
  Text,
  View,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";

import { useSelector } from "react-redux";
import { moderateScale } from "../../../../other/Scaling";
import CheckImagePhotoProfile from "./CheckImagePhotoProfile";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";
const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const ProfileDisplay = ({ onChangeProfile }) => {
  const [txtFirstName, setTxtFirstName] = React.useState("");
  const [txtLastName, setTxtLastName] = React.useState("");
  const [txtEmail, setTxtEmail] = React.useState("");
  const [txtUsername, setTxtUsername] = React.useState("");
  const [avatarUser, setAvatarUser] = React.useState(null);

  const disProfileWasLogin = useSelector(state => state.mProfileWasLogin);
  let dataProfWasLogin = disProfileWasLogin.changeProfileWasLogin;

  React.useEffect(
    () => {
      setTxtFirstName(dataProfWasLogin.name);
      setTxtLastName(dataProfWasLogin.last_name);
      setTxtEmail(dataProfWasLogin.email);
      setTxtUsername(dataProfWasLogin.username);
      setAvatarUser(dataProfWasLogin.avatar);
    },
    [dataProfWasLogin]
  );

  const changeTextFirstName = txt => {
    setTxtFirstName(txt);
  };

  const changeTextLastName = txt => {
    setTxtLastName(txt);
  };

  const changeTextEmail = txt => {
    setTxtEmail(txt);
  };

  const changeTextUsername = txt => {
    setTxtUsername(txt);
  };

  const onSaveChanges = () => {
    onChangeProfile(txtFirstName, txtLastName, txtUsername);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingTop: moderateScale(32),
          paddingHorizontal: moderateScale(24)
        }}
      >
        {/* <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        paddingVertical: moderateScale(32)
                    }}
                >
                    <CheckImagePhotoProfile
                        dimenWidth={dimenWidth}
                        url={avatarUser} 
                    />
                </View> */}

        <View style={styles.containContainerInput}>
          <Text style={styles.textContainInput}>FIRST NAME</Text>
          <View style={styles.containInput}>
            <TextInput
              value={txtFirstName}
              keyboardType="default"
              style={styles.textInput}
              onChangeText={txtFirstName => changeTextFirstName(txtFirstName)}
            />
          </View>
          {txtFirstName == ""
            ? <Text style={styles.textContainField}>
                The first name field is required
              </Text>
            : null}
        </View>
        <View style={styles.containContainerInput}>
          <Text style={styles.textContainInput}>LAST NAME</Text>
          <View style={styles.containInput}>
            <TextInput
              value={txtLastName}
              keyboardType="default"
              style={styles.textInput}
              onChangeText={txtLastName => changeTextLastName(txtLastName)}
            />
          </View>
          {txtLastName == ""
            ? <Text style={styles.textContainField}>
                The last name field is required
              </Text>
            : null}
        </View>
        <View style={styles.containContainerInput}>
          <Text style={styles.textContainInput}>EMAIL</Text>
          <View style={styles.containInput}>
            <TextInput
              editable={false}
              value={txtEmail}
              keyboardType="default"
              style={styles.textInput}
              onChangeText={txtEmail => changeTextEmail(txtEmail)}
            />
          </View>
          {txtEmail == ""
            ? <Text style={styles.textContainField}>
                The email field is required
              </Text>
            : null}
        </View>
        <View style={styles.containContainerInput}>
          <Text style={styles.textContainInput}>USERNAME</Text>
          <View style={styles.containInput}>
            <TextInput
              value={txtUsername}
              keyboardType="default"
              style={styles.textInput}
              onChangeText={txtUsername => changeTextUsername(txtUsername)}
            />
          </View>
          {txtUsername == ""
            ? <Text style={styles.textContainField}>
                The username field is required
              </Text>
            : null}
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
  textContainInput: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",

    textTransform: "uppercase",
    marginLeft: moderateScale(12),
    marginBottom: moderateScale(8)
  },
  textContainField: {
    color: "#e3342f",
    fontWeight: "bold",

    fontSize: moderateScale(10),
    marginLeft: moderateScale(12),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(4)
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
    marginTop: moderateScale(4),
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
    marginTop: moderateScale(38),
    marginBottom: moderateScale(62)
  },
  textBottomSaveChanges: {
    color: "#fff",
    fontWeight: "bold",

    fontSize: moderateScale(14),
    lineHeight: moderateScale(22)
  }
});

export default React.memo(ProfileDisplay);
