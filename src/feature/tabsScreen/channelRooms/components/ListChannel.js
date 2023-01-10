import moment from "moment";
import * as React from "react";
import IconChatbot from "./../../../../assets/image/icon_chatbot.svg";
import IconFbmessenger from "./../../../../assets/image/icon_fbmessenger.svg";
import IconLine from "./../../../../assets/image/icon_line.svg";
import IconLitechat from "./../../../../assets/image/icon_litechat.svg";
import IconOwnapp from "./../../../../assets/image/icon_ownapp.svg";
import IconTelegram from "./../../../../assets/image/icon_telegram.svg";
import IconWebChat from "./../../../../assets/image/icon_webchat.svg";
import IconWhatsapp from "./../../../../assets/image/icon_whatsapp.svg";
import IconInstagram from "./../../../../assets/image/icon_instagram.svg";
import IconTwitter from "./../../../../assets/image/icon_twitter.svg";

import EmptyComponent from "./../../../other/EmptyComponent";

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSelector } from "react-redux";
import { moderateScale } from "../../../other/Scaling";
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const ListChannel = ({
  goToChat,
  isLoading,
  onFetching,
  dataLoadMore,
  renderFooter
}) => {
  let disRooms = useSelector(state => state.mDataRoomsChat);
  let dataRooms = disRooms.dataRoomsChat;

  const renderData = ({ item }) => {
    let statusLive = "Bot";
    let urlImage = false;
    let StatusBackground = "#3577f11a";
    let StatusTextColor = "#3577f1";
    let dateLastChat = moment(item.updated_at).format("l");
    var name = item.created_by.name;
    var array_split = name.split(" ");
    var data_initial = "";

    array_split.slice(0, 2).map(data => {
      data_initial = data_initial + data.charAt(0);
      name = data_initial;
    });

    if (item.livechat != null) {
      if (item.livechat.status == "live") {
        statusLive = "Served";
        StatusBackground = "#0ab39c1a";
        StatusTextColor = "#0ab39c";
      } else if (item.livechat.status == "resolved") {
        statusLive = "Resolved";
        StatusBackground = "#2125291a";
        StatusTextColor = "black";
      } else if (item.livechat.status == "request") {
        statusLive = "Unserved";
        StatusBackground = "#f065481a";
        StatusTextColor = "#f06548";
      }
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => goToChat(item, statusLive)}>
          <View style={styles.containerChat}>
            <View style={[styles.container, styles.container2]}>
              <View style={styles.boxLeft}>
                <View style={styles.iconProfile}>
                  {item.channel != null || item.channel != undefined
                    ? item.channel.name == "webchat"
                      ? <IconWebChat width={15} height={15} />
                      : item.channel.name == "whatsapp"
                        ? <IconWhatsapp width={15} height={15} />
                        : item.channel.name == "telegram"
                          ? <IconTelegram width={15} height={15} />
                          : item.channel.name == "mobile"
                            ? <IconOwnapp width={15} height={15} />
                            : item.channel.name == "facebook"
                              ? <IconFbmessenger width={15} height={15} />
                              : item.channel.name == "line"
                                ? <IconLine width={15} height={15} />
                                : item.channel.name == "litechat"
                                  ? <IconLitechat width={15} height={15} />
                                  : item.channel.name == "instagram"
                                    ? <IconInstagram width={15} height={15} />
                                    : item.channel.name == "twitter"
                                      ? <IconTwitter width={15} height={15} />
                                      : <IconChatbot width={15} height={15} />
                    : <IconWebChat width={15} height={15} />}
                  <View>
                    {item.created_by.picture.split("/").pop() !==
                    "no_avatar.jpg"
                      ? <Image
                          style={{
                            ...styles.imgSize
                          }}
                          source={{ uri: item.created_by.picture }}
                        />
                      : <View
                          style={{
                            ...styles.imgSize,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#F3F6F9"
                          }}
                        >
                          <Text style={{ color: "#405189" }}>
                            {name.toLocaleUpperCase()}
                          </Text>
                        </View>}
                  </View>
                  {item.unread_count != 0
                    ? <View style={styles.badgeChatCount}>
                        <Text style={styles.txtBadge}>
                          {item.unread_count}
                        </Text>
                      </View>
                    : null}
                </View>
              </View>
              <View style={{ flex: 0.56 }}>
                <View style={{ paddingHorizontal: 3 }}>
                  <Text numberOfLines={1} style={styles.txtCreateByName}>
                    {item.created_by.name}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text numberOfLines={2} style={styles.txtMessagesContent}>
                      {item.messages[0].content[0].text}
                    </Text>
                  </View>
                  <Text numberOfLines={1} style={styles.txtTags}>
                    Tags
                  </Text>
                </View>
              </View>
              <View style={{ flex: 0.24 }}>
                <Text style={styles.txtChatRightDate}>
                  {dateLastChat}
                </Text>
                <View style={styles.listChatRightDate}>
                  <Text
                    style={[
                      styles.txtChatRightStatus,
                      {
                        backgroundColor: StatusBackground,
                        color: StatusTextColor,
                        fontWeight: "bold"
                      }
                    ]}
                  >
                    {statusLive}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.container3} />
      </View>
    );
  };

  const listEmptyComponent = () => {
    return <EmptyComponent />;
  };

  return (
    <View style={[styles.container4, { backgroundColor: "#FFF" }]}>
      <FlatList
        data={dataRooms}
        horizontal={false}
        refreshing={isLoading}
        renderItem={renderData}
        onEndReachedThreshold={1}
        onRefresh={() => onFetching()}
        onEndReached={() => dataLoadMore()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => renderFooter()}
        ListEmptyComponent={() => listEmptyComponent()}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container2: {
    paddingVertical: 10,
    flexDirection: "row"
  },
  container4: {
    flex: 1,
    backgroundColor: "#fff"
  },
  containerChat: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12
    // paddingVertical: 10,
  },
  containContainer: {
    width: "6%",
    justifyContent: "center"
  },
  containContainer3: {
    width: "48%",
    flexDirection: "column"
  },
  containContainer3Sub: {
    fontSize: 14,
    paddingBottom: 7,
    fontWeight: "bold"
  },
  containContainer4: {
    width: "22%",
    alignItems: "flex-end",
    flexDirection: "column"
  },
  container3: {
    height: 0.5,
    width: "100%",
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#c0c2c4"
  },
  txtCreateByName: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "bold",

    textTransform: "capitalize"
  },
  txtTags: {
    fontSize: 11,
    marginBottom: 4,
    fontWeight: "bold",

    textTransform: "capitalize",
    color: "#406189"
  },
  txtMessagesContent: {
    fontSize: 12
  },
  txtChatRightDate: {
    fontSize: 12,
    alignSelf: "flex-end"
  },
  listChatRightDate: {
    marginTop: 8,
    alignItems: "flex-start"
  },
  txtChatRightStatus: {
    fontSize: 10,
    color: "#fff",
    overflow: "hidden",
    alignSelf: "flex-end",
    paddingHorizontal: 10,

    borderRadius: Platform.OS == "android" ? 2 : 2
  },
  imgSize: {
    borderColor: "#F3F6F9",
    width: moderateScale(39),
    height: moderateScale(39),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(39),
    marginLeft: moderateScale(5)
  },
  boxLeft: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  iconProfile: {
    flexDirection: "row",
    alignItems: "center",
    height: 40
  },
  badgeChatCount: {
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    position: "absolute",
    alignItems: "center",
    backgroundColor: "red",
    justifyContent: "center"
  },
  txtBadge: {
    fontSize: 10,
    color: "#fff"
  }
});

export default React.memo(ListChannel);
