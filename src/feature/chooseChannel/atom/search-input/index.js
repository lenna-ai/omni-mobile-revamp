import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { moderateScale } from "../../../other/Scaling";

const SearchInputChannel = ({ onSearch }) => {
  return (
    <View style={styles.itemInput}>
      <TextInput
        placeholder="Search For Project"
        onChangeText={text => onSearch(text)}
        style={{ height: moderateScale(46) }}
      />
    </View>
  );
};

export default SearchInputChannel;

const styles = StyleSheet.create({
  itemInput: {
    marginTop: moderateScale(30),
    height: moderateScale(46),
    width: "100%",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  }
});
