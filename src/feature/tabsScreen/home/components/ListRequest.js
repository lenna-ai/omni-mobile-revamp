import * as React from "react";

import {
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity
} from "react-native";

//Import External
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

//Import Internal
import API from "./../../../../utils/api";
import {
  addDataForAssignLivechat,
  addDataForAssignRoomId,
  addDataForAssignAgentInfo
} from "../../../../modules/redux/actions/member/inForAssign";

//Import Asset
import IconLine from "./../../../../assets/image/icon_line.svg";
import IconOwnapp from "./../../../../assets/image/icon_ownapp.svg";
import IconChatbot from "./../../../../assets/image/icon_chatbot.svg";
import IconWebChat from "./../../../../assets/image/icon_webchat.svg";
import IconTelegram from "./../../../../assets/image/icon_telegram.svg";
import IconWhatsapp from "./../../../../assets/image/icon_whatsapp.svg";
import IconLitechat from "./../../../../assets/image/icon_litechat.svg";
import IconFbmessenger from "./../../../../assets/image/icon_fbmessenger.svg";
import IllustrationNoInquiries from "./../../../../assets/image/illustration_no_inquiries.svg";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

export default (ListRequest = ({ navigation }) => {
  const dispatch = useDispatch();

  let disDataMain = useSelector(state => state.mDataMain);
  let containRoomRequest = disDataMain.dataRoomRequest;

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const [selected, setSelected] = React.useState(new Map());

  React.useEffect(
    () => {
      const unsubscribe = navigation.addListener("focus", () => {
        setSelected(new Map());
      });
      return unsubscribe;
    },
    [navigation]
  );

  const onSelect = React.useCallback(
    (id, livechat, agent_info) => {
      const newSelected = new Map(new Map());
      newSelected.set(id, true);

      setSelected(newSelected);
      dispatch(addDataForAssignRoomId(id));
      dispatch(addDataForAssignLivechat(livechat));
      dispatch(addDataForAssignAgentInfo(agent_info));
    },
    [selected]
  );

  const TextTitleListRequest = () => {
    if (containRoomRequest == undefined || containRoomRequest.length == 0) {
      return (
        <Text
          style={{
            fontSize: 14,
            color: "#A5A5A5",
            textAlign: "center",
            fontWeight: "bold",

            textTransform: "capitalize"
          }}
        >
          No incoming inquiries
        </Text>
      );
    } else {
      return (
        <Text
          style={{
            fontSize: 14,
            color: "#2E3034",
            fontWeight: "bold",

            textTransform: "capitalize"
          }}
        >
          Newest incoming inquiries
        </Text>
      );
    }
  };

  const renderData = ({ item, index }) => {
    let picture = undefined;

    if (item.created_by.picture != null) {
      if (item.created_by.picture.search("https") != -1) {
        picture = { uri: item.created_by.picture };
      } else {
        picture = require("./../../../../assets/image/no_avatar.jpg");
      }
    } else {
      picture = require("./../../../../assets/image/no_avatar.jpg");
    }

    return (
      <View>
        <View
          style={{
            width: dimenWidth - 48,
            backgroundColor: index != 0 ? "#c4c4c4" : "#00000000",
            marginBottom: 10
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: 80,
              justifyContent: "space-between",
              marginRight: 16
            }}
          >
            {item.channel != null || item.channel != undefined
              ? item.channel.name == "webchat"
                ? <IconWebChat width={32} height={32} />
                : item.channel.name == "whatsapp"
                  ? <IconWhatsapp width={32} height={32} />
                  : item.channel.name == "telegram"
                    ? <IconTelegram width={32} height={32} />
                    : item.channel.name == "mobile"
                      ? <IconOwnapp width={32} height={32} />
                      : item.channel.name == "facebook"
                        ? <IconFbmessenger width={32} height={32} />
                        : item.channel.name == "line"
                          ? <IconLine width={32} height={32} />
                          : item.channel.name == "litechat"
                            ? <IconLitechat width={32} height={32} />
                            : <IconChatbot width={32} height={32} />
              : null}
            <Image
              source={picture}
              style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
            />
          </View>
          <View>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: "#2E3034",
                fontWeight: "bold",

                textTransform: "capitalize"
              }}
            >
              {item.created_by.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: "#2E3034",
                fontWeight: "normal"
              }}
            >
              {item.messages[0].content[0].text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDataClick = (
    index,
    id,
    channel,
    created_by,
    updated_at,
    livechat,
    messages,
    agent_info,
    selected,
    onSelect
  ) => {
    let statusLive = "Bot";
    let picture = undefined;
    let StatusBackground = "#3490dc";
    let dateLastChat = moment(updated_at).format("l");

    if (created_by.picture != null) {
      if (created_by.picture.search("https") != -1) {
        picture = { uri: created_by.picture };
      } else {
        picture = require("./../../../../assets/image/no_avatar.jpg");
      }
    } else {
      picture = require("./../../../../assets/image/no_avatar.jpg");
    }

    if (livechat != null) {
      if (livechat.status == "live") {
        statusLive = "Served";
        StatusBackground = "#38c172";
      } else if (livechat.status == "resolved") {
        statusLive = "Resolved";
        StatusBackground = "#000";
      } else if (livechat.status == "request") {
        statusLive = "Unserved";
        StatusBackground = "#ED5653";
      }
    }

    return (
      <View>
        <View
          style={{
            marginBottom: 10,
            width: dimenWidth - 48,
            backgroundColor: index != 0 ? "#c4c4c4" : "#00000000"
          }}
        />
        <TouchableOpacity onPress={() => onSelect(id, livechat, agent_info)}>
          <View
            style={{
              flex: 1,
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: !selected ? "#e5e5e5" : "#ffffff"
            }}
          >
            <View
              style={{
                width: 64,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              {channel != null || channel != undefined
                ? channel.name == "webchat"
                  ? <IconWebChat width={18} height={18} />
                  : channel.name == "whatsapp"
                    ? <IconWhatsapp width={18} height={18} />
                    : channel.name == "telegram"
                      ? <IconTelegram width={18} height={18} />
                      : channel.name == "mobile"
                        ? <IconOwnapp width={18} height={18} />
                        : channel.name == "facebook"
                          ? <IconFbmessenger width={18} height={18} />
                          : channel.name == "line"
                            ? <IconLine width={18} height={18} />
                            : channel.name == "litechat"
                              ? <IconLitechat width={18} height={18} />
                              : <IconChatbot width={18} height={18} />
                : null}
              <Image
                source={picture}
                style={{ width: 38, height: 38, borderRadius: 38 / 2 }}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  color: "#2E3034",
                  fontWeight: "bold",

                  textTransform: "capitalize"
                }}
              >
                {created_by.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  color: "#2E3034",
                  fontWeight: "normal"
                }}
              >
                {messages[0].content[0].text}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  marginBottom: 5
                }}
              >
                {dateLastChat}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#fff",
                  overflow: "hidden",
                  alignSelf: "flex-end",
                  paddingHorizontal: 10,

                  backgroundColor: StatusBackground,
                  borderRadius: Platform.OS == "android" ? 16 : 7
                }}
              >
                {statusLive}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const emptyNewst = () => {
    return <IllustrationNoInquiries width={dimenWidth - 48} height={200} />;
  };

  return (
    <View style={{ flex: 1, marginBottom: 20 }}>
      <TextTitleListRequest />
      {dataUser.role.name == "Staff"
        ? <FlatList
            nestedScrollEnabled
            horizontal={false}
            renderItem={renderData}
            data={containRoomRequest}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => emptyNewst()}
            keyExtractor={(item, index) => index.toString()}
          />
        : <FlatList
            horizontal={false}
            nestedScrollEnabled
            renderItem={({ item, index }) =>
              renderDataClick(
                index,
                item.id,
                item.channel,
                item.created_by,
                item.updated_at,
                item.livechat,
                item.messages,
                item.agent_info,
                !selected.get(item.id),
                onSelect
              )}
            extraData={selected}
            data={containRoomRequest}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => emptyNewst()}
            keyExtractor={(item, index) => index.toString()}
          />}
    </View>
  );
});
