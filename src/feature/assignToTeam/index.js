import * as React from "react";

import {
  Text,
  View,
  Platform,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

// Import Asset
import { imageIconBack } from "./../../assets/icons";

//Import Internal
import API from "./../../utils/api";
import { moderateScale } from "../other/Scaling";
import { postDataOutHeader } from "../../modules/services";
import { addDataForAssignAgentID } from "../../modules/redux/actions/member/inForAssign";

// Import Third Party
// import Toast from 'react-native-easy-toast';
import { encodeHashIds } from "../../utils/encode";
import { Header, Avatar } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const dataGroup = [
  {
    id: 1,
    name: "Sales Team 01",
    count: 0
  },
  {
    id: 2,
    name: "Sales Team 02",
    count: 0
  },
  {
    id: 3,
    name: "Support Team 01",
    count: 0
  },
  {
    id: 4,
    name: "Support Team 02",
    count: 0
  }
];

const AssignToTeam = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const { reload } = route.params;
  const { namePage } = route.params;

  const [selectedGroup, setSelectedGroup] = React.useState(new Map());
  const [selectedMember, setSelectedMember] = React.useState(new Map());

  const disAppConfig = useSelector(state => state.mAppConfiguration);
  let dataAppConfig = disAppConfig.dataAppConfiguration;

  const [idsSlectedMember, setIdsSlectedMember] = React.useState(undefined);

  const disMember = useSelector(state => state.mDataMember);
  let dataMember = disMember.dataMemberApp;

  let disRooms = useSelector(state => state.mDataRoomsChat);
  let dataRooms = disRooms.dataRoomsChat;

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const disSeletedAssign = useSelector(state => state.mDataForAssign);

  let dataRoomId = disSeletedAssign.roomIdAssign;
  let dataAgentId = disSeletedAssign.agentIdAssign;
  let dataLivechat = disSeletedAssign.livechatAssign;
  let dataAgentInfo = disSeletedAssign.agentInfoAssign;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const toastAssignToTeam = React.useRef();

  React.useEffect(() => {
    if (dataAgentInfo != null) {
      const newSelected = new Map();
      newSelected.set(dataAgentInfo.id, true);
      setSelectedMember(newSelected);
    }
  }, []);

  const HeaderComponent = () => {
    return (
      <Header
        placement="left"
        centerComponent={() => {
          return (
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "82%",
                  height: 43
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  {imageIconBack(moderateScale(24), moderateScale(24))}
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 6,
                    color: "#000",
                    fontSize: 24,
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}
                >
                  Assign to Team
                </Text>
              </View>
            </View>
          );
        }}
        containerStyle={{
          height: 88,
          paddingTop: 5,
          marginHorizontal: -12,
          backgroundColor: "#FFF",
          justifyContent: "center",
          borderBottomColor: "#fff"
        }}
      />
    );
  };

  const onSelectMember = React.useCallback(
    user_id => {
      const newSelected = new Map();
      newSelected.set(user_id, true);
      setSelectedMember(newSelected);
      dispatch(addDataForAssignAgentID(user_id));
    },
    [selectedMember]
  );

  const itemListAgent = (user_id, name, selectedMember, onSelectMember) => {
    return (
      <TouchableOpacity
        onPress={() => onSelectMember(user_id)}
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
                borderWidth: 2,
                borderRadius: 18 / 2,
                borderColor: "#A0A4A8",
                backgroundColor: !selectedMember ? "#A0A4A8" : "#fff"
              }}
            />
            <Text
              style={{
                fontSize: 14,
                marginLeft: 16,
                lineHeight: 24,
                fontWeight: "bold",
                letterSpacing: 0.1,
                textTransform: "capitalize"
              }}
            >
              {name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const itemListGroup = (id, name, count, selectedGroup, onSelectGroup) => {
    return (
      <TouchableOpacity
        onPress={() => onSelectGroup(id)}
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
                backgroundColor: !selectedGroup ? "#A0A4A8" : "#fff"
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
              {name}
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
                  {count}
                </Text>
              </View>
            : null}
        </View>
      </TouchableOpacity>
    );
  };

  const setParams = (value1, value2, value3) => {
    let params = { agent_id: value1, livechat: value2, room_id: value3 };
    return params;
  };

  const setParamsAgent = (value1, value2) => {
    let params = {
      agent: value1,
      room: value2
    };
    return params;
  };

  const postAssignAgent = async () => {
    let dataMessage = "";
    if (dataAgentId != 0) {
      setIsLoading(true);
      let headers = {
        token: dataUser.token,
        userId: encodeHashIds(dataUser.user_id)
      };
      if (dataUser.role.name == "Staff") {
        if (dataAppConfig.app.approval_agent) {
          try {
            let dataListMember = dataMember.find((entry, i) => {
              return entry.user.id == dataAgentId;
              // console.log("entry", entry);
            });
            let dataListRoom = dataRooms.find((entry, i) => {
              return entry.id == dataRoomId;
            });

            let res = await postDataOutHeader(
              API.PATH +
                encodeHashIds(dataUser.app_id) +
                "/agent/approval-assign",
              setParamsAgent(dataListMember, dataListRoom),
              headers
            );

            if (res.success) {
              dataMessage = res.message;
              resPostAssignToast(true, false, dataMessage);
              setTimeout(() => {
                if (namePage == "Home") {
                  reload();
                }
                navigation.popToTop();
              }, 2000);
            } else {
              dataMessage = res.message;
              resPostAssignToast(false, false, dataMessage);
            }
          } catch (error) {
            dataMessage = "Terjadi kendala harap coba kembali!";
            resPostAssignToast(false, false, dataMessage);
          }
        } else {
          try {
            let res = await postDataOutHeader(
              API.PATH + encodeHashIds(dataUser.app_id) + "/agent/assign",
              setParams(dataAgentId, dataLivechat, dataRoomId),
              headers
            );
            if (res.success) {
              dataMessage = res.message;
              resPostAssignToast(true, false, dataMessage);
              setTimeout(() => {
                if (namePage == "Home") {
                  reload();
                }
                navigation.popToTop();
              }, 2000);
            } else {
              dataMessage = res.message;
              resPostAssignToast(false, false, dataMessage);
            }
          } catch (error) {
            dataMessage = "Terjadi kendala harap coba kembali!";
            resPostAssignToast(false, false, dataMessage);
          }
        }
      } else {
        try {
          let res = await postDataOutHeader(
            API.PATH + encodeHashIds(dataUser.app_id) + "/agent/assign",
            setParams(dataAgentId, dataLivechat, dataRoomId),
            headers
          );
          if (res.success) {
            dataMessage = res.message;
            resPostAssignToast(true, false, dataMessage);
            setTimeout(() => {
              if (namePage == "Home") {
                reload();
              }
              navigation.popToTop();
            }, 2000);
          } else {
            dataMessage = res.message;
            resPostAssignToast(false, false, dataMessage);
          }
        } catch (error) {
          dataMessage = "Terjadi kendala harap coba kembali!";
          resPostAssignToast(false, false, dataMessage);
        }
      }
    } else {
      dataMessage = "Harap pilih agent yang ingin di assign!";
      resPostAssignToast(false, false, dataMessage);
    }
  };

  const resPostAssignToast = (value1, value2, value3) => {
    setIsSuccess(value1);
    setIsLoading(value2);
    toastAssignToTeam.current.show(value3, 1000);
  };

  const assignToTeam = async () => {
    postAssignAgent();
    // let headers = {
    //     token: dataUser.token,
    //     userId: encodeHashIds(dataUser.user_id)
    // }

    // console.log("idsSlectedMember", idsSlectedMember);
    // if (dataUser.role.name == 'Staff') {
    //     onAssignAgentToAgent(headers);
    // } else {
    //     onAssignAdminToAgent(headers);
    // }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent />
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 20,
          paddingVertical: 10
        }}
      >
        <View style={styles.container}>
          <View>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 24,
                marginBottom: 8,
                color: "#A0A4A8",
                fontWeight: "bold",
                letterSpacing: 0.1,
                fontStyle: "normal",
                textTransform: "uppercase"
              }}
            >
              Agents
            </Text>
            {dataMember.length == 0
              ? <View
                  style={{
                    paddingTop: moderateScale(18),
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      marginTop: moderateScale(12),
                      fontSize: moderateScale(18),
                      textAlign: "center",
                      color: "#A5A5A5",
                      fontStyle: "normal",
                      fontWeight: "500"
                    }}
                  >
                    No member or agent available!
                  </Text>
                </View>
              : <FlatList
                  data={dataMember}
                  renderItem={({ item }) =>
                    itemListAgent(
                      item.user_id,
                      item.user.name,
                      !selectedMember.get(item.user_id),
                      onSelectMember
                    )}
                  keyExtractor={item => item.user_id}
                  extraData={selectedMember}
                />}
          </View>
        </View>
        <View>
          {isLoading
            ? <View
                style={{
                  height: 56,
                  borderRadius: 10,
                  width: dimenWidth - 48,
                  flexDirection: "row",
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
            : dataMember.length != 0
              ? <TouchableOpacity
                  onPress={() => assignToTeam()}
                  style={[
                    styles.bottomProccess,
                    { backgroundColor: "#5588C3" }
                  ]}
                >
                  <Text style={styles.textBottomProccess}>Proceed</Text>
                </TouchableOpacity>
              : <View
                  style={[
                    styles.bottomProccess,
                    { backgroundColor: "#C9C9C9" }
                  ]}
                >
                  <Text style={styles.textBottomProccess}>Proceed</Text>
                </View>}
        </View>
      </View>
      {/* <Toast
                ref={toastAssignToTeam}
                style={{
                    backgroundColor:isSuccess?'#5588C3':'#ED5653', 
                    paddingHorizontal: 20
                }}
                position='top'
                textStyle={{color:'#fff'}}
            /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomProccess: {
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(44),
    borderRadius: moderateScale(8),
    width: dimenWidth - moderateScale(60),
    marginBottom: moderateScale(10)
  },
  textBottomProccess: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22)
  }
});

export default AssignToTeam;
