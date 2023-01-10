import * as React from "react";
import LinearGradient from "react-native-linear-gradient";
import API from "./../../utils/api";

import {
  Text,
  View,
  Image,
  Platform,
  TextInput,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import { moderateScale, verticalScale } from "../other/Scaling";
import { saveData } from "./../../modules/localData";
import { postDataWithoutToken } from "./../../modules/services";
import { AuthContext } from "./../../modules/navigation/navigationContext";
import { addDataUserWasLogin } from "../../modules/redux/actions/inDataUserLogin";
import { useDispatch } from "react-redux";
import { Icon } from "react-native-elements";
import {
  imageIconBack,
  imageLogoLennaOmni,
  imageIconLoginIllustration,
  IconChevronDown,
  IconEyeOff,
  IconEye
} from "./../../assets/icons";
import { AlertToastSuccess, AlertToastFailed } from "../other/AlertToast";
import { decodeHashIds } from "../../utils/encode";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const LogiEmail = ({ navigation }) => {
  const dispatch = useDispatch();

  const scrollViewRef = React.useRef();
  const toastFailed = React.useRef(null);
  const toastSuccess = React.useRef(null);

  const [secPass, setSecPass] = React.useState(true);
  const [emailLogin, setEmailLogin] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [passwordLogin, setPasswordLogin] = React.useState("");

  const { onChangeChannel } = React.useContext(AuthContext);

  const onScrollBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const changeEmailLogin = txt => {
    setEmailLogin(txt);
  };

  const changePasswordLogin = txt => {
    setPasswordLogin(txt);
  };

  const onLoginByEmail = async () => {
    if (emailLogin != "" && passwordLogin != "") {
      console.log(API.PATH2 + "login");
      setIsLoading(true);
      try {
        let params = {
          email: emailLogin,
          password: passwordLogin
        };
        let data = await postDataWithoutToken(API.PATH2 + "login", params);
        console.log("response login => ", data);

        if (data.success) {
          let dataLogin = {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            token: data.data.token.access_token,
            role: null,
            online: true,
            reason_offline: null,
            user_id: decodeHashIds(data.data.id)
          };
          saveData("WAS_LOGIN", false);
          saveData("DATA_LOGIN", dataLogin);
          saveData("IS_CHOOSE_ACTIVE", false);
          saveData("IS_CHOOSE_CHANNEL", true);
          dispatch(addDataUserWasLogin(dataLogin));

          setIsLoading(false);
          onChangeChannel();
          // toastSuccess.current.show(data.message, 1000, () => {
          // });
        } else {
          setIsLoading(false);
          toastFailed.current.show(data.message, 1000);
        }
      } catch (error) {
        console.log("ERROR CATCH => ", error);
        setIsLoading(false);
        toastFailed.current.show(
          "Terjadi kendala teknis, Harap coba lagi!!",
          1000
        );
      }
    } else {
      toastFailed.current.show(
        "Email atau Password kosong, Harap isi dengan benar!",
        1000
      );
    }
  };

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={["rgba(138, 219, 245, 0.5)", "rgba(37, 174, 218, 0.5) 100%)"]}
        style={{
          flex: 1,
          width: dimenWidth
        }}
      >
        <TouchableOpacity
          style={{
            marginLeft: moderateScale(12),
            marginTop:
              Platform.OS === "ios" ? moderateScale(32) : moderateScale(14)
          }}
          onPress={() => navigation.goBack()}
        >
          {imageIconBack(moderateScale(38), moderateScale(38))}
        </TouchableOpacity>
        <ScrollView
          ref={scrollViewRef}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              width: dimenWidth,
              height: dimenHeight,
              paddingTop: moderateScale(12),
              paddingHorizontal: moderateScale(32)
            }}
          >
            {Platform.OS == "android"
              ? imageLogoLennaOmni(moderateScale(140), moderateScale(64))
              : <Image
                  source={require("./../../assets/image/logo_lenna.png")}
                />}
            <Text style={styles.containTitle}>
              Welcome to Lenna Super Platform
            </Text>
            <Text style={styles.containSubTitle}>
              A place to orchestration your customer relation apps, single
              interface to manage omnichannels and build a smarter chatbot
              without compromise.
            </Text>
            <View style={{ alignItems: "center" }}>
              {/* <Image 
                                style={{
                                    width: dimenWidth-moderateScale(48),
                                    height: dimenWidth-moderateScale(48)
                                }}
                                source={require('./../../assets/image/icon_login_illustration.png')} /> */}
              {imageIconLoginIllustration(
                dimenWidth - moderateScale(48),
                dimenWidth - moderateScale(80)
              )}
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => onScrollBottom()}
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Text
                  style={[
                    styles.containSubTitle,
                    { textTransform: "uppercase" }
                  ]}
                >
                  Click here
                </Text>
                <IconChevronDown height={24} width={24} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: dimenHeight,
              height: dimenHeight - moderateScale(98)
            }}
          >
            <KeyboardAvoidingView>
              <View
                style={{
                  backgroundColor: "white",
                  marginTop: moderateScale(38),
                  borderRadius: moderateScale(24),
                  marginHorizontal: moderateScale(22),
                  width: dimenWidth - moderateScale(44)
                }}
              >
                <View
                  style={{
                    marginTop: moderateScale(32),
                    marginHorizontal: moderateScale(18)
                  }}
                >
                  <Text
                    style={{
                      color: "#000",
                      textTransform: "capitalize",
                      fontSize: moderateScale(26),
                      marginBottom: moderateScale(8)
                    }}
                  >
                    Login
                  </Text>
                  <Text
                    style={{
                      color: "#000",

                      fontSize: moderateScale(16)
                    }}
                  >
                    Please login with your personal info
                  </Text>
                  <Text
                    style={{
                      color: "#000",

                      textTransform: "uppercase",
                      fontSize: moderateScale(16),
                      marginTop: moderateScale(42),
                      marginBottom: moderateScale(6)
                    }}
                  >
                    Email / Username
                  </Text>
                  <View style={styles.containInput}>
                    <TextInput
                      value={emailLogin}
                      keyboardType="email-address"
                      style={styles.textInput}
                      autoCapitalize={"none"}
                      placeholder="Registered Email / Username"
                      onChangeText={emailLogin => changeEmailLogin(emailLogin)}
                    />
                  </View>
                  <Text
                    style={{
                      color: "#000",

                      textTransform: "uppercase",
                      fontSize: moderateScale(16),
                      marginTop: moderateScale(38),
                      marginBottom: moderateScale(6)
                    }}
                  >
                    Password
                  </Text>
                  <View style={styles.containInput}>
                    <TextInput
                      value={passwordLogin}
                      keyboardType="default"
                      secureTextEntry={secPass}
                      style={styles.textInput}
                      placeholder="Password"
                      onChangeText={passwordLogin =>
                        changePasswordLogin(passwordLogin)}
                    />
                    {secPass
                      ? <TouchableOpacity onPress={() => setSecPass(!secPass)}>
                          <IconEyeOff height={24} width={24} />
                        </TouchableOpacity>
                      : <TouchableOpacity onPress={() => setSecPass(!secPass)}>
                          <IconEye height={24} width={24} />
                        </TouchableOpacity>}
                  </View>
                  {isLoading
                    ? <View style={styles.btnOnLogin}>
                        <ActivityIndicator color="#fff" size="small" />
                      </View>
                    : <TouchableOpacity
                        style={styles.btnOnLogin}
                        onPress={() => onLoginByEmail()}
                      >
                        <Text style={styles.textBtnOnLogin}>Let me in</Text>
                      </TouchableOpacity>}
                </View>
              </View>
              <View
                style={{
                  alignItems: "center",
                  marginVertical: moderateScale(32),
                  width: dimenWidth - moderateScale(44),
                  marginHorizontal: moderateScale(22)
                }}
              >
                {Platform.OS == "android"
                  ? imageLogoLennaOmni(moderateScale(140), moderateScale(64))
                  : <Image
                      source={require("./../../assets/image/logo_lenna.png")}
                    />}
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </LinearGradient>
      <AlertToastSuccess toastSuccess={toastSuccess} />
      <AlertToastFailed toastFailed={toastFailed} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containTitle: {
    color: "#2787C4",

    textTransform: "capitalize",
    fontSize: moderateScale(24),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(18)
  },
  containSubTitle: {
    color: "#000",

    fontSize: moderateScale(14),
    lineHeight: moderateScale(16)
  },
  containInput: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    marginTop: moderateScale(4),
    borderRadius: moderateScale(12)
  },
  textInput: {
    flex: 0.93,
    backgroundColor: "transparent",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(13)
  },
  btnOnLogin: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(44),
    backgroundColor: "#2889C6",
    borderRadius: moderateScale(8),
    marginTop: moderateScale(32),
    marginBottom: moderateScale(32)
  },
  textBtnOnLogin: {
    color: "#fff",
    fontWeight: "bold",

    fontSize: moderateScale(14),
    lineHeight: moderateScale(22)
  }
});

export default React.memo(LogiEmail);
