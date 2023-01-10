import * as React from "react";
import API from "./../../../../utils/api";
import axios from "axios";
import RBSheet from "react-native-raw-bottom-sheet";

import { Text, TouchableOpacity, View } from "react-native";
import { removeValue } from "../../../../modules/localData";
import { AuthContext } from "./../../../../modules/navigation/navigationContext";
import { moderateScale } from "./../../../other/Scaling";
import { useSelector } from "react-redux";
import { IconCheckCircle, IconXCircle } from "../../../../assets/icons";

const BSConfirmLogout = ({ refRBSheetConfirmLogout }) => {
  const disUser = useSelector(state => state.mDataUserLogin);
  let containUser = disUser.dataUserWasLogin;

  const { signOut } = React.useContext(AuthContext);

  const hitLogout = async () => {
    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${containUser.token}`;
      let res = await axios.post(API.BASE_URL + API.PATH2 + "logout");
      if (res.data.success) {
        removeValue("LASTPROJECT");
        removeValue("WAS_LOGIN");
        removeValue("DATA_LOGIN");
        removeValue("IS_CHOOSE_ACTIVE");
        removeValue("IS_CHOOSE_CHANNEL");
        refRBSheetConfirmLogout.current.close();
        setTimeout(() => {
          signOut();
        }, 200);
      } else {
        removeValue("LASTPROJECT");
        removeValue("WAS_LOGIN");
        removeValue("DATA_LOGIN");
        removeValue("IS_CHOOSE_CHANNEL");
        refRBSheetConfirmLogout.current.close();
        setTimeout(() => {
          signOut();
        }, 200);
      }
    } catch (e) {
      removeValue("LASTPROJECT");
      removeValue("WAS_LOGIN");
      removeValue("DATA_LOGIN");
      removeValue("IS_CHOOSE_CHANNEL");
      refRBSheetConfirmLogout.current.close();
      setTimeout(() => {
        signOut();
      }, 200);
    }
  };

  const confirmLogout = data => {
    if (data == "yes") {
      hitLogout();
    } else {
      refRBSheetConfirmLogout.current.close();
    }
  };

  return (
    <RBSheet
      duration={400}
      ref={refRBSheetConfirmLogout}
      height={moderateScale(150)}
      closeOnPressMask={false}
      closeOnPressBack={false}
      customStyles={{
        container: {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          borderTopLeftRadius: moderateScale(10),
          borderTopRightRadius: moderateScale(10)
        }
      }}
    >
      <Text
        style={{
          color: "#000",
          textAlign: "center",
          fontSize: moderateScale(14),
          marginBottom: moderateScale(24)
        }}
      >
        Apa anda yakin ingin keluar ?
      </Text>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => confirmLogout("yes")}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: moderateScale(36),
            backgroundColor: "#5589c3",
            borderRadius: moderateScale(8),
            paddingHorizontal: moderateScale(10)
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconCheckCircle height={14} width={14} />
            <Text
              style={{
                color: "#fff",
                letterSpacing: 0.1,
                fontSize: moderateScale(14),
                marginLeft: moderateScale(4),
                lineHeight: moderateScale(24),
                marginVertical: moderateScale(0)
              }}
            >
              Ya
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => confirmLogout("no")}
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: moderateScale(36),
            backgroundColor: "#eb5337",
            marginLeft: moderateScale(24),
            borderRadius: moderateScale(8),
            paddingHorizontal: moderateScale(10)
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconXCircle height={14} width={14} />
            <Text
              style={{
                color: "#ffff",
                letterSpacing: 0.1,
                fontSize: moderateScale(14),
                marginLeft: moderateScale(4),
                lineHeight: moderateScale(24),
                marginVertical: moderateScale(0)
              }}
            >
              Tidak
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
};

export default React.memo(BSConfirmLogout);
