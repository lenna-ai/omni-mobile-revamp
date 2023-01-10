import React from "react";
import API from "./../../../utils/api";
import BSNavigationPlus from "./components/BSNavigationPlus";
import BSConfirmLogout from "./components/BSConfirmLogout";
import HeaderHome from "./components/HeaderHome";
import OfficeHourHome from "./components/OfficeHourHome";
import StatusHome from "./components/StatusHome";
import MainHome from "./components/MainHome";
import BottomListRequest from "./components/BottomListRequest";

import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loadDataRoomReq } from "../../../modules/redux/actions/home/inMain";
import { encodeHashIds } from "../../../utils/encode";
import { changeAppConfiguration } from "../../../modules/redux/actions/appConfiguration/inAppConfigruration";
import { getData, postDataOutHeader } from "../../../modules/services";
import { addDataRoomReq } from "../../../modules/redux/actions/inHome";
import {
  addDataCountRoom,
  loadDataCountRoom,
  loadDataGetCustomer
} from "../../../modules/redux/actions/home/inStatus";
import {
  addDataOfficeHour,
  loadDataOfficeHour
} from "../../../modules/redux/actions/home/inOfficeHour";
import {
  changeProfileWasLogin,
  loadProfileWasLogin
} from "../../../modules/redux/actions/profileWasLogin/inProfileWasLogin";
import {
  addDataMemberApp,
  pushDataMemberApp
} from "../../../modules/redux/actions/member/inMember";
import { resetAllDataForAssign } from "../../../modules/redux/actions/member/inForAssign";
import { changeIsOpen } from "../../../modules/redux/actions/other/inBSNavigationPlus";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const disMain = useSelector(state => state.mDataMain);
  let dataMainLoading = disMain.loadingRoomRequest;

  const disBsMore = useSelector(state => state.mDataBSNavigationPlus);
  let dataBsMore = disBsMore.isOpen;

  const disSeletedAssign = useSelector(state => state.mDataForAssign);
  let dataSeletedAssign = disSeletedAssign.roomIdAssign;

  const toastHomeFailed = React.useRef();
  const toastHomeSuccess = React.useRef();
  const refRBSheetOnline = React.useRef(null);
  const refRBSheetMorePlus = React.useRef(null);
  const refRBSheetConfirmLogout = React.useRef(null);

  const [page, setPage] = React.useState(1);
  const [onReload, setOnReload] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isErrGetMember, setIsErrGetMember] = React.useState(false);
  // const [pageMsgTemplate, setPageMsgTemplate] = React.useState(1);
  // const [isErrGetTemplate, setIsErrGetTemplate] = React.useState(false);

  React.useEffect(() => {
    loadDataHome();
  }, []);

  React.useEffect(
    () => {
      if (!isErrGetMember) {
        getDataMember(dataUser.app_id);
      }
    },
    [page]
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (!dataMainLoading) {
        dispatch(resetAllDataForAssign());
        loadDataHomeGoBack();
      }
    });
    return unsubscribe;
  }, navigation);

  React.useEffect(
    () => {
      if (onReload) {
        dispatch(loadDataRoomReq(true));
        getDataRoomReq(dataUser.app_id, dataUser.role.name);
      }
    },
    [onReload]
  );

  React.useEffect(
    () => {
      if (dataBsMore) {
        refRBSheetMorePlus.current.open();
      } else {
        refRBSheetMorePlus.current.close();
      }
    },
    [dataBsMore]
  );

  const onFirstOnline = async user => {
    if (user.role.name == "Staff") {
      try {
        let headers = {
          token: user.token,
          userId: encodeHashIds(user.user_id)
        };
        let params = {
          online: true,
          agentId: user.user_id
        };
        let data = await postDataOutHeader(
          API.PATH + encodeHashIds(user.app_id) + "/agent/change-status",
          params,
          headers
        );
        if (data.success) {
          dispatch(changeIsOnline(true));
        } else {
          dispatch(changeIsOnline(false));
        }
      } catch (error) {
        dispatch(changeIsOnline(true));
      }
    }
  };

  const loadDataHome = () => {
    setPage(1);
    setRefreshing(false);
    setIsErrGetMember(false);
    dispatch(loadDataRoomReq(true));
    dispatch(loadDataCountRoom(true));
    dispatch(loadDataOfficeHour(true));
    dispatch(loadProfileWasLogin(true));
    setTimeout(() => {
      getAllInHome(dataUser);
      onFirstOnline(dataUser);
    }, 1000);
  };

  const getAllInHome = data => {
    getDataApp(data.app_id);
    getDataProfile(data.app_id);
    getDataOfficeHour(data.app_id);
    getDataRoomReq(data.app_id, data.role.name);
    getDataCountRoom(data.app_id, data.role.name, data.user_id);
  };

  const getDataApp = async appId => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    try {
      let data = await getData(
        API.PATH + encodeHashIds(appId) + "/app",
        headers
      );
      console.log("app___", data);

      if (data.success) {
        dispatch(changeAppConfiguration(data.data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getDataProfile = async appId => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    console.log("header_home", headers);

    try {
      let data = await getData(
        API.PATH + encodeHashIds(appId) + "/user-platform/user-data",
        headers
      );
      if (data.success) {
        dispatch(changeProfileWasLogin(data.data));
        setTimeout(() => {
          dispatch(loadProfileWasLogin(false));
        }, 2000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getDataOfficeHour = async appId => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    console.log("header___", encodeHashIds(dataUser.user_id));

    try {
      let data = await getData(
        API.PATH + encodeHashIds(appId) + "/get-office-hour",
        headers
      );
      console.log("data_link", data);
      if (data.success) {
        dispatch(addDataOfficeHour(data.data));
        setTimeout(() => {
          dispatch(loadDataOfficeHour(false));
        }, 2000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getDataRoomReq = async (appId, role) => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    let status = "";
    if (role == "Staff") {
      status = "request";
    }
    try {
      let res = await getData(
        API.PATH +
          encodeHashIds(appId) +
          "/room/get-room-list-new?status=" +
          status,
        headers
      );
      console.log("get room list : ", res);
      if (res.data != undefined || res.data.length != 0) {
        if (role != "Staff") {
          let dataStatusNoBot = res.data.filter(function(entry) {
            if (entry.livechat != null) {
              return entry.livechat.status !== "resolved";
            }
          });
          let dataStatusBot = res.data.filter(function(entry) {
            return entry.livechat == null;
          });
          let dataStatusReq = [...dataStatusBot, ...dataStatusNoBot];
          dispatch(addDataRoomReq(dataStatusReq.slice(0, 5)));
        } else {
          dispatch(addDataRoomReq(res.data.slice(0, 5)));
        }
        setTimeout(() => {
          dispatch(loadDataRoomReq(false));
        }, 2000);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getDataCountRoom = async (appId, role, userId) => {
    let dataParams = undefined;
    if (role == "Staff") {
      dataParams = userId;
    } else {
      dataParams = {};
    }
    try {
      let headers = {
        token: dataUser.token,
        userId: encodeHashIds(dataUser.user_id)
      };
      let params = {
        userId: dataParams
      };
      let data = await postDataOutHeader(
        API.PATH + encodeHashIds(appId) + "/room/get-count-room-by-status",
        params,
        headers
      );

      dispatch(addDataCountRoom(data));
      setTimeout(() => {
        dispatch(loadDataCountRoom(false));
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  };

  const getDataMember = async appId => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    try {
      let res = await getData(
        API.PATH + encodeHashIds(appId) + "/member?page=" + page,
        headers
      );
      console.log("dataMember-11", res);

      if (res.data.length != 0) {
        let dataMemberFilter = res.data.filter(function(entry) {
          return entry.role.name === "Staff";
        });
        if (page == 1) {
          dispatch(addDataMemberApp(dataMemberFilter));
        } else {
          dispatch(pushDataMemberApp(dataMemberFilter));
        }
        setPage(page + 1);
      } else {
        setIsErrGetMember(true);
      }
    } catch (e) {
      setIsErrGetMember(true);
    }
  };

  const loadDataHomeGoBack = () => {
    setPage(1);
    setRefreshing(false);
    setIsErrGetMember(false);
    dispatch(loadDataRoomReq(false));
    dispatch(loadDataCountRoom(false));
    dispatch(loadDataOfficeHour(false));
    dispatch(loadProfileWasLogin(false));
    setTimeout(() => {
      getAllInHome(dataUser);
    }, 1000);
  };

  const onLogout = () => {
    dispatch(changeIsOpen(false));
    setTimeout(() => {
      refRBSheetConfirmLogout.current.open();
    }, 500);
  };

  const onReloadMain = () => {
    setOnReload(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(resetAllDataForAssign());
    loadDataHome();
  };

  const goToAssign = () => {
    if (dataSeletedAssign != 0) {
      setOnReload(false);
      navigation.navigate("AssignToTeam", {
        namePage: "Home",
        reload: () => onReloadMain()
      });
    } else {
      // toastHomeFailed.current.show("Harap pilih room terlebih dahulu!", 1000);
    }
  };

  const buttonGetCustomer = async () => {
    dispatch(loadDataGetCustomer(true));
    try {
      let headers = {
        token: dataUser.token,
        userId: encodeHashIds(dataUser.user_id)
      };

      let params = {
        agentId: dataUser.user_id,
        room: null
      };
      let data = await postDataOutHeader(
        API.PATH + encodeHashIds(dataUser.app_id) + "/livechat/handle",
        params,
        headers
      );
      if (data.success) {
        // toastHomeSuccess.current.show(data.message, 1000);
        onReloadMain();
        setTimeout(() => {
          setOnReload(false);
          navigation.jumpTo("Chats");
          dispatch(loadDataGetCustomer(false));
        }, 1000);
      } else {
        // toastHomeFailed.current.show(data.message, 1000);
      }
    } catch (e) {
      // toastHomeFailed.current.show("Terjadi Kendala, Harap Coba lagi!", 1000);
      console.log(e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      <View
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HeaderHome />
        <OfficeHourHome />
        <StatusHome />
        <View style={{ flex: 1, marginHorizontal: 24, marginTop: 18 }}>
          <MainHome navigation={navigation} />
        </View>
      </View>
      <View style={{ marginHorizontal: 24 }}>
        <BottomListRequest
          buttonGetCustomer={buttonGetCustomer}
          goToAssign={goToAssign}
        />
      </View>
      <BSNavigationPlus
        refRBSheetMorePlus={refRBSheetMorePlus}
        navigation={navigation}
        refRBSheetOnline={refRBSheetOnline}
        onLogout={onLogout}
      />
      <BSConfirmLogout refRBSheetConfirmLogout={refRBSheetConfirmLogout} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
