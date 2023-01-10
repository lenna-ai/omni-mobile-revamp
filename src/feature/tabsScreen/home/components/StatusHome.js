import * as React from "react";
import LinearGradient from "react-native-linear-gradient";

import {
  Text,
  View,
  Platform,
  Dimensions,
  StyleSheet,
  ActivityIndicator
} from "react-native";

//Import External
import { useSelector } from "react-redux";
import { verticalScale, moderateScale } from "../../../other/Scaling";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const dimenWidth = Dimensions.get("screen").width;

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
export default (StatusHome = () => {
  let disStatus = useSelector(state => state.mDataStatus);
  let dataCountRoom = disStatus.dataCountRoom;
  let isLoading = disStatus.loadingCountRoom;

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const StatusHomeRight = () => {
    if (dataUser.role.name != "Staff") {
      return (
        <View
          style={{
            height: 144,
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: "center",
            paddingHorizontal: 8,
            backgroundColor: "#0690A1",
            justifyContent: "space-around",
            width: (dimenWidth - 48) / 2 - 3.5
          }}
        >
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              color: "#ffffff",
              fontWeight: "normal",
              textAlign: "center"
            }}
          >
            # Online Agents
          </Text>
          <View>
            <Text
              style={{
                fontSize: 40,
                color: "#ffffff",
                fontWeight: "bold",

                textAlign: "center"
              }}
            >
              0
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#ffffff",
                fontWeight: "normal",

                textTransform: "capitalize",
                textAlign: "center"
              }}
            >
              agents
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: 144,
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: "center",
            paddingHorizontal: 8,
            backgroundColor: "#0690A1",
            justifyContent: "space-around",
            width: (dimenWidth - 48) / 2 - 3.5
          }}
        >
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              color: "#ffffff",
              fontWeight: "normal",
              textAlign: "center"
            }}
          >
            Served by Me (unresolved)
          </Text>
          <View>
            <Text
              style={{
                fontSize: 40,
                color: "#ffffff",
                fontWeight: "bold",

                textAlign: "center"
              }}
            >
              {dataCountRoom != null ? dataCountRoom.live : 0}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#ffffff",
                fontWeight: "normal",

                textTransform: "capitalize",
                textAlign: "center"
              }}
            >
              customers
            </Text>
          </View>
        </View>
      );
    }
  };

  const StatusHomeContain = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 24,
          marginTop: 8,
          justifyContent: "space-between"
        }}
      >
        <View
          style={{
            height: 144,
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: "center",
            paddingHorizontal: 8,
            backgroundColor: "#ED5653",
            justifyContent: "space-around",
            width: (dimenWidth - 48) / 2 - 3.5
          }}
        >
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              color: "#ffffff",
              fontWeight: "normal",
              textAlign: "center"
            }}
          >
            Unserved Customers
          </Text>
          <View>
            {isLoading
              ? <ActivityIndicator color="#fff" size="large" />
              : <Text
                  style={{
                    fontSize: 40,
                    color: "#ffffff",
                    fontWeight: "bold",

                    textAlign: "center"
                  }}
                >
                  {dataCountRoom != null ? dataCountRoom.request : 0}
                </Text>}
            <Text
              style={{
                fontSize: 14,
                color: "#ffffff",
                fontWeight: "normal",

                textTransform: "capitalize",
                textAlign: "center"
              }}
            >
              customers
            </Text>
          </View>
        </View>

        <StatusHomeRight />
      </View>
    );
  };

  const StatusHomeShimmer = () => {
    return (
      <View style={styles.shimmerContainer}>
        <ShimmerPlaceHolder
          height={144}
          autoRun={true}
          width={(dimenWidth - 48) / 2 - 3.5}
          style={styles.continerShimmerStatusHeader}
        />
        <ShimmerPlaceHolder
          height={144}
          autoRun={true}
          width={(dimenWidth - 48) / 2 - 3.5}
          style={styles.continerShimmerStatusHeader}
        />
      </View>
    );
  };

  if (isLoading) {
    return <StatusHomeShimmer />;
  } else {
    return <StatusHomeContain />;
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  shimmerContainer: {
    flexDirection: "row",
    marginTop: verticalScale(8),
    justifyContent: "space-between",
    marginHorizontal: verticalScale(24)
  },
  continerShimmerStatusHeader: {
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(8)
  }
});
