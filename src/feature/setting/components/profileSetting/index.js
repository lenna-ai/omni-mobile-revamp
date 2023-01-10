import React from "react";
import API from "./../../../../utils/api";
import RBSheet from 'react-native-raw-bottom-sheet';
import ProfileDisplay from "./components/ProfileDisplay";
import ChangePassword from "./components/ChangePassword";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { moderateScale } from "../../../other/Scaling";
import { Header } from "react-native-elements";
import { Tab, Tabs, TabHeading } from "native-base";
import {
  imageIconBack,
  imageProfileChangePassword,
  imageProfileImageDisplay
} from "../../../../assets/icons";
import { postDataOutHeader } from "../../../../modules/services";
import { encodeHashIds } from "../../../../utils/encode";
import { changeProfileWasLogin } from "../../../../modules/redux/actions/profileWasLogin/inProfileWasLogin";

const ProfileSetting = ({ navigation }) => {
  const dispatch = useDispatch();

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const disProfileWasLogin = useSelector(state => state.mProfileWasLogin);
  let dataProfWasLogin = disProfileWasLogin.changeProfileWasLogin;

  const refBSSheetAlert = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [statusSuccess, setStatusSuccess] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [menuProfile, setMenuProfile] = React.useState(1)

  const goBack = () => {
    navigation.goBack();
  };

  const onChangeProfile = async (fName, lName, uName) => {
    if (fName != "" && lName != "" && uName != "") {
      // if (fName == dataProfWasLogin.name && lName == dataProfWasLogin.last_name && uName == dataProfWasLogin.uName)
      setIsLoading(true);
      refBSSheetAlert.current.open();
      let headers = {
        token: dataUser.token,
        userId: encodeHashIds(dataUser.user_id)
      };
      let params = {
        email: dataProfWasLogin.email,
        firstName: fName,
        languange: "Indonesia",
        lastName: lName,
        username: uName
      };
      try {
        let res = await postDataOutHeader(
          API.PATH +
            encodeHashIds(dataUser.app_id) +
            "/user-platform/update-user-data",
          params,
          headers
        );
        if (res.success) {
          dispatch(changeProfileWasLogin(res.data));
          setIsLoading(false);
          setStatusSuccess(true);
          setStatusMessage(res.message);
        } else {
          setIsLoading(false);
          setStatusSuccess(false);
          setStatusMessage(res.message);
        }
      } catch (error) {
        console.log("error", error);

        setIsLoading(false);
        setStatusSuccess(false);
        setStatusMessage("Terjadi kendala teknis, Harap coba lagi!!");
      }
    } else {
      setIsLoading(false);
      setStatusSuccess(false);
      setStatusMessage("Harap isi field dengan benar!!");
      refBSSheetAlert.current.open();
    }
  };

  const onChangePassword = async (cNewPass, newPass, oldPass) => {
    if (cNewPass != "" && newPass != "" && oldPass != null) {
      setIsLoading(true);
      refBSSheetAlert.current.open();
      let headers = {
        token: dataUser.token,
        userId: encodeHashIds(dataUser.user_id)
      };
      let params = {
        confirm_new_password: cNewPass,
        email: dataProfWasLogin.email,
        new_password: newPass,
        old_password: oldPass
      };
      try {
        let res = await postDataOutHeader(
          API.PATH2 + "forgot-password-without-request",
          params,
          headers
        );
        console.log("res", res);

        if (res.success) {
          setIsLoading(false);
          setStatusSuccess(true);
          setStatusMessage(res.message);
        } else {
          setIsLoading(false);
          setStatusSuccess(false);
          setStatusMessage(res.message);
        }
      } catch (error) {
        setIsLoading(false);
        setStatusSuccess(false);
        setStatusMessage("Terjadi kendala teknis, Harap coba lagi!!");
      }
    } else {
      setIsLoading(false);
      setStatusSuccess(false);
      setStatusMessage("Harap isi field dengan benar!!");
      refBSSheetAlert.current.open();
    }
  };

  const onClosePassword = () => {
    refBSSheetAlert.current.close();
    setIsLoading(false);
    setStatusMessage("");
    setStatusSuccess(false);
  };

  const headerComponent = () => {
    return (
      <Header
        placement="left"
        centerComponent={() => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "82%",
                  height: 43
                }}
              >
                <TouchableOpacity onPress={() => goBack()}>
                  {imageIconBack(moderateScale(24), moderateScale(24))}
                </TouchableOpacity>
                <Text
                  numberOfLines={1}
                  style={{
                    maxWidth: moderateScale(200),
                    marginLeft: 6,
                    color: "#000",
                    fontSize: 24,
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}
                >
                  Profile Setting
                </Text>
              </View>
            </View>
          );
        }}
        containerStyle={{
          height: 88,
          paddingTop: 5,
          marginHorizontal: -12,
          justifyContent: "center",
          backgroundColor: "#FFFFFFFF"
        }}
      />
    );
  };

  const ProfileSettingComponent = (param) => {
    switch (param) {
      case 1 :
        return (
          <ProfileDisplay onChangeProfile={onChangeProfile} /> 
        )
      case 2: 
        return (
          <ChangePassword onChangePassword={onChangePassword} />
        )
      default:
        break;
    }
  }

  return (
    <View style={styles.container}>
      {headerComponent()}
      <View style={styles.container}>
              <View style={styles.flexRow}>
          <TouchableOpacity activeOpacity={0.6} style={{ ...styles.headingSection, backgroundColor: menuProfile === 1 ? 'lightgrey' : null }} onPress={() => {
            setMenuProfile(1)
                  }}>
                      {imageProfileImageDisplay(moderateScale(24), moderateScale(24))}
                      <Text style={{marginLeft:moderateScale(8)}}>Profile Display</Text>
                  </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={{ ...styles.headingSection, backgroundColor: menuProfile === 2 ? 'lightgrey' : null }} onPress={() => {
            setMenuProfile(2)
                  }}>
                  {imageProfileChangePassword(
                          moderateScale(24),
                          moderateScale(24)
                        )}
                    <Text style={{marginLeft:moderateScale(8)}}>Change Password</Text>
                  </TouchableOpacity>
              </View>
                {ProfileSettingComponent(menuProfile)}
          </View>


          <>
                <RBSheet
                    duration={400}
                    ref={refBSSheetAlert}
                    height={moderateScale(270)}
                    closeOnPressMask={false}
                    closeOnPressBack={false}
                    customStyles={{
                        container: {
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff',
                            borderTopLeftRadius: moderateScale(10),
                            borderTopRightRadius: moderateScale(10)
                        },
                    }}
                >
                    {isLoading ? (
                        <ActivityIndicator color='#049FFF' size='large' />
                    ):(
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Image 
                                source={
                                    statusSuccess
                                    ? require('./../../../../assets/image/icon_lamp_success.png')
                                    : require('./../../../../assets/image/icon_success_false.png')
                                }
                                style={{
                                    width: moderateScale(64),
                                    height: moderateScale(64),
                                    marginBottom: moderateScale(18),
                                }}
                            />
                            <Text
                                style={{
                                    color: '#000',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    fontSize: moderateScale(16),
                                    marginBottom: moderateScale(6),
                                }}
                            >
                                {statusSuccess?"Success":"Sorry"}
                            </Text>
                            <Text
                                style={{
                                    color: '#000',
                                    textAlign: 'center',
                                    fontSize: moderateScale(14),
                                    marginHorizontal: moderateScale(24)
                                }}
                            >
                                {statusMessage}
                            </Text>
                            <TouchableOpacity
                                onPress={() => onClosePassword()}
                                style={{
                                    alignItems: 'center',
                                    marginTop: moderateScale(32),
                                    borderRadius: moderateScale(10),
                                    paddingVertical: moderateScale(8),
                                    paddingHorizontal: moderateScale(18),
                                    backgroundColor: statusSuccess ? '#5588C3' : '#C9C9C9',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#fff',
                                        fontWeight: '800',
                                    }}
                                >
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </RBSheet>
            </>
    </View>
  );
};

export default React.memo(ProfileSetting);

const styles = StyleSheet.create({
  container: {
    flex: 1
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headingSection: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
