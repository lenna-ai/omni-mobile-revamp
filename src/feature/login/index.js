import React, { useState, useContext, useRef, useEffect } from "react";
import API from "../../utils/api";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { ImageBackground } from "react-native";
import { useDispatch } from "react-redux";
import { BgLogin, EyeClose, EyeOpen, LogoWhiteLenna } from "../../assets";
import { postDataWithoutToken } from "../../modules/services";
import { moderateScale } from "../other/Scaling";
import { saveData } from "../../modules/localData";
import {
  addDataUserWasLogin,
  resetDataUserWasLogin
} from "../../modules/redux/actions/inDataUserLogin";
import { decodeHashIds } from "../../utils/encode";
import { AuthContext } from "../../modules/navigation/navigationContext";
import { AlertToastFailed } from "../other/AlertToast";

const Login = () => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessEmail, setErrMessEmail] = useState("");
  const [errMessPass, setErrMessPass] = useState("");
  const [errMess, setErrMess] = useState("");
  const [loading, setLoading] = useState(false);

  const { onChangeChannel } = useContext(AuthContext);
  const toastFailed = useRef();

  useEffect(() => {
    dispatch(resetDataUserWasLogin());
  }, []);

  const onSubmitLogin = async () => {
    if (email != "" && password != "") {
      try {
        setLoading(true);
        let dataParams = {
          email: email,
          password: password
        };
        console.log("dataParams : ", dataParams);
        let data = await postDataWithoutToken(API.PATH2 + "login", dataParams);
        console.log("data : ", data);
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
          setLoading(false);
          onChangeChannel();
        } else {
          setLoading(false);
          Alert.alert("login Failed");
        }
      } catch (error) {
        setLoading(false);
        console.log("error login : ", error);
      }
    } else {
      setErrMessEmail("Email Harus diisi");
      setErrMessPass("Password Harus diisi");
    }
  };

  return (
    <ImageBackground source={BgLogin} style={styles.container}>
      <ScrollView style={{ position: "relative" }}>
        {/* header */}
        <View style={styles.header}>
          <View style={styles.flexDirection}>
            <LogoWhiteLenna height={82} width={82} />
            <Text style={styles.txtLogo}>Lenna</Text>
          </View>
          <Text style={styles.subTitle}>Omni Mobile Platform</Text>
        </View>

        {/* box login */}
        <View style={styles.boxLogin}>
          {/* EMail */}
          <View>
            <Text style={styles.titleInput}>Email</Text>
            <View
              style={{
                ...styles.inputCol,
                borderWidth: 1,
                borderColor: errMessEmail ? "red" : "transparent"
              }}
            >
              <TextInput
                placeholder="Email@contoh.com"
                style={styles.txtInput}
                onChangeText={text => {
                  setEmail(text);
                }}
                onSubmitEditing={text => {
                  if (email === "") {
                    setErrMessEmail("Email harus diisi");
                  } else {
                    setErrMessEmail("");
                  }
                }}
              />
            </View>
            <View style={styles.wordingErrMsg}>
              <Text style={styles.txtWording}>
                {errMessEmail}
              </Text>
            </View>
          </View>

          {/* password */}
          <View>
            <Text style={styles.titleInput}>Password</Text>
            <View
              style={{
                ...styles.inputCol,
                borderWidth: 1,
                borderColor: errMessPass ? "red" : "transparent"
              }}
            >
              <TextInput
                placeholder="Masukkan Password"
                secureTextEntry={showPassword ? false : true}
                style={styles.txtInput}
                onChangeText={text => {
                  setPassword(text);
                }}
                onSubmitEditing={() => {
                  if (password === "") {
                    setErrMessPass("Password harus diisi");
                  } else {
                    setErrMessPass("");
                  }
                }}
              />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setShowPassword(!showPassword)}
              >
                {!showPassword
                  ? <EyeClose height={26} width={26} />
                  : <EyeOpen height={26} width={26} />}
              </TouchableOpacity>
            </View>
            <View style={styles.wordingErrMsg}>
              <Text style={styles.txtWording}>
                {errMessPass}
              </Text>
            </View>
          </View>

          {/* Btn Login */}
          <TouchableOpacity activeOpacity={0.6} onPress={() => onSubmitLogin()}>
            <View style={styles.btnSignIn}>
              {loading
                ? <ActivityIndicator size={"small"} color="white" />
                : <Text style={styles.txtSignIn}>Sign In</Text>}
            </View>
          </TouchableOpacity>
          <View style={styles.wordingErrMsg}>
            <Text style={styles.txtWording}>
              {errMess}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.bottom}>
          <Text style={styles.txtFooter}>Lenna Mobile V2</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(16)
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(50),
    marginBottom: moderateScale(60)
  },
  boxLogin: {
    height: moderateScale(350),
    width: "100%",
    borderRadius: moderateScale(8),
    backgroundColor: "white",
    paddingVertical: moderateScale(24),
    paddingHorizontal: moderateScale(18)
  },
  bottom: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: moderateScale(8),
    marginTop: moderateScale(140),
    alignSelf: "center"
  },
  flexDirection: {
    flexDirection: "row",
    alignItems: "center"
  },
  txtLogo: {
    color: "white",
    fontSize: moderateScale(46),
    marginLeft: moderateScale(5)
  },
  subTitle: {
    color: "white",
    fontSize: moderateScale(16)
  },
  txtFooter: {
    fontSize: moderateScale(12),
    color: "white"
  },
  inputCol: {
    height: moderateScale(46),
    width: "100%",
    borderRadius: moderateScale(8),
    backgroundColor: "#F6F6F6",
    paddingHorizontal: moderateScale(8),
    marginTop: moderateScale(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleInput: {
    fontSize: moderateScale(16),
    color: "#3F5189",
    fontWeight: "bold"
  },
  txtInput: {
    width: "90%"
  },
  wordingErrMsg: {
    marginVertical: moderateScale(8)
  },
  txtWording: {
    color: "red"
  },
  btnSignIn: {
    height: moderateScale(50),
    borderRadius: moderateScale(8),
    width: "100%",
    backgroundColor: "#F20078",
    justifyContent: "center",
    alignItems: "center"
  },
  txtSignIn: {
    color: "white",
    fontSize: moderateScale(16),
    fontWeight: "bold"
  }
});
