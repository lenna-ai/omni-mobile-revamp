import * as React from "react";

import {
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";

import { moderateScale } from "../../../other/Scaling";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const dimenWidth = Dimensions.get("screen").width;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const HeaderContain = ({ isFocus, dataItem, goToProfile }) => {
  if (isFocus) {
    return (
      <View
        onPress={() => goToProfile()}
        style={{
          marginLeft: 8
        }}
      >
        <View style={{ flexDirection: "row", width: dimenWidth / 2 }}>
          <ShimmerPlaceHolder
            width={52}
            height={52}
            autoRun={true}
            style={{ borderRadius: 52 / 2 }}
          />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: 16
            }}
          >
            <ShimmerPlaceHolder width={100} height={20} autoRun={true} />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontWeight: "900",

                textTransform: "capitalize"
              }}
            >
              -
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    const [uriImage, setUriImage] = React.useState({
      uri: dataItem.created_by.picture
    });

    const handleErrorImage = () => {
      setUriImage(require("./../../../../assets/image/no_avatar.jpg"));
    };

    return (
      <TouchableOpacity
        onPress={() => goToProfile()}
        style={{
          marginLeft: 8
        }}
      >
        <View style={{ flexDirection: "row", width: dimenWidth / 2 }}>
          <Image
            source={uriImage}
            style={{
              width: moderateScale(52),
              height: moderateScale(52),
              borderRadius: moderateScale(52)
            }}
            onError={() => handleErrorImage()}
          />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: 16
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "bold",

                textTransform: "capitalize"
              }}
            >
              {dataItem.created_by.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontWeight: "900",

                textTransform: "capitalize"
              }}
            >
              -
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

export default React.memo(HeaderContain);
