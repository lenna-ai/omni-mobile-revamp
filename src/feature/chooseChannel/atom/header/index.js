import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { color } from "react-native-elements/dist/helpers";
import {
  IconBell,
  IconGhost,
  IconHumberger,
  IconLogout
} from "../../../../assets";
import { moderateScale } from "../../../other/Scaling";

const HeaderChooseChannel = ({ dataUser, onLogout }) => {
  return (
    <View style={styles.flexDirectionBetween}>
      <View style={styles.flexDirection}>
        <View style={styles.imgContainer}>
          <Text style={styles.initial}>
            {dataUser.name.split("")[0]}
          </Text>
        </View>
        <View>
          <Text>
            {dataUser.name}
          </Text>
          <Text>
            {dataUser.email}
          </Text>
        </View>
      </View>
      <View
        style={{
          ...styles.flexDirection,
          width: 80,
          justifyContent: "space-between"
        }}
      >
        <TouchableOpacity activeOpacity={0.6} style={styles.btnBell}>
          <IconBell height={28} width={24} />
          <View style={styles.badgeBell} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            onLogout();
          }}
        >
          <IconLogout height={30} width={30} />
          {/* <IconHumberger height={21} width={24} /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderChooseChannel;

const styles = StyleSheet.create({
  flexDirectionBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  imgContainer: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: "#E4F1FF",
    marginRight: moderateScale(8),
    justifyContent: "center",
    alignItems: "center"
  },
  flexDirection: {
    height: 60,
    flexDirection: "row",
    alignItems: "center"
  },
  btnBell: {
    height: 28,
    width: 24,
    position: "relative"
  },
  badgeBell: {
    height: 12,
    width: 12,
    backgroundColor: "red",
    borderRadius: 8,
    position: "absolute",
    right: -2,
    top: -2
  },
  initial: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#323F6B"
  }
});
