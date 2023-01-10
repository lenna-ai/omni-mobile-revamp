// External Import
import moment from "moment";
import * as React from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Header } from "react-native-elements";
import { moderateScale, verticalScale } from "../../../../other/Scaling";
// Internal Import
import IconBack from "./../../../../../assets/image/icon_back.svg";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const ItemGeneralAnaly = ({ route, navigation }) => {
  const { title } = route.params;
  const { data } = route.params;

  const headerComponent = () => {
    return (
      <Header
        placement="left"
        centerComponent={() => {
          return (
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "96%",
                  height: 43
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <IconBack />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 24,
                    marginLeft: 6,
                    color: "#000000",
                    fontWeight: "bold",

                    textTransform: "uppercase"
                  }}
                >
                  {title}
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
          backgroundColor: "#ffffff",
          borderBottomColor: "#E5E5E5"
        }}
      />
    );
  };

  const itemList = ({ item }) => {
    if (title == "Top 35 Stories") {
      let datValue = parseInt(item.total / data.total_request * 100);
      return (
        <View
          style={{
            flex: 1,
            marginTop: verticalScale(22),
            marginBottom: verticalScale(8),
            width: dimenWidth - moderateScale(48)
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              numberOfLines={1}
              style={{
                flex: 0.7,
                textAlign: "left",

                fontSize: moderateScale(11)
              }}
            >
              {item.story}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                flex: 0.3,
                textAlign: "right",

                fontSize: moderateScale(11)
              }}
            >
              {item.total}
            </Text>
          </View>
          <View
            style={{
              height: verticalScale(24),
              backgroundColor: "#e9ecef",
              marginTop: verticalScale(8),
              borderRadius: moderateScale(4),
              marginBottom: verticalScale(16),
              width: dimenWidth - moderateScale(48)
            }}
          >
            <View
              style={{
                height: verticalScale(24),
                backgroundColor: "#5588C3",
                borderRadius: moderateScale(4),
                width: datValue.toString() + "%"
              }}
            />
          </View>
        </View>
      );
    } else if (title == "Agent Availability") {
      return (
        <View
          style={{
            marginTop: verticalScale(22),
            marginBottom: verticalScale(8),
            width: dimenWidth - moderateScale(48)
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: moderateScale(11)
              }}
            >
              {item.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: "#c9c9c9",

                fontSize: moderateScale(11)
              }}
            >
              {item.email}
            </Text>
          </View>
        </View>
      );
    } else if (title == "Recent Users") {
      return (
        <View
          style={{
            flexDirection: "row",
            marginTop: verticalScale(22),
            marginBottom: verticalScale(8),
            width: dimenWidth - moderateScale(48)
          }}
        >
          <View
            style={{
              backgroundColor: "#3490dc",
              paddingTop: moderateScale(8),
              marginRight: moderateScale(12),
              borderRadius: moderateScale(12),
              paddingBottom: moderateScale(8),
              paddingHorizontal: moderateScale(8)
            }}
          >
            <Text
              style={{
                color: "#ffffff",

                fontSize: moderateScale(11)
              }}
            >
              {moment(item.updated_at, "YYYYMMDD").fromNow()}
            </Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: moderateScale(11)
              }}
            >
              {item.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: "#c9c9c9",

                fontSize: moderateScale(11)
              }}
            >
              {item.email}
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {headerComponent()}

      <View style={styles.container}>
        <FlatList
          renderItem={itemList}
          showsVerticalScrollIndicator={false}
          data={title != "Top 35 Stories" ? data : data.data}
          keyExtractor={(item, index) => index.toString()}
          style={{ flexDirection: "column", alignSelf: "center" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ItemGeneralAnaly;
