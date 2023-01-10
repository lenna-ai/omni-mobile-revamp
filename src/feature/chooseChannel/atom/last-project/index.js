import moment from "moment";
import React from "react";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon3dot, IconGhost } from "../../../../assets";
import { moderateScale } from "../../../other/Scaling";

const LastProject = ({ data }) => {
  return (
    <View style={styles.lastProject}>
      <View style={styles.flexDirectionBetween}>
        <View style={styles.flexDirection}>
          <View style={styles.contentHeaderLeftTitleProject}>
            <Image source={IconGhost} />
          </View>
          <Text style={styles.titleCardLast}>
            {data.name}
          </Text>
        </View>
        <TouchableOpacity>
          <Icon3dot height={4} width={18} />
        </TouchableOpacity>
      </View>
      <Text style={styles.descLastProject}>
        {data.description}
      </Text>
      <Text style={styles.createdAtLastProject}>
        {`Created At ${moment(data.created_at).format("DD MMM YYYY")}`}
      </Text>
    </View>
  );
};

export default LastProject;

const styles = StyleSheet.create({
  flexDirectionBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  flexDirection: {
    height: 60,
    flexDirection: "row",
    alignItems: "center"
  },
  lastProject: {
    marginBottom: moderateScale(16),
    marginTop: moderateScale(10),
    height: moderateScale(152),
    width: "100%",
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: moderateScale(8),
    padding: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  titleCardLast: {
    fontSize: moderateScale(16),
    color: "black"
  },
  contentHeaderLeftTitleProject: {
    height: 50,
    width: 50,
    backgroundColor: "#323F6B",
    borderRadius: 8,
    marginRight: moderateScale(8),
    justifyContent: "center",
    alignItems: "center"
  },
  descLastProject: {
    color: "#A19F9F",
    fontSize: moderateScale(12),
    width: "90%"
  },
  createdAtLastProject: {
    marginTop: moderateScale(24),
    fontSize: moderateScale(12),
    color: "#A19F9F"
  }
});
