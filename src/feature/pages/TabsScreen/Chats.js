import * as React from "react";

import {
  Text,
  View,
  Image,
  Platform,
  FlatList,
  TextInput,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// Import Asset
import IconLine from "./../../../assets/image/icon_line.svg";
import IconBack from "./../../../assets/image/icon_back.svg";
import IconFilter from "./../../../assets/image/icon_filter.svg";
import IconSearch from "./../../../assets/image/icon_search.svg";
import IconOwnapp from "./../../../assets/image/icon_ownapp.svg";
import IconChatbot from "./../../../assets/image/icon_chatbot.svg";
import IconWebChat from "./../../../assets/image/icon_webchat.svg";
import IconTelegram from "./../../../assets/image/icon_telegram.svg";
import IconWhatsapp from "./../../../assets/image/icon_whatsapp.svg";
import IconLitechat from "./../../../assets/image/icon_litechat.svg";
import IconFbmessenger from "./../../../assets/image/icon_fbmessenger.svg";
import IconChannelLine from "./../../../assets/image/icon_channel_line.svg";
import IconChannelOwnapp from "./../../../assets/image/icon_channel_ownapp.svg";
import IconChannelWebchat from "./../../../assets/image/icon_channel_webchat.svg";
import IconChannelWhatsapp from "./../../../assets/image/icon_channel_whatsapp.svg";
import IconChannelTelegram from "./../../../assets/image/icon_channel_telegram.svg";
import IconAllChannelActive from "./../../../assets/image/icon_all_channel_active.svg";
import IconAllChannelInactive from "./../../../assets/image/icon_all_channel_inactive.svg";
import IconChannelLineInactive from "./../../../assets/image/icon_channel_line_inactive.svg";
import IllustrationNoActiveChat from "./../../../assets/image/illustration_no_active_chat.svg";
import IconChannelOwnappInactive from "./../../../assets/image/icon_channel_ownapp_inactive.svg";
import IconChannelWebchatInactive from "./../../../assets/image/icon_channel_webchat_inactive.svg";
import IconChannelWhatsappInctive from "./../../../assets/image/icon_channel_whatsapp_inactive.svg";
import IconChannelTelegramInactive from "./../../../assets/image/icon_channel_telegram_inactive.svg";

import LoadingBig from "./../../../assets/anime/loading_big.gif";

// Import External
import moment from "moment";
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { Header, Avatar } from "react-native-elements";

// Import Internal
import API from "./../../../utils/api";
import { getDataWithBody } from "./../../../modules/services";
import {
  addDataRooms,
  reloadDataRooms,
} from "./../../../modules/redux/actions/inChatRoom";
import { encodeHashIds } from "../../../utils/encode";
import EmptyComponent from "../../other/EmptyComponent";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const Chats = ({ navigation }) => {
  const dispatch = useDispatch();
  const disChatRooms = useSelector((state) => state.mDataChatRooms);
  let dataChatRooms = disChatRooms.data;

  const disUser = useSelector((state) => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const [txtSearch, setTxtSearch] = React.useState("");
  const [isSearch, setIsSearch] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const [dataFixSearch, setDataFixSearch] = React.useState("");

  const [index, setIndex] = React.useState(1);

  const refRBSheetFilter = React.useRef();

  const [selected, setSelected] = React.useState(new Map());
  const [selectedChannel, setSelectedChannel] = React.useState(new Map());

  const dataConversationAll = [
    {
      id: 1,
      status: "Unserved",
      count: 0,
    },
    {
      id: 2,
      status: "Served",
      count: 0,
    },
    {
      id: 3,
      status: "Resolved",
      count: 0,
    },
    {
      id: 4,
      status: "All",
      count: 0,
    },
  ];

  const dataConversationStaff = [
    {
      id: 1,
      status: "Resolved",
      count: 0,
    },
    {
      id: 2,
      status: "Served",
      count: 0,
    },
  ];

  React.useEffect(() => {
    console.log("DATA_USER", dataUser);
  }, []);

  const dataChannel = [
    {
      status: "all",
      imgActive: <IconAllChannelActive width={38} height={38} />,
      imgInActive: <IconAllChannelInactive width={38} height={38} />,
    },
    {
      status: "whatsapp",
      imgActive: <IconChannelWhatsapp width={33} height={33} />,
      imgInActive: <IconChannelWhatsappInctive width={33} height={33} />,
    },
    {
      status: "line",
      imgActive: <IconChannelLine width={30} height={30} />,
      imgInActive: <IconChannelLineInactive width={30} height={30} />,
    },
    {
      status: "telegram",
      imgActive: <IconChannelTelegram width={28} height={28} />,
      imgInActive: <IconChannelTelegramInactive width={28} height={28} />,
    },
    {
      status: "webchat",
      imgActive: <IconChannelWebchat width={27} height={30} />,
      imgInActive: <IconChannelWebchatInactive width={27} height={30} />,
    },
    {
      status: "mobile",
      imgActive: <IconChannelOwnapp width={30} height={26} />,
      imgInActive: <IconChannelOwnappInactive width={30} height={26} />,
    },
  ];

  const requestToServer = async () => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id),
    };

    setIndex(1);

    let params = {
      name: txtSearch,
      channel: channelParams(),
      status: statusParams(),
      lastRoom: "",
    };
    console.log("PARAMS_REQUES_TO_SERVE", params);
    let res = await getDataWithBody(
      API.PATH + encodeHashIds(dataUser.app_id) + "/room/get-room-list-new",
      params,
      headers
    );
    if (res.data != undefined || res.data.length != 0) {
      dispatch(addDataRooms(res.data));
    }
    setIsFetching(false);
    setIsLoading(false);
  };

  const requestToServerMore = async () => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id),
    };

    let lastRoom = "";
    let dataIndex = index * 7;
    const dataChannel =
      channelParams() != undefined || channelParams().length != 0
        ? channelParams()
        : "";
    if (dataChatRooms.length >= dataIndex) {
      lastRoom = dataChatRooms[dataChatRooms.length - 1].updated_at;
      let params = {
        name: dataFixSearch,
        channel: dataChannel,
        status: statusParams(),
        lastRoom: lastRoom,
      };
      console.log("PARAMS_NEW_LOAD_MORE", params);
      let res = await getDataWithBody(
        API.PATH + encodeHashIds(dataUser.app_id) + "/room/get-room-list-new",
        params,
        headers
      );
      console.log("NEW_LOAD_MORE", res);
      if (res.data != undefined || res.data.length != 0) {
        setIndex(index + 1);
        dispatch(addDataRooms(res.data));
      }
    }
    setIsLoadingMore(false);
  };

  const statusParams = () => {
    let dataNum = 0;
    let dataParams = "";
    let data = [...selected];

    if (data.length != undefined || data.length > 0) {
      data.map((dt) => {
        if (dt[1] == true) {
          dataNum = dt[0];
        }
      });
      switch (dataNum) {
        case 1:
          dataParams = "request";
          break;
        case 2:
          dataParams = "live";
          break;
        case 3:
          dataParams = "resolved";
          break;
        default:
          dataParams = "";
          break;
      }
    }
    return dataParams;
  };

  const channelParams = () => {
    let dataArray = [];
    let data = [...selectedChannel];
    if (data.length != undefined || data.length > 0) {
      data.map((dt) => {
        if (dt[0] != "all") {
          if (dt[1] == true) {
            dataArray.push(dt[0]);
          }
        }
      });
    }
    return dataArray;
  };

  const resetFilter = () => {
    const newSelected = new Map();
    if (dataUser.role.name == "Staff") {
      newSelected.set(2, true);
    } else {
      newSelected.set(4, true);
    }
    setSelected(newSelected);

    const newSelectedChannel = new Map();
    newSelectedChannel.set("all", true);
    setSelectedChannel(newSelectedChannel);
  };

  const touchReset = () => {
    refRBSheetFilter.current.close();
    setIsLoading(true);
    resetFilter();
    setTimeout(() => {
      requestToServer();
    }, 2000);
  };

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(reloadDataRooms([]));
    resetFilter();
    setTimeout(() => {
      requestToServer();
    }, 2000);
  }, []);

  const dataLoadMore = React.useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    requestToServerMore();
  });

  const onSelect = React.useCallback(
    (id) => {
      const newSelected = new Map();
      newSelected.set(id, true);
      setSelected(newSelected);
    },
    [selected]
  );

  const onSelectChannel = React.useCallback(
    (status) => {
      if (status == "all") {
        const newSelected = new Map();
        newSelected.set("all", true);
        setSelectedChannel(newSelected);
      } else {
        const newSelectedChannel = new Map(selectedChannel);
        newSelectedChannel.set("all", false);
        newSelectedChannel.set(status, !selectedChannel.get(status));
        setSelectedChannel(newSelectedChannel);
      }
    },
    [selectedChannel]
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View
          style={{
            paddingVertical: 8,
          }}
        >
          <ActivityIndicator color="#049FFF" size="large" />
        </View>
      );
    } else {
      return null;
    }
  };

  const renderData = ({ item }) => {
    let statusLive = "Bolt";
    let StatusBackground = "#3490dc";
    let dateLastChat = moment(item.updated_at).format("l");
    let picture = {
      uri: API.BASE_URL + "app/public/images/pictures/no_avatar.jpg",
    };

    if (item.livechat != null) {
      if (item.livechat.status == "live") {
        statusLive = "Served";
        StatusBackground = "#38c172";
      } else if (item.livechat.status == "resolved") {
        statusLive = "Resolved";
        StatusBackground = "#000";
      } else if (item.livechat.status == "request") {
        statusLive = "Unserved";
        StatusBackground = "#ED5653";
      }
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Chat", {
              dataItem: item,
            });
          }}
        >
          <View style={styles.containerChat}>
            <View style={[styles.container, styles.container2]}>
              <View
                style={{
                  flex: 0.2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                {item.channel != null || item.channel != undefined ? (
                  item.channel.name == "webchat" ? (
                    <IconWebChat width={18} height={18} />
                  ) : item.channel.name == "whatsapp" ? (
                    <IconWhatsapp width={18} height={18} />
                  ) : item.channel.name == "telegram" ? (
                    <IconTelegram width={18} height={18} />
                  ) : item.channel.name == "mobile" ? (
                    <IconOwnapp width={18} height={18} />
                  ) : item.channel.name == "facebook" ? (
                    <IconFbmessenger width={18} height={18} />
                  ) : item.channel.name == "line" ? (
                    <IconLine width={18} height={18} />
                  ) : item.channel.name == "litechat" ? (
                    <IconLitechat width={18} height={18} />
                  ) : (
                    <IconChatbot width={18} height={18} />
                  )
                ) : null}
                <View>
                  <Avatar size={38} rounded source={picture} />

                  {item.unread_count != 0 ? (
                    <View
                      style={{
                        top: -4,
                        right: -4,
                        width: 18,
                        height: 18,
                        borderRadius: 18 / 2,
                        position: "absolute",
                        alignItems: "center",
                        backgroundColor: "red",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#fff",
                          
                        }}
                      >
                        {item.unread_count}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={{ flex: 0.56 }}>
                <View style={{ paddingHorizontal: 18 }}>
                  <Text numberOfLines={1} style={styles.txtCreateByName}>
                    {item.created_by.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.txtMessagesContent}>
                    {item.messages[0].content[0].text}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 0.24 }}>
                <Text style={styles.txtChatRightDate}>{dateLastChat}</Text>
                <View style={styles.listChatRightDate}>
                  <Text
                    style={[
                      styles.txtChatRightStatus,
                      { backgroundColor: StatusBackground },
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

  const onSubmitSearch = () => {
    if (txtSearch != "") {
      setDataFixSearch(txtSearch);
      setIsLoading(true);
      requestToServer();
    }
  };

  const onFetching = () => {
    setIsLoading(true);
    setIsFetching(true);
    dispatch(reloadDataRooms());
    requestToServer();
  };

  const listEmptyComponent = () => {
    return <EmptyComponent />;
  };

  const closeSearch = () => {
    setIsSearch(false);
    if (dataFixSearch != "") {
      setIsLoading(true);
      setTxtSearch("");
      setDataFixSearch("");
      requestToServer();
    }
  };

  const onFilterAction = () => {
    refRBSheetFilter.current.close();
    setIsLoading(true);
    requestToServer();
  };

  const showSearchInHeader = () => {
    if (isSearch) {
      return (
        <>
          <View
            style={[
              styles.containInput,
              {
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
              },
            ]}
          >
            <TouchableOpacity onPress={() => closeSearch()}>
              <IconSearch width={16} height={16} style={{ marginRight: 4 }} />
            </TouchableOpacity>
            <TextInput
              value={txtSearch}
              returnKeyType="search"
              autoCapitalize="none"
              keyboardType="default"
              placeholder="Search customer"
              underlineColorAndroid="transparent"
              onChange={(value) => setTxtSearch(value.nativeEvent.text)}
              onSubmitEditing={() => onSubmitSearch()}
            />
          </View>
        </>
      );
    }
  };

  const hideSearchInHeader = () => {
    if (!isSearch) {
      return (
        <>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconBack />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 6,
              color: "#000",
              fontSize: 24,
              fontWeight: "bold",
              
              textTransform: "uppercase",
            }}
          >
            Chat Panel
          </Text>
          <TouchableOpacity
            onPress={() => setIsSearch(true)}
            style={{
              right: 0,
              position: "absolute",
            }}
          >
            <IconSearch width={16} height={16} />
          </TouchableOpacity>
        </>
      );
    }
  };

  const headerWithSearch = () => {
    return (
      <Header
        placement="left"
        centerComponent={() => {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "82%",
                  height: 43,
                }}
              >
                {showSearchInHeader()}
                {hideSearchInHeader()}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "18%",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => refRBSheetFilter.current.open()}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40 / 2,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      dataChatRooms === undefined || dataChatRooms.length == 0
                        ? "#C0C0C0"
                        : "#049FFF",
                  }}
                >
                  <IconFilter />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        containerStyle={{
          height: 88,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          paddingTop: 5,
          marginHorizontal: -12,
          justifyContent: "center",
          backgroundColor: "#FFFFFFFF",
        }}
      />
    );
  };

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
            justifyContent: "space-between",
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
                backgroundColor: !seleted ? "#A0A4A8" : "#fff",
              }}
            />
            <Text
              style={{
                fontSize: 14,
                marginLeft: 16,
                lineHeight: 24,
                fontWeight: "bold",
                letterSpacing: 0.1,
                
              }}
            >
              {status}
            </Text>
          </View>
          {count != 0 ? (
            <View
              style={{
                width: 36,
                height: 24,
                borderRadius: 36 / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#64B161",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                4
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const itemListChannel = (
    status,
    imgActive,
    imgInActive,
    selectedChannel,
    onSelectChannel
  ) => {
    return (
      <View style={{ paddingRight: 14, alignSelf: "center" }}>
        <TouchableOpacity onPress={() => onSelectChannel(status)}>
          {selectedChannel ? imgInActive : imgActive}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {headerWithSearch()}
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{ height: 80, width: 80 }}
            resizeMode="contain"
            source={LoadingBig}
            autoPlay
          />
        </View>
      ) : (
        <View style={[styles.container4, { backgroundColor: "#E5E5E5" }]}>
          <FlatList
            data={dataChatRooms}
            horizontal={false}
            refreshing={isFetching}
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
      )}
      <RBSheet
        duration={400}
        ref={refRBSheetFilter}
        closeOnPressMask={true}
        closeOnPressBack={true}
        height={dimenHeight / 1.6}
        customStyles={{
          container: {
            backgroundColor: "transparent",
          },
        }}
      >
        <View style={styles.BSView}>
          <View
            style={{
              marginBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#2E3034",
                fontWeight: "bold",
                
              }}
            >
              Filter
            </Text>
            <TouchableOpacity onPress={() => touchReset()}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#5588C3",
                  
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
              fontWeight: "500",
              
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
              
              textTransform: "uppercase",
            }}
          >
            Conversation
          </Text>
          <View>
            <FlatList
              data={
                dataUser.role.name != "Staff"
                  ? dataConversationAll
                  : dataConversationStaff
              }
              renderItem={({ item }) =>
                itemListConversation(
                  item.id,
                  item.status,
                  item.count,
                  !selected.get(item.id),
                  onSelect
                )
              }
              keyExtractor={(item) => item.id}
              extraData={selected}
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
              
              textTransform: "uppercase",
            }}
          >
            Channels
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              justifyContent: "space-between",
              alignItems: "center",
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
                  !selectedChannel.get(item.status),
                  onSelectChannel
                )
              }
              keyExtractor={(item) => item.id}
              extraData={selected}
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
              width: dimenWidth / 1.18,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
              Contact Adminstrator
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    paddingVertical: 10,
    flexDirection: "row",
  },
  containerChat: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
    // paddingVertical: 10,
  },
  containContainer: {
    width: "6%",
    justifyContent: "center",
  },
  containContainerSub: {
    width: 18,
    height: 18,
  },
  containContainer2: {
    width: "20%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  containContainer2Sub1: {
    width: "100%",
    height: "100%",
    borderRadius: 1000,
    resizeMode: "contain",
  },
  containContainer3: {
    width: "48%",
    flexDirection: "column",
  },
  containContainer3Sub: {
    fontSize: 14,
    paddingBottom: 7,
    fontWeight: "bold",
  },
  containContainer4: {
    width: "22%",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  containContainer4Sub: {
    color: "#000",
    fontSize: 12,
    paddingBottom: 7,
  },
  containContainer4Sub1: {
    borderRadius: 25,
    paddingBottom: 2,
    paddingHorizontal: 8,
  },
  container3: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#a3a5a8",
  },
  container4: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containInput: {
    paddingHorizontal: 20,
    backgroundColor: "rgba(228, 228, 231, 0.4)",
    borderRadius: Dimensions.get("screen").width / 2,
  },
  containListEmpty: {
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height / 1.33,
  },
  txt1ListEmpty: {
    fontSize: 22,
    lineHeight: 24,
    color: "#A5A5A5",
    fontWeight: "500",
    letterSpacing: 0.1,
    
    textTransform: "capitalize",
  },
  txt2ListEmpty: {
    fontSize: 14,
    lineHeight: 24,
    color: "#A5A5A5",
    fontWeight: "300",
    letterSpacing: 0.1,
    
    textTransform: "capitalize",
  },
  txtCreateByName: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "bold",
    
    textTransform: "capitalize",
  },
  txtMessagesContent: {
    fontSize: 12,
    
  },
  txtChatRightDate: {
    fontSize: 12,
    alignSelf: "flex-end",
    
  },
  listChatRightDate: {
    marginTop: 8,
    alignItems: "flex-start",
  },
  txtChatRightStatus: {
    fontSize: 10,
    color: "#fff",
    overflow: "hidden",
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    
    borderRadius: Platform.OS == "android" ? 16 : 7,
  },
  BSView: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    width: Dimensions.get("screen").width,
  },
});

export default Chats;
