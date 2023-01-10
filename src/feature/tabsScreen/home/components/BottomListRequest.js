import * as React from "react";
import LinearGradient from "react-native-linear-gradient";

import { useSelector } from "react-redux";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

const dimenWidth = Dimensions.get("screen").width;
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default (BottomListRequest = ({ buttonGetCustomer, goToAssign }) => {
  const disStatus = useSelector(state => state.mDataStatus);
  let dataCountRoom = disStatus.dataCountRoom;
  let dataLoading = disStatus.loadingGetCustomer;
  let isLoading = disStatus.loadingCountRoom;

  const disSeletedAssign = useSelector(state => state.mDataForAssign);
  let dataSeletedAssign = disSeletedAssign.roomIdAssign;

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const BottomListShimmer = () => {
    return (
      <ShimmerPlaceHolder
        height={46}
        autoRun={true}
        width={dimenWidth - 48}
        style={styles.continerShimmerBottomList}
      />
    );
  };

  const actionGetCustomer = () => {
    if (dataCountRoom != null) {
      if (dataCountRoom.request != 0) {
        buttonGetCustomer();
      }
    }
  };

  // React.useEffect(() => {
  //     console.log("DATA___USER", dataUser);
  // }, []);

  const checkForAssign = () => {
    if (dataSeletedAssign != 0) {
      goToAssign();
    }
  };

  const BottomListContain = () => {
    if (dataUser.role.name == "Staff") {
      return (
        <View style={{ height: 60, alignItems: "center" }}>
          {dataLoading
            ? <View
                style={{
                  height: 44,
                  borderRadius: 10,
                  flexDirection: "row",
                  width: dimenWidth - 48,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#5588C3"
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#fff",
                    marginRight: 12,
                    fontWeight: "bold"
                  }}
                >
                  Loading
                </Text>
                <ActivityIndicator color="#fff" size="small" />
              </View>
            : <TouchableOpacity onPress={() => actionGetCustomer()}>
                <View
                  style={{
                    height: 44,
                    borderRadius: 10,
                    flexDirection: "row",
                    width: dimenWidth - 48,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      dataCountRoom != null
                        ? dataCountRoom.request != 0 ? "#5588C3" : "#C9C9C9"
                        : "#C9C9C9"
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#fff",
                      fontWeight: "bold"
                    }}
                  >
                    Get Customer
                  </Text>
                  <View
                    style={{
                      width: 27,
                      height: 24,
                      marginLeft: 12,
                      borderRadius: 27 / 2,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff"
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 14,
                        marginBottom: 2,
                        fontWeight: "bold",

                        color:
                          dataCountRoom != null
                            ? dataCountRoom.request != 0 ? "#F1544A" : "#C9C9C9"
                            : "#C9C9C9"
                      }}
                    >
                      {dataCountRoom != null ? dataCountRoom.request : 0}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>}
        </View>
      );
    } else {
      return (
        <View style={{ height: 60, alignItems: "center" }}>
          <TouchableOpacity onPress={() => checkForAssign()}>
            <View
              style={{
                height: 44,
                borderRadius: 10,
                width: dimenWidth - 48,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: dataSeletedAssign != 0 ? "#5588C3" : "#C9C9C9"
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: "bold"
                }}
              >
                Assign to
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const BottomListComponent = () => {
    if (isLoading) {
      return <BottomListShimmer />;
    } else {
      return <BottomListContain />;
    }
  };

  return <BottomListComponent />;
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  continerShimmerBottomList: {
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: "center",
    justifyContent: "center"
  }
});
