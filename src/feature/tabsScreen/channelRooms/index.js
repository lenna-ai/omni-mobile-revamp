import * as React from "react";
import LoadingBig from "./../../../assets/anime/loading_big.gif";
import IconBackWhite from "./../../../assets/image/icon-back-white.svg";
import API from "./../../../utils/api";
import FilterBottomSheet from "./components/FilterBottomSheet";
import HeaderChannel from "./components/HeaderChannel";
import ListChannel from "./components/ListChannel";

import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAdditinfoCustomprof,
  changeConvernotedCustomprof,
  changeEmailCustomprof,
  changeIdConvernotedCustomprof,
  changeIdCustomprof,
  changePhoneCustomprof,
  changeTagsCustomprof,
  clearAllCustomprof
} from "../../../modules/redux/actions/customerProfile/inCustomerProfile";
import { reloadDataChats } from "../../../modules/redux/actions/inChat";
import { onActiveNav } from "../../../modules/redux/actions/inNavigation";
import {
  addRoomsChat,
  moreRoomsChat,
  reloadRoomsChat,
  setTextSearchRoomsChat
} from "../../../modules/redux/actions/roomChats/inRoomChats";
import {
  setChannelFilter,
  setConversationFilter,
  setResetFilter
} from "../../../modules/redux/actions/roomChats/inSelectForFilter";
import { getDataWithParams } from "../../../modules/services";
import { encodeHashIds } from "../../../utils/encode";
import { moderateScale } from "../../other/Scaling";

