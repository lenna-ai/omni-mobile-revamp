import * as React from "react";

import {
  Text,
  View,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";

//Import Interanl
import CheckImageZoom from "./components/CheckImageZoom";

//Import External
import { Icon } from "react-native-elements";
import { moderateScale, verticalScale } from "../other/Scaling";
import { IconChevronLeft } from "../../assets/icons";

const dimenWidht = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const ShowImageZoom = ({ navigation, route }) => {
  const { imageUrl } = route.params;

  return (
    <View style={styles.container}>
      <View
        style={{
          top: 0,
          left: 0,
          zIndex: 10,
          position: "absolute",
          alignItems: "center",
          flexDirection: "row",
          marginVertical: moderateScale(12),
          width: dimenWidht - moderateScale(32)
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginHorizontal: moderateScale(4) }}
        >
          <IconChevronLeft height={42} width={42} />
        </TouchableOpacity>
        {/* <Text
                    numberOfLines={1}
                    style={{
                        flex: 1,
                        color: '#fff',
                        fontWeight: '800',
                        textAlign: 'center',

                        fontSize: moderateScale(22),
                    }}
                >
                    {imageUrl.substring(44, imageUrl.length)}
                </Text> */}
      </View>

      <CheckImageZoom url={imageUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  }
});

export default ShowImageZoom;
