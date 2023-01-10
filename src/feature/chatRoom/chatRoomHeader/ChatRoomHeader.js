import * as React from "react";
import CheckImageLeftChatRoom from "../components/CheckImageLeftChatRoom";
import LinearGradient from "react-native-linear-gradient";

import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { Header } from "react-native-elements";
import { moderateScale } from "../../other/Scaling";
import { imageIconBack, imageIconMoreVertical } from "../../../assets/icons";
import {
  Text,
  View,
  Platform,
  Dimensions,
  TouchableOpacity
} from "react-native";

const dimenWidth = Dimensions.get("screen").width;
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const ChatRoomHeader = ({
  id,
  isFocus,
  dataItem,
  navigation,
  refRBSheetMore
}) => {
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
                width: "100%",
                height: 43
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                {imageIconBack(moderateScale(24), moderateScale(24))}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Profile", {
                    id: id
                  })}
                style={{
                  marginLeft: 8
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: dimenWidth / 2
                  }}
                >
                  {isFocus
                    ? <ShimmerPlaceHolder
                        width={52}
                        height={52}
                        autoRun={true}
                        style={{ borderRadius: 52 / 2 }}
                      />
                    : <CheckImageLeftChatRoom
                        url={dataItem.created_by.picture}
                        wd={moderateScale(42)}
                        hd={moderateScale(42)}
                      />}
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      marginLeft: 16
                    }}
                  >
                    {isFocus
                      ? <ShimmerPlaceHolder
                          width={100}
                          height={20}
                          autoRun={true}
                        />
                      : <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",

                            textTransform: "capitalize"
                          }}
                        >
                          {dataItem.created_by.name}
                        </Text>}
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
              <View
                style={{
                  right: 0,
                  flexDirection: "row",
                  position: "absolute"
                }}
              >
                <TouchableOpacity onPress={() => refRBSheetMore.current.open()}>
                  {imageIconMoreVertical(moderateScale(24), moderateScale(24))}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }}
      containerStyle={{
        height: Platform.OS === "ios" ? 120 : 100,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        paddingTop: 20,
        marginHorizontal: -12,
        justifyContent: "center",
        backgroundColor: "#FFFFFFFF"
      }}
    />
  );
};

export default React.memo(ChatRoomHeader);
