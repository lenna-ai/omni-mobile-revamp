import * as React from "react";

import {
  Text,
  View,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image
} from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import { moderateScale } from "../../../other/Scaling";
import {
  imageIconPin,
  imageIconAssignTo,
  imageIconResolved
} from "../../../../assets/icons";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const BSSheetMore = ({
  goToAssign,
  handleRooms,
  statusAction,
  resolvedRooms,
  refRBSheetMore
}) => {
  return (
    <RBSheet
      duration={400}
      ref={refRBSheetMore}
      closeOnPressMask={true}
      closeOnPressBack={true}
      customStyles={{
        container: {
          backgroundColor: "transparent"
        }
      }}
    >
      <View style={styles.BSView}>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 26,
            color: "#2E3034",
            fontWeight: "bold"
          }}
        >
          Actions
        </Text>
        {/* || statusAction !== "Unserved" */}

        {statusAction == "Resolved" || statusAction == "Unserved"
          ? null
          : <TouchableOpacity
              onPress={() =>
                statusAction == "Served" ? resolvedRooms() : handleRooms()}
              style={{ marginBottom: 14 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 37,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {imageIconResolved(moderateScale(36), moderateScale(31))}
                </View>
                {statusAction == "Served"
                  ? <Text
                      style={{
                        fontSize: 14,
                        marginLeft: 16,
                        lineHeight: 24,
                        fontWeight: "bold",
                        letterSpacing: 0.1
                      }}
                    >
                      Resolved
                    </Text>
                  : <Text
                      style={{
                        fontSize: 14,
                        marginLeft: 16,
                        lineHeight: 24,
                        fontWeight: "bold",
                        letterSpacing: 0.1
                      }}
                    >
                      Handle
                    </Text>}
              </View>
            </TouchableOpacity>}
        {/* {statusAction !== "Resolved"?(
                    <TouchableOpacity 
                        onPress={() => 
                            statusAction == 'Served' ? resolvedRooms() : handleRooms() 
                        }
                        style={{marginBottom: 14}}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: 37, justifyContent: 'center', alignItems: 'center'}}>
                                {imageIconResolved(moderateScale(36), moderateScale(31))}
                            </View>
                            {statusAction == 'Served' ? (
                                <Text
                                    style={{
                                        fontSize: 14,
                                        marginLeft: 16,
                                        lineHeight: 24,
                                        fontWeight: 'bold',
                                        letterSpacing: 0.1,
                                        
                                    }}
                                >
                                    Resolved
                                </Text>
                            ) : (
                                <Text
                                    style={{
                                        fontSize: 14,
                                        marginLeft: 16,
                                        lineHeight: 24,
                                        fontWeight: 'bold',
                                        letterSpacing: 0.1,
                                        
                                    }}
                                >
                                    Handle
                                </Text>
                                
                            )}
                        </View>
                    </TouchableOpacity>
                ):null} */}
        <TouchableOpacity style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 37,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {imageIconPin(moderateScale(24), moderateScale(24))}
            </View>
            <Text
              style={{
                fontSize: 14,
                marginLeft: 16,
                lineHeight: 24,
                fontWeight: "bold",
                letterSpacing: 0.1
              }}
            >
              Pin this user {"&"} coversations
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginBottom: 14 }}
          onPress={() => goToAssign()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 37,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {imageIconAssignTo(moderateScale(24), moderateScale(24))}
            </View>
            <Text
              style={{
                fontSize: 14,
                marginLeft: 16,
                lineHeight: 24,
                fontWeight: "bold",
                letterSpacing: 0.1
              }}
            >
              Assign to team
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginBottom: 14 }}
          onPress={() => goToAssign()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 37,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                source={require("../../../../assets/image/icon-note.png")}
                style={{ height: 24, width: 24 }}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                marginLeft: 16,
                lineHeight: 24,
                fontWeight: "bold",
                letterSpacing: 0.1
              }}
            >
              Note
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  BSView: {
    flex: 1,
    paddingTop: 36,
    width: dimenWidth,
    paddingHorizontal: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white"
  }
});

export default React.memo(BSSheetMore);
