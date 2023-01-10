import * as React from "react";
import ImageCarousel1 from "./../../../../../assets/image/image_carousel1.svg";
import ImageCarousel2 from "./../../../../../assets/image/image_carousel2.svg";
import LinearGradient from "react-native-linear-gradient";

import { Text, View, Platform, StyleSheet, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const dimenWidth = Dimensions.get("screen").width;

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default (OfficeHourHome = () => {
  const disDataOfficeHour = useSelector(state => state.mOfficeHour);
  const containOfficeHour = disDataOfficeHour.dataOfficeHour;
  const containLoading = disDataOfficeHour.loading;

  React.useEffect(() => {
    console.log("DATA_OFFICE_HOUR", containOfficeHour);
  }, []);

  const OfficeHourShimmer = () => {
    return (
      <ShimmerPlaceHolder
        height={100}
        autoRun={true}
        width={dimenWidth - 48}
        style={styles.continerShimmerOfficeHour}
      />
    );
  };

  const OfficeHourContent = () => {
    return (
      <View
        style={{
          height: 100,
          borderRadius: 10,
          width: dimenWidth - 48,
          marginHorizontal: 24,
          backgroundColor: "#BA77E6"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 16,
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              flexDirection: "column"
            }}
          >
            <Text
              style={{
                fontSize: 18,
                lineHeight: 30,
                color: "#fff",
                fontWeight: "bold"
              }}
            >
              The Store is Open
            </Text>

            <View
              style={{
                flexDirection: "row"
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 30,
                  color: "#fff",
                  marginRight: 8,
                  fontWeight: "normal"
                }}
              >
                Office Hour
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 30,
                  color: "#fff",
                  fontWeight: "normal"
                }}
              >
                08.00 - 17.00
              </Text>
            </View>
          </View>

          <View>
            <ImageCarousel1 width={dimenWidth / 3} height={100} />
          </View>
        </View>
      </View>
    );
  };

  const OfficeHourComponent = () => {
    if (containLoading) {
      return <OfficeHourShimmer />;
    } else {
      return <OfficeHourContent />;
    }
  };

  return <OfficeHourComponent />;
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  continerShimmerOfficeHour: {
    borderRadius: 10,
    marginHorizontal: 24
  }
});
