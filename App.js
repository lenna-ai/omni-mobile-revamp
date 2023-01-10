import * as React from "react";
import "react-native-gesture-handler";

import {
  Text,
  View,
  Platform,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

//Internal Import
import API from "./src/utils/api";
import echo from "./src/modules/socket";
import store from "./src/modules/redux/store";
import AppContainer from "./src/modules/navigation";

import { encodeHashIds } from "./src/utils/encode";
import { imageAssignFromAgent } from "./src/assets/icons";
import { postDataOutHeader } from "./src/modules/services";
import { moderateScale } from "./src/feature/other/Scaling";
import { getValue, removeValue } from "./src/modules/localData";
import { pushDataChats } from "./src/modules/redux/actions/inChat";
import {
  funIsSeletedChannel,
  funIsSeletedStatus,
} from "./src/utils/funReuseable";
import {
  pushRoomsChat,
  updateRoomsChat,
} from "./src/modules/redux/actions/roomChats/inRoomChats";
import {
  changeIsOpen,
  changeIsOnline,
} from "./src/modules/redux/actions/other/inBSNavigationPlus";
import {
  addDataUserWasLogin,
  resetDataUserWasLogin,
} from "./src/modules/redux/actions/inDataUserLogin";
import {
  onLogin,
  onOnBoard,
  onChooseChannel,
  onChooseActive,
} from "./src/modules/redux/actions/inNavigation";
import {
  funRequestHandel,
  funResolveMsgRoom,
  funAssignNewMsgRoom,
  funHandleNewMsgRoom,
  funUpdateNewMsgRoom,
  funUpdateNewMsgChat,
} from "./src/utils/funRedux";
import { Icon } from "react-native-elements";
import { Provider, useDispatch, useSelector } from "react-redux";
import RBSheet from "react-native-raw-bottom-sheet";

const App = () => {
  const toastFailed = React.useRef(null);
  const toastSuccess = React.useRef(null);
  const refSessionError = React.useRef(null);
  const refAssignFormAgent = React.useRef(null);
  return (
    <Provider store={store}>
      <AppWrapper
        toastFailed={toastFailed}
        toastSuccess={toastSuccess}
        refSessionError={refSessionError}
        refAssignFormAgent={refAssignFormAgent}
      />
    </Provider>
  );
};

const AppWrapper = ({
  toastFailed,
  toastSuccess,
  refSessionError,
  refAssignFormAgent,
}) => {
  const dispatch = useDispatch();

  const disUser = useSelector((state) => state.mDataUserLogin);
  let containUser = disUser.dataUserWasLogin;
  let sessionErr = disUser.sessionError;

  let disFilter = useSelector((state) => state.mDataSelectForFilter);
  let dtChannelSeleted = disFilter.channelFilter;
  let dtConversationSeleted = disFilter.conversationFilter;

  const disNavActive = useSelector((state) => state.mDataNavigation);
  let containNavActive = disNavActive.isOnActiveNav;

  const disRooms = useSelector((state) => state.mDataRoomsChat);
  let containRooms = disRooms.dataRoomsChat;
  let textSearchSubmit = disRooms.textSearchRoomsChat;

  const disChat = useSelector((state) => state.mDataChats);
  let dataChats = disChat.data;
  let dataRoomId = disChat.roomId;

  const [formAgent, setFormAgent] = React.useState("");
  const [resReqLive, setResReqLive] = React.useState(null);
  const [resIsOnline, setResIsOnline] = React.useState(null);
  const [resNewMessage, setResNewMessage] = React.useState(null);
  const [conversationName, setConversationName] = React.useState("");
  const [resRejectAssign, setResRejectAssign] = React.useState(null);
  const [resAssignMessage, setResAssignMessage] = React.useState(null);
  const [resRequestHandel, setResRequestHandel] = React.useState(null);
  const [timeAssignFromTeam, setTimeAssignFromTeam] = React.useState(0);
  const [isLoadingApprove, setIsLoadingApprove] = React.useState(false);
  const [resResolveMessage, setResResolveMessage] = React.useState(null);
  const [resAssignFromAgent, setResAssignFromAgent] = React.useState(null);

  const dimenWidth = Dimensions.get("screen").width;
  const dimenHeight = Dimensions.get("screen").height;

  const onDataOnBoard = async () => {
    try {
      let dataOnBoard = await getValue("IS_ON_BOARD");
      if (dataOnBoard !== null) {
        dispatch(onOnBoard(dataOnBoard));
      }
    } catch (e) {
      console.log("DATA_LOGIN_ERR", e.message);
    }
  };

  const onDataIsLogin = async () => {
    try {
      let dataIsLogin = await getValue("WAS_LOGIN");
      if (dataIsLogin !== null) {
        dispatch(onLogin(dataIsLogin));
      }
    } catch (e) {
      console.log("DATA_LOGIN_ERR", e.message);
    }
  };

  const onDataIsChoose = async () => {
    try {
      let dataIsChoose = await getValue("IS_CHOOSE_CHANNEL");
      if (dataIsChoose !== null) {
        dispatch(onChooseChannel(dataIsChoose));
      }
    } catch (e) {
      console.log("DATA_LOGIN_ERR", e.message);
    }
  };

  const onDataIsActive = async () => {
    try {
      let dataIsActive = await getValue("IS_CHOOSE_ACTIVE");
      if (dataIsActive !== null) {
        dispatch(onChooseActive(dataIsActive));
      }
    } catch (e) {
      console.log("DATA_LOGIN_ERR", e.message);
    }
  };

  const getDataUser = async () => {
    try {
      let dataUser = await getValue("DATA_LOGIN");
      // console.log("DATA_LOGIN", dataUser);
      if (dataUser != null || Object.keys(dataUser).length != 0) {
        dispatch(addDataUserWasLogin(dataUser));
      }
    } catch (e) {
      console.log("DATA_LOGIN_ERR", e.message);
    }
  };

  React.useEffect(() => {
    if (resIsOnline != null && Object.keys(containUser).length != 0) {
      dispatch(changeIsOnline(resIsOnline.current_status));
    }
  }, [resIsOnline]);

  React.useEffect(() => {
    if (sessionErr) {
      refSessionError.current.open();
    }
  }, [sessionErr]);

  React.useEffect(() => {
    if (resNewMessage != null && Object.keys(containUser).length != 0) {
      if (containUser.role != null) {
        let dataChatFilter = funUpdateNewMsgChat(
          dataChats,
          dataRoomId,
          resNewMessage
        );

        dispatch(pushDataChats(dataChatFilter));

        let dataRoomsFilter = funUpdateNewMsgRoom(
          containUser,
          containRooms,
          resNewMessage,
          textSearchSubmit,
          containNavActive,
          funIsSeletedChannel(dtChannelSeleted),
          funIsSeletedStatus(dtConversationSeleted, containUser.role.name)
        );
        dispatch(pushRoomsChat(dataRoomsFilter));
      }
    }
  }, [resNewMessage]);

  React.useEffect(() => {
    if (resResolveMessage != null && Object.keys(containUser).length != 0) {
      if (containUser.role != null) {
        let dataChatResolve = funResolveMsgRoom(
          containUser,
          containRooms,
          resResolveMessage,
          textSearchSubmit,
          funIsSeletedChannel(dtChannelSeleted),
          funIsSeletedStatus(dtConversationSeleted, containUser.role.name)
        );
        dispatch(updateRoomsChat(dataChatResolve));
      }
    }
  }, [resResolveMessage]);

  React.useEffect(() => {
    if (resAssignMessage != null && Object.keys(containUser).length != 0) {
      if (containUser.role != null) {
        let data = funAssignNewMsgRoom(
          containUser,
          containRooms,
          resAssignMessage,
          textSearchSubmit,
          funIsSeletedChannel(dtChannelSeleted),
          funIsSeletedStatus(dtConversationSeleted, containUser.role.name)
        );
        dispatch(updateRoomsChat(data));
      }
    }
  }, [resAssignMessage]);

  React.useEffect(() => {
    if (resReqLive != null && Object.keys(containUser).length != 0) {
      let data = funHandleNewMsgRoom(resReqLive, containRooms);
      dispatch(updateRoomsChat(data));
    }
  }, [resReqLive]);

  const onResAssignFromAgent = () => {
    setFormAgent("");
    setConversationName("");
    setTimeAssignFromTeam(0);
    setResAssignFromAgent(null);
  };

  React.useEffect(() => {
    if (resAssignFromAgent != null && Object.keys(containUser).length != 0) {
      if (resAssignFromAgent.agent != null && containUser.role != null) {
        if (
          containUser.user_id == resAssignFromAgent.agent.user.id &&
          containUser.role.name == "Staff"
        ) {
          if (resAssignFromAgent.room.agent_info != null) {
            setFormAgent(resAssignFromAgent.room.agent_info.name);
          }

          setConversationName(resAssignFromAgent.room.created_by.name);
          refAssignFormAgent.current.open();
          setTimeAssignFromTeam(1);
          setTimeout(() => {
            onResAssignFromAgent();
          }, 15000);
        } else {
          onResAssignFromAgent();
        }
      } else {
        onResAssignFromAgent();
      }
    } else {
      onResAssignFromAgent();
    }
  }, [resAssignFromAgent]);

  React.useEffect(() => {
    if (resRequestHandel != null && Object.keys(containUser).length != 0) {
      if (containUser.role != null) {
        let dataRoomsFilter = funRequestHandel(
          containUser,
          containRooms,
          resRequestHandel,
          textSearchSubmit,
          funIsSeletedChannel(dtChannelSeleted),
          funIsSeletedStatus(dtConversationSeleted, containUser.role.name)
        );
        dispatch(updateRoomsChat(dataRoomsFilter));
      }
    }
  }, [resRequestHandel]);

  React.useEffect(() => {
    console.log("resRejectAssign", resRejectAssign);
  }, [resRejectAssign]);

  React.useEffect(() => {
    dispatch(changeIsOpen(false));
    getDataUser();
    onDataIsActive();
    onDataIsChoose();
    onDataIsLogin();
    onDataOnBoard();
    setTimeout(() => {
      // SplashScreen.hide();
    }, 3000);
  }, []);


  if (Object.keys(containUser).length != 0) {
    echo
      .channel("ChannelApp." + containUser.app_id)
      .listen("NewMessage", (res) => {
        setResNewMessage(res);
      });
    echo
      .channel("ChannelApp." + containUser.app_id)
      .listen("RequestHandled", (res) => {
        setResRequestHandel(res);
      });
    echo
      .channel("ChannelApp." + containUser.app_id)
      .listen("RequestLive", (res) => {
        setResReqLive(res);
      });
    echo
      .channel("ChannelApp." + containUser.app_id)
      .listen("AssigntAgent", (res) => {
        setResAssignMessage(res);
      });
    echo
      .channel("ChannelApp." + containUser.app_id)
      .listen("ChatResolved", (res) => {
        setResResolveMessage(res);
      });
    echo
      .channel("ChannelApp." + containUser.app_id)
      .listen("ApprovalAssignToAgent", (res) => {
        setResAssignFromAgent(res);
      });
    echo
      .channel("ChannelApp." + containUser.app_id)
      .listen("OnlineOffline", (res) => {
        setResIsOnline(res);
      });
    echo
      .channel("ChannelApp." + containUser.app_id)
      .listen("RejectAssign", (res) => {
        setResRejectAssign(res);
      });
  }

  const resApprove = (item, msg) => {
    setFormAgent("");
    setConversationName("");
    setTimeAssignFromTeam(0);
    setResAssignFromAgent(null);
    setIsLoadingApprove(false);
    refAssignFormAgent.current.close();
    if (item == "success") {
      // toastSuccess.current.show(msg, 1000);
    } else {
      // toastFailed.current.show(msg, 1000);
    }
  };

  const funcApprove = async () => {
    if (resAssignFromAgent != null && Object.keys(containUser).length != 0) {
      if (resAssignFromAgent.agent != null && containUser.role != null) {
        if (
          containUser.user_id == resAssignFromAgent.agent.user.id &&
          containUser.role.name == "Staff"
        ) {
          let headers = {
            token: containUser.token,
            userId: encodeHashIds(containUser.user_id),
          };

          let params = {
            agent_id: resAssignFromAgent.agent.user.id,
            livechat: resAssignFromAgent.room.livechat,
            room_id: resAssignFromAgent.room.id,
          };

          try {
            setIsLoadingApprove(true);
            let res = await postDataOutHeader(
              API.PATH + encodeHashIds(containUser.app_id) + "/agent/assign",
              params,
              headers
            );
            if (res.success) {
              resApprove("success", res.message);
            } else {
              resApprove("failed", res.message);
            }
          } catch (e) {
            let msg = "Terjadi kendala teknis, Harap coba kembali!";
            resApprove("failed", msg);
          }
        }
      }
    }
  };

  const confirmSessionErr = () => {
    removeValue("WAS_LOGIN");
    removeValue("DATA_LOGIN");
    setTimeout(() => {
      refSessionError.current.close();
      dispatch(onLogin(false));
      setTimeout(() => {
        dispatch(resetDataUserWasLogin());
      }, 200);
    }, 500);
  };

  const funcReject = async () => {
    if (resAssignFromAgent != null && Object.keys(containUser).length != 0) {
      if (resAssignFromAgent.agent != null && containUser.role != null) {
        if (
          containUser.user_id == resAssignFromAgent.agent.user.id &&
          containUser.role.name == "Staff"
        ) {
          let headers = {
            token: containUser.token,
            userId: encodeHashIds(containUser.user_id),
          };

          let params = {
            message: "reject your assigment conversation",
          };

          try {
            setIsLoadingApprove(true);
            let res = await postDataOutHeader(
              API.PATH +
                encodeHashIds(containUser.app_id) +
                "/agent/reject-assign",
              params,
              headers
            );

            if (res.success) {
              resApprove("success", res.message);
            } else {
              resApprove("failed", res.message);
            }
          } catch (e) {
            let msg = "Terjadi kendala teknis, Harap coba kembali!";
            resApprove("failed", msg);
          }
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <>
        <AppContainer />

        <RBSheet
          duration={400}
          height={dimenHeight}
          ref={refAssignFormAgent}
          closeOnPressMask={false}
          closeOnPressBack={false}
          customStyles={{
            container: {
              flex: 1,
              alignSelf: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              justifyContent: "center",
              paddingTop: moderateScale(30),
              borderRadius: moderateScale(10),
              marginBottom: moderateScale(20),
              paddingBottom: moderateScale(40),
              width: dimenWidth - moderateScale(40),
              paddingHorizontal: moderateScale(10),
            },
          }}
        >
          {imageAssignFromAgent(
            dimenWidth - moderateScale(40) - moderateScale(48),
            dimenWidth - moderateScale(40) - moderateScale(48)
          )}
          <Text
            style={{
              letterSpacing: 0.1,
              textAlign: "center",
              fontSize: moderateScale(16),
              lineHeight: moderateScale(24),
              marginBottom: moderateScale(20),
            }}
          >
            {formAgent} wants to assign conversation {conversationName} to you.
          </Text>
          <View style={{ flexDirection: "row" }}>
            {isLoadingApprove ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: moderateScale(44),
                  backgroundColor: "#5589c3",
                  borderRadius: moderateScale(8),
                  paddingHorizontal: moderateScale(10),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator color="#fff" size="small" />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => funcApprove()}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: moderateScale(44),
                  backgroundColor: "#5589c3",
                  borderRadius: moderateScale(8),
                  paddingHorizontal: moderateScale(10),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    color="#fff"
                    type="feather"
                    name="check-circle"
                    size={moderateScale(14)}
                  />
                  <Text
                    style={{
                      color: "#fff",
                      letterSpacing: 0.1,
                      fontSize: moderateScale(14),
                      marginLeft: moderateScale(4),
                      lineHeight: moderateScale(24),
                      marginVertical:
                        Platform.OS == "android"
                          ? moderateScale(16)
                          : moderateScale(0),
                    }}
                  >
                    Approve
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => funcReject()}
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: moderateScale(44),
                backgroundColor: "#eb5337",
                marginLeft: moderateScale(6),
                borderRadius: moderateScale(8),
                paddingHorizontal: moderateScale(10),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  color="#fff"
                  type="feather"
                  name="x-circle"
                  size={moderateScale(14)}
                />
                <Text
                  style={{
                    color: "#fff",
                    letterSpacing: 0.1,
                    fontSize: moderateScale(14),
                    marginLeft: moderateScale(4),
                    lineHeight: moderateScale(24),
                    marginVertical:
                      Platform.OS == "android"
                        ? moderateScale(16)
                        : moderateScale(0),
                  }}
                >
                  Reject
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </RBSheet>

        <RBSheet
          duration={400}
          ref={refSessionError}
          height={moderateScale(150)}
          closeOnPressMask={false}
          closeOnPressBack={false}
          customStyles={{
            container: {
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              borderTopLeftRadius: moderateScale(10),
              borderTopRightRadius: moderateScale(10),
            },
          }}
        >
          <Text
            style={{
              color: "#000",
              textAlign: "center",
              fontSize: moderateScale(14),
              marginBottom: moderateScale(24),
            }}
          >
            Session sudah habis, Harap login kembali !!
          </Text>

          <TouchableOpacity
            onPress={() => confirmSessionErr()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: moderateScale(36),
              backgroundColor: "#eb5337",
              borderRadius: moderateScale(8),
              paddingHorizontal: moderateScale(10),
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                color="#fff"
                type="feather"
                name="check-circle"
                size={moderateScale(14)}
              />
              <Text
                style={{
                  color: "#fff",
                  letterSpacing: 0.1,
                  fontSize: moderateScale(14),
                  marginLeft: moderateScale(4),
                  lineHeight: moderateScale(24),
                }}
              >
                Ya
              </Text>
            </View>
          </TouchableOpacity>
        </RBSheet>
      </>
    </SafeAreaView>
  );
};

export default App;
