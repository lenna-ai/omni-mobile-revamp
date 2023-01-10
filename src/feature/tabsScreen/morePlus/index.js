import * as React from "react";

import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

//Import Asset
import { useDispatch } from "react-redux";
import { changeIsOpen } from "../../../modules/redux/actions/other/inBSNavigationPlus";

const WithoutProfile = ({ navigation }) => {
  const dispath = useDispatch();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispath(changeIsOpen(true));
      navigation.goBack();
    });
    return unsubscribe;
  }, navigation);

  return null;
};

export default WithoutProfile;