ChannelRooms = ({ navigation }) => {
  const dispatch = useDispatch();
  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;
  let disRooms = useSelector(state => state.mDataRoomsChat);
  let dataRooms = disRooms.dataRoomsChat;
  let textSearchSubmit = disRooms.textSearchRoomsChat;
  let disCustomprof = useSelector(state => state.mCustomerProfile);
  let dataIdCutomprof = disCustomprof.id;
  let disFilter = useSelector(state => state.mDataSelectForFilter);
  let dtChannelSeleted = disFilter.channelFilter;
  let dtConversationSeleted = disFilter.conversationFilter;
  const [isDone, setIsDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const refRBSheetFilter = React.useRef(null);

  const arrNull = new Map();

  React.useEffect(() => {
    touchReset();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      dispatch(reloadDataChats());
      dispatch(clearAllCustomprof());
      dispatch(onActiveNav("rooms"));
    });
    return unsubscribe;
  }, navigation);

  const statusParams = () => {
    let dataNum = 0;
    let dataParams = "";
    let data = [...dtConversationSeleted];

    if (data.length != undefined || data.length > 0) {
      data.map(dt => {
        if (dt[1] == true) {
          dataNum = dt[0];
        }
      });

      if (dataUser.role.name != "Staff") {
        switch (dataNum) {
          case 4:
            dataParams = "request";
            break;
          case 3:
            dataParams = "live";
            break;
          case 2:
            dataParams = "resolved";
            break;
          default:
            dataParams = "all";
            break;
        }
      } else {
        switch (dataNum) {
          case 2:
            dataParams = "resolved";
            break;
          default:
            dataParams = "live";
            break;
        }
      }
    }
    return dataParams;
  };

  const closeSearch = () => {
    if (textSearchSubmit != "") {
      setIsLoading(true);
      dispatch(setTextSearchRoomsChat(""));
      dispatch(reloadRoomsChat());
      requestToServer();
    }
  };

  const channelParams = () => {
    let dataArray = [];
    let data = [...dtChannelSeleted];
    if (data.length != undefined || data.length > 0) {
      data.map(dt => {
        if (dt[0] != "all") {
          if (dt[1] == true) {
            dataArray.push(dt[0]);
          }
        }
      });
    }
    return dataArray;
  };

  const onSubmitSearch = value => {
    if (value != "") {
      setIsLoading(true);
      dispatch(setTextSearchRoomsChat(value));
      dispatch(reloadRoomsChat());
      requestToServer(value);
    }
  };

  const touchReset = () => {
    dispatch(setResetFilter());
    refRBSheetFilter.current.close();
    setIsLoading(true);
    dispatch(reloadRoomsChat());
    resetFilter();
    requestToServer();
  };

  const touchResetNew = () => {
    dispatch(setResetFilter());
    refRBSheetFilter.current.close();
    setIsLoading(true);
    dispatch(reloadRoomsChat());
    setTimeout(() => {
      resetFilter();
      requestToServerReset();
    }, 2000);
  };

  const onFetching = () => {
    setIsLoading(true);
    dispatch(clearAllCustomprof());
    dispatch(reloadRoomsChat());
    requestToServer();
  };

  const requestToServerReset = async () => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    let params = {
      name: "",
      channel: "",
      status: dataUser.role.name == "Staff" ? "live" : "",
      lastRoom: ""
    };

    let res = await getDataWithParams(
      API.PATH + encodeHashIds(dataUser.app_id) + "/room/get-room-list-new",
      params,
      headers
    );

    if (res.data.length != 0) {
      if (res.data.length < 7) {
        setIsDone(true);
      } else {
        setIsDone(false);
      }
      dispatch(addRoomsChat(res.data));
    } else {
      setIsDone(true);
    }
    setIsLoading(false);
  };

  const requestToServer = async value1 => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    let params = {
      name: value1,
      channel: channelParams(),
      status: statusParams() == "all" ? "" : statusParams(),
      lastRoom: ""
    };

    let res = await getDataWithParams(
      API.PATH + encodeHashIds(dataUser.app_id) + "/room/get-room-list-new",
      params,
      headers
    );

    if (res.data.length != 0) {
      let dataRequestToServer = [];

      if (statusParams() != "all") {
        dataRequestToServer = res.data.filter(function(entry) {
          return entry.livechat.status === statusParams();
        });
      } else {
        dataRequestToServer = res.data;
      }
      if (res.data.length < 7) {
        setIsDone(true);
      } else {
        setIsDone(false);
      }
      dispatch(addRoomsChat(dataRequestToServer));
    } else {
      setIsDone(true);
    }
    setIsLoading(false);
  };

  const requestToServerMore = async value1 => {
    let mLastRoom = "";

    if (!isDone) {
      let headers = {
        token: dataUser.token,
        userId: encodeHashIds(dataUser.user_id)
      };

      mLastRoom = dataRooms[dataRooms.length - 1].updated_at;

      let params = {
        name: value1,
        channel: channelParams(),
        status: statusParams() == "all" ? "" : statusParams(),
        lastRoom: mLastRoom
      };

      try {
        let res = await getDataWithParams(
          API.PATH + encodeHashIds(dataUser.app_id) + "/room/get-room-list-new",
          params,
          headers
        );

        if (res.data.length != 0) {
          let dataRequestToServer = [];
          if (statusParams() != "all") {
            dataRequestToServer = res.data.filter(function(entry) {
              return entry.livechat.status === statusParams();
            });
          } else {
            dataRequestToServer = res.data;
          }
          if (res.data.length < 7) {
            setIsDone(true);
          } else {
            setIsDone(false);
          }
          dispatch(moreRoomsChat(dataRequestToServer));
        } else {
          setIsDone(true);
        }
      } catch (e) {
        setIsDone(true);
      }
    }
    setIsLoadingMore(false);
  };

  const dataLoadMore = React.useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    requestToServerMore();
  });

  const renderFooter = () => {
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

  const goToChat = (item, statusLive) => {
    if (dataIdCutomprof == 0 || dataIdCutomprof != item.id) {
      dataRooms.find(entry => {
        if (entry.id == item.id) {
          console.log("item.id", entry);
          dispatch(changeIdCustomprof(item.id));
          dispatch(changeEmailCustomprof(entry.created_by.email));
          dispatch(changeAdditinfoCustomprof(entry.additional_informations));
          if (entry.tags != null) {
            dispatch(changeTagsCustomprof(entry.tags));
          }
          if (entry.notes != null) {
            dispatch(changeIdConvernotedCustomprof(entry.notes.id));
            dispatch(changeConvernotedCustomprof(entry.notes.content));
          }
          if (entry.created_by.phone != null) {
            dispatch(changePhoneCustomprof(entry.created_by.phone));
          }
        }
      });
    }
    navigation.navigate("Chat", {
      id: item.id,
      firstMessage: item,
      statusAction: statusLive
    });
  };

  const resetFilter = () => {
    const newSelect = new Map();
    newSelect.set(1, true);
    dispatch(setConversationFilter(newSelect));

    const newSelected = new Map();
    newSelected.set("all", true);
    dispatch(setChannelFilter(newSelected));
  };

  const goBack = () => {
    navigation.goBack();
  };

  const onFilterAction = () => {
    refRBSheetFilter.current.close();
    setIsLoading(true);
    dispatch(reloadRoomsChat());
    setTimeout(() => {
      requestToServer(textSearchSubmit);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => goBack()} style={styles.iconBack}>
            <IconBackWhite />
          </TouchableOpacity>
          <Text style={styles.txtHeaderNav}>Chat Panel</Text>
        </View>
        <HeaderChannel
          goBack={goBack}
          closeSearch={closeSearch}
          onSubmitSearch={onSubmitSearch}
          onFilterAction={onFilterAction}
          refRBSheetFilter={refRBSheetFilter}
        />
        {isLoading
          ? <View style={styles.containerList}>
              <Image
                style={styles.iconLoading}
                resizeMode="contain"
                source={LoadingBig}
                autoPlay
              />
            </View>
          : <ListChannel
              goToChat={goToChat}
              isLoading={isLoading}
              onFetching={onFetching}
              dataLoadMore={dataLoadMore}
              renderFooter={renderFooter}
            />}
        <FilterBottomSheet
          refRBSheetFilter={refRBSheetFilter}
          onFilterAction={onFilterAction}
          touchReset={touchResetNew}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#405189",
    height: moderateScale(40),
    paddingHorizontal: moderateScale(18)
  },
  iconBack: {
    height: 10,
    width: 20,
    justifyContent: "center"
  },
  txtHeaderNav: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",

    textTransform: "uppercase"
  },
  containerList: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  container2: {
    paddingVertical: 10,
    flexDirection: "row"
  },
  container4: {
    flex: 1,
    backgroundColor: "#fff"
  },
  iconLoading: {
    height: 80,
    width: 80
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
  containContainer4Sub: {
    color: "#000",
    fontSize: 12,
    paddingBottom: 7
  },
  container3: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#a3a5a8"
  },
  txtCreateByName: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "bold",

    textTransform: "capitalize"
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

    borderRadius: Platform.OS == "android" ? 16 : 7
  }
});

export default React.memo(ChannelRooms);
