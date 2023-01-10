import * as React from "react";

import {
  Text,
  View,
  Platform,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";

//Import Asset
import IconChannelLine from "./../../../../assets/image/icon_channel_line.svg";
import IconChannelOwnapp from "./../../../../assets/image/icon_channel_ownapp.svg";
import IconChannelWebchat from "./../../../../assets/image/icon_channel_webchat.svg";
import IconChannelWhatsapp from "./../../../../assets/image/icon_channel_whatsapp.svg";
import IconChannelTelegram from "./../../../../assets/image/icon_channel_telegram.svg";
import IconAllChannelActive from "./../../../../assets/image/icon_all_channel_active.svg";
import IconAllChannelInactive from "./../../../../assets/image/icon_all_channel_inactive.svg";
import IconChannelLineInactive from "./../../../../assets/image/icon_channel_line_inactive.svg";
import IconChannelOwnappInactive from "./../../../../assets/image/icon_channel_ownapp_inactive.svg";
import IconChannelWebchatInactive from "./../../../../assets/image/icon_channel_webchat_inactive.svg";
import IconChannelWhatsappInctive from "./../../../../assets/image/icon_channel_whatsapp_inactive.svg";
import IconChannelTelegramInactive from "./../../../../assets/image/icon_channel_telegram_inactive.svg";

//Import External
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import {
  setChannelFilter,
  setConversationFilter
} from "../../../../modules/redux/actions/roomChats/inSelectForFilter";
import { moderateScale, verticalScale } from "../../../other/Scaling";

const dataConversationAdmin = [
  {
    id: 4,
    status: "Unserved",
    count: 0
  },
  {
    id: 3,
    status: "Served",
    count: 0
  },
  {
    id: 2,
    status: "Resolved",
    count: 0
  },
  {
    id: 1,
    status: "All",
    count: 0
  }
];

const dataConversationStaff = [
  {
    id: 2,
    status: "Resolved",
    count: 0
  },
  {
    id: 1,
    status: "Served",
    count: 0
  }
];

const dataChannel = [
  {
    status: "all",
    imgActive: (
      <IconAllChannelActive
        width={moderateScale(38)}
        height={moderateScale(38)}
      />
    ),
    imgInActive: (
      <IconAllChannelInactive
        width={moderateScale(38)}
        height={moderateScale(38)}
      />
    )
  },
  {
    status: "whatsapp",
    imgActive: (
      <IconChannelWhatsapp
        width={moderateScale(30)}
        height={moderateScale(30)}
      />
    ),
    imgInActive: (
      <IconChannelWhatsappInctive
        width={moderateScale(30)}
        height={moderateScale(30)}
      />
    )
  },
  {
    status: "line",
    imgActive: (
      <IconChannelLine width={moderateScale(30)} height={moderateScale(30)} />
    ),
    imgInActive: (
      <IconChannelLineInactive
        width={moderateScale(30)}
        height={moderateScale(30)}
      />
    )
  },
  {
    status: "telegram",
    imgActive: (
      <IconChannelTelegram
        width={moderateScale(28)}
        height={moderateScale(28)}
      />
    ),
    imgInActive: (
      <IconChannelTelegramInactive
        width={moderateScale(28)}
        height={moderateScale(28)}
      />
    )
  },
  {
    status: "webchat",
    imgActive: (
      <IconChannelWebchat
        width={moderateScale(27)}
        height={moderateScale(30)}
      />
    ),
    imgInActive: (
      <IconChannelWebchatInactive
        width={moderateScale(27)}
        height={moderateScale(30)}
      />
    )
  },
  {
    status: "mobile",
    imgActive: (
      <IconChannelOwnapp width={moderateScale(30)} height={moderateScale(26)} />
    ),
    imgInActive: (
      <IconChannelOwnappInactive
        width={moderateScale(30)}
        height={moderateScale(26)}
      />
    )
  }
];

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

export default (FilterBottomSheet = ({
  refRBSheetFilter,
  onFilterAction,
  touchReset
}) => {
  const dispatch = useDispatch();
  let disFilter = useSelector(state => state.mDataSelectForFilter);
  let dtChannelSeleted = disFilter.channelFilter;
  let dtConversationSeleted = disFilter.conversationFilter;

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const onSelect = React.useCallback(id => {
    const newSelected = new Map();
    newSelected.set(id, true);
    dispatch(setConversationFilter(newSelected));
  }, dtConversationSeleted);

  const onSelectChannel = React.useCallback(
    status => {
      console.log("status_all", status);

      if (status == "all") {
        const newSelected = new Map();
        newSelected.set("all", true);
        dispatch(setChannelFilter(newSelected));
      } else {
        const newSelectedChannel = new Map(dtChannelSeleted);
        newSelectedChannel.set("all", false);
        newSelectedChannel.set(status, !dtChannelSeleted.get(status));
        let data = false;
        newSelectedChannel.forEach((entry, key) => {
          if (entry == true) {
            data = true;
          }
        });
        if (data == false) {
          newSelectedChannel.set("all", true);
        }
        dispatch(setChannelFilter(newSelectedChannel));
      }
    },
    [dtChannelSeleted]
  );

  const itemListConversation = (id, status, count, seleted, onSelect) => {
    return (
      <TouchableOpacity
        onPress={() => onSelect(id)}
        style={{ marginVertical: 4 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 19,
                height: 19,
                borderRadius: 18 / 2,
                borderWidth: 2,
                borderColor: "#A0A4A8",
                backgroundColor: !seleted ? "#A0A4A8" : "#fff"
              }}
            />
            <Text
              style={{
                fontSize: 14,
                marginLeft: 16,
                lineHeight: 24,
                fontWeight: "bold",
                letterSpacing: 0.1
              }}
            >
              {status}
            </Text>
          </View>
          {count != 0
            ? <View
                style={{
                  width: 36,
                  height: 24,
                  borderRadius: 36 / 2,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#64B161"
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#fff"
                  }}
                >
                  4
                </Text>
              </View>
            : null}
        </View>
      </TouchableOpacity>
    );
  };

  const itemListChannel = (
    status,
    imgActive,
    imgInActive,
    wasSeleted,
    onSelectChannel
  ) => {
    return (
      <View style={{ paddingRight: 14, alignSelf: "center" }}>
        <TouchableOpacity onPress={() => onSelectChannel(status)}>
          {wasSeleted ? imgInActive : imgActive}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <RBSheet
      duration={400}
      ref={refRBSheetFilter}
      closeOnPressMask={true}
      closeOnPressBack={true}
      // height={dataUser.role.name != "Staff" ? dimenHeight/moderateScale(1.3) : dimenHeight/moderateScale(1.6)}
      height={
        dataUser.role.name != "Staff" ? verticalScale(440) : verticalScale(400)
      }
      customStyles={{
        container: {
          backgroundColor: "transparent"
        }
      }}
    >
      <View style={styles.BSView}>
        <View
          style={{
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#2E3034",
              fontWeight: "bold"
            }}
          >
            Filter
          </Text>
          <TouchableOpacity onPress={() => touchReset()}>
            <Text
              style={{
                fontSize: 12,
                color: "#5588C3"
              }}
            >
              Reset
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 12,
            lineHeight: 24,
            marginBottom: 22,
            color: "#2E3034",
            fontWeight: "500"
          }}
        >
          Select the option below to load the desired data
        </Text>
        <Text
          style={{
            fontSize: 10,
            lineHeight: 24,
            marginBottom: 9,
            color: "#A0A4A8",
            fontWeight: "bold",
            letterSpacing: 0.1,

            textTransform: "uppercase"
          }}
        >
          Conversation
        </Text>
        <View>
          <FlatList
            data={
              dataUser.role.name != "Staff"
                ? dataConversationAdmin
                : dataConversationStaff
            }
            renderItem={({ item }) =>
              itemListConversation(
                item.id,
                item.status,
                item.count,
                !dtConversationSeleted.get(item.id),
                onSelect
              )}
            keyExtractor={item => item.id}
            extraData={dtConversationSeleted}
          />
        </View>
        <Text
          style={{
            fontSize: 10,
            marginTop: 28,
            lineHeight: 24,
            color: "#A0A4A8",
            marginBottom: 8,
            fontWeight: "bold",
            letterSpacing: 0.1,

            textTransform: "uppercase"
          }}
        >
          Channels
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <FlatList
            horizontal={true}
            data={dataChannel}
            renderItem={({ item }) =>
              itemListChannel(
                item.status,
                item.imgActive,
                item.imgInActive,
                !dtChannelSeleted.get(item.status),
                onSelectChannel
              )}
            keyExtractor={item => item.id}
            extraData={dtChannelSeleted}
          />
        </View>
        <TouchableOpacity
          onPress={() => onFilterAction()}
          style={{
            height: 48,
            marginTop: 27,
            borderRadius: 10,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#5588C3",
            width: dimenWidth / 1.18
          }}
        >
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
            Proceed
          </Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  BSView: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    width: Dimensions.get("screen").width
  }
});
