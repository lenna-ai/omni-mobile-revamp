import * as React from "react";

import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import { moderateScale } from "../../other/Scaling";

import { Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import { IconCheckCircle, IconXCircle } from "../../../assets/icons";

const BSSheetChoose = ({
  itemClick,
  confirmNo,
  isLoading,
  confirmYes,
  refConfirmChoose
}) => {
  return (
    <RBSheet
      duration={400}
      ref={refConfirmChoose}
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
          marginBottom: moderateScale(24),
          marginHorizontal: moderateScale(24)
        }}
      >
        Apakah anda ingin menggunakan channel "
        {itemClick != undefined ? itemClick.name : ""}" ?
      </Text>

      {isLoading
        ? <View style={{ flexDirection: "row" }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: moderateScale(36),
                backgroundColor: "#5589c3",
                borderRadius: moderateScale(8),
                paddingHorizontal: moderateScale(10)
              }}
            >
              <ActivityIndicator color="#fff" size="small" />
            </View>
          </View>
        : <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => confirmYes()}
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: moderateScale(36),
                backgroundColor: "#5589c3",
                borderRadius: moderateScale(8),
                paddingHorizontal: moderateScale(10)
              }}
            >
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <IconCheckCircle height={14} width={14} />

                <Text
                  style={{
                    color: "#fff",
                    letterSpacing: 0.1,
                    fontSize: moderateScale(14),
                    marginLeft: moderateScale(4),
                    lineHeight: moderateScale(24)
                  }}
                >
                  Ya
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => confirmNo()}
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
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <IconXCircle height={14} width={14} />
                <Text
                  style={{
                    color: "#fff",
                    letterSpacing: 0.1,
                    fontSize: moderateScale(14),
                    marginLeft: moderateScale(4),
                    lineHeight: moderateScale(24)
                  }}
                >
                  Tidak
                </Text>
              </View>
            </TouchableOpacity>
          </View>}
    </RBSheet>
  );
};

export default React.memo(BSSheetChoose);
