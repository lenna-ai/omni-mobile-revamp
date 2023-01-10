import * as React from "react";

import {
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import VideoPlayer from "react-native-video-player";

//Internal Import
import API from "./../../utils/api";
import { postDataOutHeader } from "./../../modules/services";
import {
  getRoomId,
  addDataChats,
  moreDataChats,
  reloadDataChats,
  pushDataLoading
} from "../../modules/redux/actions/inChat";

import {
  addDataForAssignRoomId,
  addDataForAssignLivechat,
  addDataForAssignAgentInfo
} from "../../modules/redux/actions/member/inForAssign";

//External Import
import moment from "moment";
import HTML from "react-native-render-html";
import { Icon } from "react-native-elements";
import { SvgCssUri } from "react-native-svg";
import Voice from "@react-native-community/voice";
import EmojiBoard from "react-native-emoji-board";
import ImageView from "react-native-image-viewing";
import RBSheet from "react-native-raw-bottom-sheet";
import { Header, Avatar } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

//Component Chat Import
import { encodeHashIds, decodeHashIds } from "./../../utils/encode";
import { chatCarousel } from "./../components/chatRoom/chatCarousel";
import { chatText } from "../components/chatRoom/chatText";
import { getValue } from "./../../modules/localData";

//Assets Import
import IconPin from "./../../assets/image/icon_pin.svg";
import IconBack from "./../../assets/image/icon_back.svg";
import IconSmile from "./../../assets/image/icon_smile.svg";
import IconResolved from "./../../assets/image/icon_resolved.svg";
import IconAssignTo from "./../../assets/image/icon_assign_to.svg";
import IconAttachment from "./../../assets/image/icon_attachment.svg";
import IconMicAactive from "./../../assets/image/icon_mic_active.svg";
import IconPaperPlane from "./../../assets/image/icon_paper_plane.svg";
import IconBotDefault from "./../../assets/image/icon_bot_default.svg";
import IconMicInactive from "./../../assets/image/icon_mic_inactive.svg";
import IconMoreVertical from "./../../assets/image/icon_more_vertical.svg";
import IconAdminDefault from "./../../assets/image/icon_admin_default.svg";
import IconFemaleAgentDefault from "./../../assets/image/icon_female_agent_default.svg";
import IllustrationNoActiveChat from "./../../assets/image/illustration_no_active_chat.svg";
// import { AlertToastSuccess, AlertToastFailed } from "../other/AlertToast";

import EmptyComponent from "../other/EmptyComponent";
import LoadingBig from "./../../assets/anime/loading_big.gif";
import LoadingSmall from "./../../assets/anime/loading_small.gif";
import { IconX } from "../../assets/icons";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const iconImageLenna = API.BASE_URL + "app/public/dist/img/admin.d9d29969.svg";
const iconImageAgent = API.BASE_URL + "app/public/dist/img/female.2b253f48.svg";
const iconImageBot = API.BASE_URL + "app/public/dist/img/bot.2b2793b0.svg";

const ChatRoom = ({ route, navigation }) => {
  const { id } = route.params;
  const { statusAction } = route.params;

  const dispatch = useDispatch();
  const disChat = useSelector(state => state.mDataChats);
  let dataChats = disChat.data;

  let disRooms = useSelector(state => state.mDataRoomsChat);
  let dataRooms = disRooms.dataRoomsChat;

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const [show, setShow] = React.useState(false);
  const [chatSend, setChatSend] = React.useState("");
  const [notedSend, setNotedSend] = React.useState("");
  const [firstMsg, setFirstMsg] = React.useState(0);

  const [isLoading, setIsLoading] = React.useState(false);
  const [dataItem, setDataItem] = React.useState(undefined);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [isLoadingBSheet, setIsLoadingBSheet] = React.useState(false);
  const [isLoadingAction, setIsLoadingAction] = React.useState(false);

  const [isFocus, setIsFocus] = React.useState(true);

  const [showKeyword, setShowKeyword] = React.useState(false);

  const [isDone, setIsDone] = React.useState(false);

  const toastFailed = React.useRef();
  const toastSuccess = React.useRef();
  const refDataChats = React.useRef();
  const refTextInput = React.useRef();
  const refRBSheetMore = React.useRef();
  const refRBSheetEndNotes = React.useRef();

  const [micISActive, setMicISActive] = React.useState(false);

  const requestToServer1 = async () => {
    setIsDone(false);
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };
    let params = {
      roomId: id,
      firstMessageId: dataItem.messages[0].id
    };
    let res = await postDataOutHeader(
      API.PATH + encodeHashIds(dataUser.app_id) + "/message/get-more-message",
      params,
      headers
    );
    if (res.data.messages != 0) {
      const messageFirst = [
        ...dataItem.messages,
        ...res.data.messages.reverse()
      ];
      // setDataChats(messageFirst);
      dispatch(addDataChats(messageFirst));
      setFirstMsg(res.data.messages[res.data.messages.length - 1].id);
    }
    setIsLoading(false);
  };

  const requestToServerAll = async () => {
    let vFirstMessageId = 0;
    if (!isDone) {
      vFirstMessageId = firstMsg;
      let headers = {
        token: dataUser.token,
        userId: encodeHashIds(dataUser.user_id)
      };
      let params = {
        roomId: id,
        firstMessageId: vFirstMessageId
      };
      let res = await postDataOutHeader(
        API.PATH + encodeHashIds(dataUser.app_id) + "/message/get-more-message",
        params,
        headers
      );
      if (res.data.messages.length != 0) {
        dispatch(moreDataChats(res.data.messages.reverse()));
        setFirstMsg(res.data.messages[res.data.messages.length - 1].id);
      } else {
        setIsDone(true);
      }
    }
    setIsLoadingMore(false);
  };

  const dataLoadMore = React.useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    requestToServerAll();
  });

  React.useEffect(
    () => {
      if (!isFocus) {
        dispatch(getRoomId(id));
        requestToServer1();
      }
    },
    [isFocus]
  );

  React.useEffect(() => {
    setIsLoading(true);
    dataRooms.find(entry => {
      if (entry.id == id) {
        setDataItem(entry);
        setIsFocus(false);
      }
    });

    function onSpeechStart(e) {}

    function onSpeechRecognized(e) {}

    function onSpeechError(e) {}

    function onSpeechEnd(e) {
      setMicISActive(false);
    }

    function onSpeechResults(e) {
      console.log("e.value[0]", e.value[0]);

      setChatSend(e.value[0]);
      setTimeout(() => {
        onSendChat(e.value[0], "text");
        Voice.stop();
      }, 1000);
    }

    function onSpeechPartialResults(e) {}

    function onSpeechVolumeChanged(e) {}

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setShowKeyword(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setShowKeyword(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const _startRecognizing = () => {
    Voice.start("id-ID");
    setMicISActive(true);
  };

  const _stopRecognizing = () => {
    Voice.cancel();
    setMicISActive(false);
  };

  const renderHeader = () => {
    if (isLoadingMore) {
      return (
        <View
          style={{
            paddingVertical: 8
          }}
        >
          <ActivityIndicator color="#049FFF" size="large" />
        </View>
      );
    } else {
      return null;
    }
  };

  const changeTextMsg = msg => {
    setChatSend(msg);
  };

  const changeTextNoted = msg => {
    setNotedSend(msg);
  };

  const onClick = emoji => {
    console.log(emoji);
    setChatSend(chatSend + emoji.code);
  };

  const listEmptyComponent = () => {
    return <EmptyComponent />;
  };

  const HeaderComponent = () => {
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
                  <IconBack />
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
                  <View style={{ flexDirection: "row", width: dimenWidth / 2 }}>
                    {isFocus
                      ? <ShimmerPlaceHolder
                          width={52}
                          height={52}
                          autoRun={true}
                          style={{ borderRadius: 52 / 2 }}
                        />
                      : <Image
                          source={{ uri: dataItem.created_by.picture }}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 52 / 2
                          }}
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
                        Cape Town, RSA
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
                  <TouchableOpacity
                    onPress={() => refRBSheetMore.current.open()}
                  >
                    <IconMoreVertical width={24} height={24} />
                  </TouchableOpacity>
                </View>
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
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          paddingTop: 5,
          marginHorizontal: -12,
          justifyContent: "center",
          backgroundColor: "#FFFFFFFF"
        }}
      />
    );
  };

  const goToAssign = () => {
    dispatch(addDataForAssignRoomId(dataItem.id));
    dispatch(addDataForAssignAgentInfo(dataItem.agent_info));
    dispatch(addDataForAssignLivechat(dataItem.livechat));
    refRBSheetMore.current.close();
    navigation.navigate("AssignToTeam");
  };

  const containMsgType = item => {
    switch (item.type) {
      case "text":
        return containMsgTypeTxt(item);
      case "carousel":
        return containMsgTypeCarousel(item);
      case "image":
        return containMsgTypeImage(item);
      case "video":
        return containMsgTypeVideo(item);
      case "html":
        return containMsgTypeHTML(item);
      case "template":
        return containMsgTypeTemplate(item);
      case "loadingMsg":
        return containMsgTypeLoadingMsg();
      default:
        break;
    }
  };

  // Start - Message Type Chat
  const containMsgTypeLoadingMsg = () => {
    return (
      <Image
        style={{ height: 32, width: 24 }}
        resizeMode="contain"
        source={LoadingSmall}
        autoPlay
      />
    );
  };

  const containMsgTypeTxt = item => {
    return (
      <Text
        style={{
          maxWidth: dimenWidth - 128,
          fontSize: 14
        }}
      >
        {item.text}
      </Text>
    );
  };

  const itemContainMsgTypeCarousel = (item, index) => {
    return (
      <View
        style={{
          marginTop: 3,
          marginBottom: 3,
          borderRadius: 10,
          borderWidth: 0.7,
          marginHorizontal: 5,
          borderColor: "#c7c5c5",
          width: (dimenWidth - 128) / 1.7
        }}
      >
        <View
          style={{
            height: 120,
            overflow: "hidden",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}
        >
          <Image
            style={{
              flex: 1,
              height: 120,
              width: undefined,
              resizeMode: "stretch"
            }}
            source={{ uri: item.thumbnailImageUrl }}
          />
        </View>

        <Text
          key={index}
          style={{
            margin: 10,
            fontWeight: "bold"
          }}
        >
          {item.title.split("<br>")}
        </Text>

        <Text
          key={index + 1}
          style={{
            maxWidth: 250,
            margin: 10
          }}
        >
          {item.text.split("<br>")}
        </Text>

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {item.actions.map((dataActions, index) => {
            return (
              <TouchableOpacity
                // onPress={() => this.actionCarousel(dataActions)}
                transparent
                style={{ height: 30, marginBottom: 5 }}
              >
                <Text
                  key={index.toString()}
                  style={{
                    color: "#0087d4",
                    fontWeight: "bold",
                    justifyContent: "center",
                    textAlign: "center",
                    magin: 5
                  }}
                >
                  {dataActions.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const containMsgTypeCarousel = item => {
    return (
      <FlatList
        horizontal={true}
        data={item.columns}
        style={{ width: dimenWidth - 128 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) =>
          itemContainMsgTypeCarousel(item, index)}
      />
    );
  };

  const containMsgTypeImage = item => {
    return (
      // <View
      // style={{
      //     width: dimenWidth-128,
      //     height: 300,
      //     resizeMode: 'stretch',
      // }}
      // >
      //     <ImageView
      //         images={{uri: item.originalContentUrl}}
      //         imageIndex={0}
      //         visible={visible}
      //         onRequestClose={() => setIsVisible(false)}
      //     />
      // </View>
      <Image
        style={{
          width: dimenWidth - 128,
          height: 300,
          borderRadius: 10,
          resizeMode: "stretch"
        }}
        source={{ uri: item.originalContentUrl }}
      />
    );
  };

  const containMsgTypeVideo = item => {
    return (
      // <Video
      //     source={{uri: item.originalContentUrl}}
      //     ref={refDataChats}
      //     resizeMode="contain"
      //     paused={true}
      //     // onBuffer={onBuffer}
      //     // onError={this.videoError}
      //     controls={true}
      //     style={styles.backgroundVideo}
      // />
      <VideoPlayer
        video={{ uri: item.originalContentUrl }}
        videoWidth={dimenWidth - 128}
        videoHeight={300}
        thumbnail={{ uri: "https://i.picsum.photos/id/866/1600/900.jpg" }}
      />

      // <VideoPlayer
      //     source={{ uri: item.originalContentUrl }}
      //     style={styles.backgroundVideo}
      //     onShowControls={true}
      //     disableBack={true}
      //     disableVolume={true}
      //     disableFullscreen={true}
      //     showOnStart={true}
      //     onPlay={false}
      // />
    );
  };

  const containMsgTypeHTML = item => {
    return (
      <View style={{ maxWidth: dimenWidth - 128 }}>
        <HTML html={item.content} imagesMaxWidth={dimenWidth - 128} />
      </View>
    );
  };

  const containMsgTypeTemplate = item => {
    return (
      <View style={{ maxWidth: dimenWidth - 128 }}>
        <HTML html={item.template} imagesMaxWidth={dimenWidth - 128} />
      </View>
    );
  };
  //End - Message Type Chat

  const leftBlueBubleChat = (item, date, value, valueText, valueFirst) => {
    let valueTopLeft = 0;
    let valueBottomLeft = 0;

    if (valueFirst == 1) {
      valueTopLeft = 16;
    } else {
      if (value == 1) {
        if (value == 0 || valueText == 0) {
          valueBottomLeft = 16;
        }
      }

      if (valueText == 1 || (valueFirst == 1 && valueText == 0)) {
        valueTopLeft = 16;
      }
    }

    return (
      <View
        style={{
          elevation: 10,
          shadowRadius: 4,
          shadowOpacity: 0.8,
          paddingVertical: 8,
          shadowColor: "#000",
          paddingHorizontal: 10,
          backgroundColor: "#E1F2FF",
          borderRadius: 16,
          borderBottomLeftRadius: valueBottomLeft,
          borderTopLeftRadius: valueTopLeft,
          shadowOffset: { width: 0, height: 1 },
          marginVertical: value == 0 && valueText == 0 ? 4 : 0
        }}
      >
        {containMsgType(item)}
        <Text
          style={{
            fontSize: 10,
            marginTop: 4,
            alignSelf: "flex-end"
          }}
        >
          {date}
        </Text>
      </View>
    );
  };

  const rightWhiteBubleChat = (item, date, value, valueText, valueFirst) => {
    let valueTopRight = 0;
    let valueBottomRight = 0;

    if (valueFirst == 1) {
      valueTopRight = 16;
    } else {
      if (value == 1) {
        if (value == 0 || valueText == 0) {
          valueBottomRight = 16;
        }
      }

      if (valueText == 1 || (valueFirst == 1 && valueText == 0)) {
        valueTopRight = 16;
      }
    }

    return (
      <View
        style={{
          elevation: 10,
          shadowRadius: 4,
          shadowOpacity: 0.8,
          paddingVertical: 8,
          shadowColor: "#000",
          paddingHorizontal: 10,
          borderRadius: 16,
          borderBottomRightRadius: valueBottomRight,
          borderTopRightRadius: valueTopRight,
          backgroundColor: "#FFFFFF",
          shadowOffset: { width: 0, height: 1 },
          marginVertical: value == 0 && valueText == 0 ? 7 : 4
        }}
      >
        {containMsgType(item)}
        {item.type != "loadingMsg"
          ? <Text
              style={{
                fontSize: 10,
                marginTop: 4
              }}
            >
              {date}
            </Text>
          : null}
      </View>
    );
  };

  const LeftBubleChat = (item, value, valueText, valueFirst) => {
    let dateUpdate = moment(item.updated_at).format("LT");
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          width: dimenWidth - 54
        }}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Image
            style={{
              width: 34,
              height: 34,
              marginTop: 3,
              borderRadius: 34 / 2,
              opacity: value
            }}
            source={{ uri: item.messageable.picture }}
          />
        </View>
        <FlatList
          horizontal={false}
          data={item.content}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            leftBlueBubleChat(item, dateUpdate, value, valueText, valueFirst)}
        />
      </View>
    );
  };

  const RightBubleChat = (item, value, valueText, valueFirst) => {
    let dateUpdate = moment(item.updated_at).format("LT");
    let image = iconImageBot;

    if (item.messageable_type != "bot") {
      if (item.messageable_type == "user_platform") {
        if (dataUser.user_id == item.messageable.id) {
          image = iconImageLenna;
        } else {
          image = iconImageAgent;
        }
      }
    }

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          width: dimenWidth - 54
        }}
      >
        <FlatList
          horizontal={false}
          data={item.content}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            rightWhiteBubleChat(item, dateUpdate, value, valueText, valueFirst)}
        />
        <View style={{ paddingHorizontal: 10 }}>
          {item.messageable_type != "bot" &&
          item.messageable_type == "user_platform"
            ? dataUser.user_id == item.messageable.id
              ? <IconAdminDefault
                  style={{
                    marginTop: 3,
                    opacity: value,
                    borderRadius: 34 / 2
                  }}
                  width={34}
                  height={34}
                />
              : <IconFemaleAgentDefault
                  style={{
                    marginTop: 3,
                    opacity: value,
                    borderRadius: 34 / 2
                  }}
                  width={34}
                  height={34}
                />
            : <IconBotDefault
                style={{
                  marginTop: 3,
                  opacity: value,
                  borderRadius: 34 / 2
                }}
                width={34}
                height={34}
              />}
        </View>
      </View>
    );
  };

  const renderDataMsg = ({ item, index }) => {
    let valueOpacity = 1;
    let textOpacity = 0;
    let valueFirst = 0;

    if (dataChats[index - 1] != undefined) {
      if (dataChats[index - 1].messageable_id == item.messageable_id) {
        valueOpacity = 0;
      }
    }

    if (dataChats[index + 1] != undefined) {
      if (dataChats[index + 1].messageable_id != item.messageable_id) {
        textOpacity = 1;
      }
    }

    if (dataChats.length - 1 == index) {
      valueFirst = 1;
    }

    if (item.messageable_type == "user") {
      return (
        <View
          style={{
            marginTop: valueFirst == 1 ? 18 : 0,
            marginBottom: valueOpacity == 1 ? 18 : 0,
            alignSelf: "flex-start"
          }}
        >
          {LeftBubleChat(item, valueOpacity, textOpacity, valueFirst)}
        </View>
      );
    } else {
      return (
        <View
          style={{
            marginTop: valueFirst == 1 ? 18 : 0,
            marginBottom: valueOpacity == 1 ? 18 : 0,
            alignSelf: "flex-end"
          }}
        >
          {textOpacity == 1 || (valueFirst == 1 && textOpacity == 0)
            ? <Text
                style={{
                  alignSelf: "flex-end",
                  marginRight: 54,
                  fontSize: 12
                }}
              >
                {item.content[0].type != "loadingMsg"
                  ? item.messageable.name
                  : null}
              </Text>
            : null}
          {RightBubleChat(item, valueOpacity, textOpacity, valueFirst)}
        </View>
      );
    }
  };

  const pressEmot = () => {
    setShowKeyword(false);
    setShow(!show);
  };

  const setParamsChat = (msg, type) => {
    let date = Date.now();
    // let dateMilliseconds = moment(new Date(date)).format("x");
    let dateMilliseconds = moment(date, "x");
    let dataSenderId = dataUser.user_id;
    let dataRoomId = id;

    let dataMessage = [];
    let dataSpeech = msg;
    let dataText = msg;
    let dataType = type;

    let objMessage = {
      speech: dataSpeech,
      text: dataText,
      type: dataType
    };

    dataMessage.push(objMessage);

    let params = {
      roomId: dataRoomId,
      senderId: dataSenderId,
      temporaryId: dateMilliseconds,
      message: dataMessage
    };

    return params;
  };

  const onSendChat = (msg, type) => {
    if (msg.trim() != "") {
      let dataArray = [unshiftDataChatLoading()];
      setChatSend("");
      refTextInput.current.blur();
      dispatch(pushDataLoading(dataArray));
      sendCharts(msg, type);
    }
  };

  const unshiftDataChatLoading = () => {
    let data = {
      id: 0,
      channel_data: null,
      room_id: id,
      messageable_type: "user_platform",
      messageable_id: dataUser.user_id,
      content: [
        {
          type: "loadingMsg",
          text: "test",
          speech: "test"
        }
      ],
      data: null,
      deleted_at: null,
      created_at: "2020-07-23 14:23:48",
      updated_at: "2020-07-23 14:23:48",
      messageable: {
        id: dataUser.user_id,
        name: "user_sender"
      }
    };
    return data;
  };

  const sendCharts = async (msg, type) => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };
    let res = await postDataOutHeader(
      API.PATH + encodeHashIds(dataUser.app_id) + "/chat/send-message",
      setParamsChat(msg, type),
      headers
    );
  };

  const onResolved = async txt => {
    setIsLoadingBSheet(true);
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };
    let params = {
      agentId: dataUser.user_id,
      userId: dataItem.created_by.id,
      liveChatId: dataItem.livechat.id,
      description: txt
    };

    let res = await postDataOutHeader(
      API.PATH + encodeHashIds(dataUser.app_id) + "/livechat/resolve",
      params,
      headers
    );

    try {
      if (res.success) {
        setIsLoadingBSheet(false);
        refRBSheetEndNotes.current.close();
        toastSuccess.current.show(res.message, 1000);
      } else {
        setIsLoadingBSheet(false);
        refRBSheetEndNotes.current.close();
        toastFailed.current.show(res.message, 1000);
      }
    } catch (error) {
      setIsLoadingBSheet(false);
      refRBSheetEndNotes.current.close();
      let msg = "Terjadi kendala teknis, Harap coba kembali!";
      toastFailed.current.show(msg, 1000);
    }
  };

  const onChannel = async () => {
    setIsLoadingAction(true);
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };
    let params = {
      userId: dataItem.created_by.id
    };

    let res = await postDataOutHeader(
      API.PATH + encodeHashIds(dataUser.app_id) + "/livechat/request",
      params,
      headers
    );

    try {
      console.log("DATA_RES_CHANNEL", res);
      if (res.success) {
        setIsLoadingAction(false);
        toastSuccess.current.show(res.message, 1000);
      } else {
        setIsLoadingAction(false);
        toastFailed.current.show(res.message, 1000);
      }
    } catch (error) {
      setIsLoadingAction(false);
      let msg = "Terjadi kendala teknis, Harap coba kembali!";
      toastFailed.current.show(msg, 1000);
    }
  };

  const resolvedRooms = () => {
    refRBSheetMore.current.close();
    setTimeout(() => {
      refRBSheetEndNotes.current.open();
    }, 1000);
  };

  const handleRooms = () => {
    refRBSheetMore.current.close();
    onChannel();
  };

  const actionsHandSolv = () => {
    if (statusAction == "Resolved" || statusAction == "Unserved") {
      return null;
    } else {
      return (
        <TouchableOpacity
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
              <IconResolved width={36} height={31} />
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
        </TouchableOpacity>
      );
    }
  };

  const cancelNoted = () => {
    setNotedSend("");
    refRBSheetEndNotes.current.close();
  };

  return (
    <View style={[styles.container, { backgroundColor: "#FAFAFA" }]}>
      <HeaderComponent />
      <View style={styles.container}>
        {isLoading || isLoadingAction
          ? <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                style={{ height: 80, width: 80 }}
                resizeMode="contain"
                source={LoadingBig}
                autoPlay
              />
            </View>
          : <View style={styles.container}>
              {dataChats != undefined || dataChats.length != 0
                ? <FlatList
                    inverted
                    data={dataChats}
                    horizontal={false}
                    ref={refDataChats}
                    renderItem={renderDataMsg}
                    onEndReachedThreshold={1}
                    onEndReached={() => dataLoadMore()}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={() => renderHeader()}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{
                      flexGrow: 1,
                      justifyContent: "flex-end"
                    }}
                  />
                : listEmptyComponent()}
            </View>}

        <View
          style={{
            backgroundColor: "#F2F2F2",
            borderColor: "#EBEBEB",
            borderWidth: 1,
            width: dimenWidth - 40,
            marginHorizontal: 20,
            marginVertical: 18,
            maxHeight: 87,
            borderRadius: 10,
            alignSelf: "flex-end",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingHorizontal: 10,
            alignItems: "flex-end"
          }}
        >
          <View
            style={{
              width: "20%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginBottom: 12
            }}
          >
            <TouchableOpacity>
              <IconSmile width={24} height={24} onPress={() => pressEmot()} />
            </TouchableOpacity>
            <TouchableOpacity>
              <IconAttachment width={24} height={24} />
            </TouchableOpacity>
          </View>
          <TextInput
            ref={refTextInput}
            multiline={true}
            value={chatSend}
            style={styles.inputs}
            autoCapitalize="none"
            keyboardType="default"
            placeholder="Type a message"
            onFocus={() => setShow(false)}
            placeholderStyle={{ color: "#2E3034" }}
            onChangeText={chatSend => changeTextMsg(chatSend)}
          />
          <View
            style={{
              width: "23%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginBottom: 9
            }}
          >
            {micISActive
              ? <TouchableOpacity
                  onPress={() => _stopRecognizing()}
                  style={{
                    elevation: 3,
                    shadowRadius: 4,
                    shadowOpacity: 0.8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 }
                  }}
                >
                  <IconMicAactive width={32} height={32} />
                </TouchableOpacity>
              : <TouchableOpacity
                  onPress={() => _startRecognizing()}
                  style={{
                    elevation: 3,
                    shadowRadius: 4,
                    shadowOpacity: 0.8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 }
                  }}
                >
                  <IconMicInactive width={32} height={32} color={"#5588C3"} />
                </TouchableOpacity>}
            <TouchableOpacity onPress={() => onSendChat(chatSend, "text")}>
              <IconPaperPlane width={28} height={28} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {!showKeyword
        ? <EmojiBoard
            containerStyle={{ position: show ? "relative" : "absolute" }}
            labelStyle={{
              fontSize: 15,

              color: "#5588C3"
            }}
            tabBarStyle={{ backgroundColor: "#fff" }}
            numRows={10}
            emojiSize={20}
            categoryIconSize={15}
            showBoard={show}
            onClick={onClick}
          />
        : null}
      {/* <AlertToastSuccess toastSuccess={toastSuccess} />
      <AlertToastFailed toastFailed={toastFailed} /> */}
      <RBSheet
        duration={400}
        ref={refRBSheetEndNotes}
        closeOnPressMask={() => cancelNoted()}
        closeOnPressBack={() => cancelNoted()}
        height={dimenHeight / 2}
        customStyles={{
          container: {
            backgroundColor: "transparent"
          }
        }}
      >
        <View style={[styles.BSView, { alignItems: "center", paddingTop: 20 }]}>
          <View
            style={{
              alignItems: "flex-end",
              width: Dimensions.get("screen").width
            }}
          >
            <TouchableOpacity
              onPress={() => cancelNoted()}
              style={{
                marginRight: 14
              }}
            >
              <IconX height={22} width={22} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                marginTop: 10,
                marginBottom: 6,
                color: "#2E3034",
                fontWeight: "bold",
                alignSelf: "center"
              }}
            >
              Mark as resolved
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 20,
                color: "#2E3034",
                fontWeight: "800",
                alignSelf: "center"
              }}
            >
              End Notes
            </Text>
          </View>
          <TextInput
            multiline={true}
            value={notedSend}
            keyboardType="default"
            style={styles.inputEndNoted}
            onChangeText={notedSend => changeTextNoted(notedSend)}
          />
          <View
            style={{
              marginTop: 20,
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              onPress={() => onResolved()}
              style={{
                backgroundColor: "#003473",
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 10,
                marginRight: 20
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#fff",
                  fontWeight: "800",
                  alignSelf: "center"
                }}
              >
                Resolve Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => cancelNoted()}
              style={{
                backgroundColor: "#fff",
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#003473"
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#003473",
                  fontWeight: "800",
                  alignSelf: "center"
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

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
          {actionsHandSolv()}
          <TouchableOpacity style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 37,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <IconPin width={24} height={24} />
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
                <IconAssignTo width={24} height={24} />
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
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imgIconChat: {
    width: "8%",
    height: 25,
    resizeMode: "contain"
  },
  inputEndNoted: {
    borderWidth: 1,
    paddingVertical: 14,
    width: dimenWidth - 60,
    paddingHorizontal: 18,
    borderColor: "#969696",
    textAlignVertical: "top",
    minHeight: dimenHeight / 5,
    backgroundColor: "#f5f5f5"
  },
  inputs: {
    width: "54%",
    backgroundColor: "#00000000"
  },
  containerChat: {
    width: "75%",
    paddingVertical: 8,
    flexDirection: "row"
  },
  containerChatRight: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "transparent"
  },
  containerChatLeft: {
    marginBottom: 4,
    alignItems: "flex-end",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "transparent"
  },
  containerChatSub: {
    elevation: 3,
    shadowRadius: 4,
    shadowOpacity: 0.8,
    shadowColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 }
  },
  containerChatSubLeft: {
    backgroundColor: "#E1F2FF",
    borderBottomRightRadius: 16
  },
  containerChatSubRight: {
    borderBottomLeftRadius: 16,
    backgroundColor: "#FFF"
  },
  BSView: {
    flex: 1,
    paddingTop: 36,
    paddingHorizontal: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
    width: Dimensions.get("screen").width
  },
  containListEmpty: {
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "center",
    width: Dimensions.get("screen").width - 20,
    height: 250,
    paddingVertical: (Dimensions.get("screen").height - 250) / 2
  },
  txt1ListEmpty: {
    fontSize: 22,
    lineHeight: 24,
    color: "#A5A5A5",
    fontWeight: "500",
    letterSpacing: 0.1,

    textTransform: "capitalize"
  },
  txt2ListEmpty: {
    fontSize: 14,
    lineHeight: 24,
    color: "#A5A5A5",
    fontWeight: "300",
    letterSpacing: 0.1,

    textTransform: "capitalize"
  },
  backgroundVideo: {
    height: 300,
    borderRadius: 10,
    width: dimenWidth - 128,
    backgroundColor: "#000"
    // width: dimenWidth-144,
  }
});

export default ChatRoom;
