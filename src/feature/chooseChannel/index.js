import React, { useEffect, useContext } from "react";
import HeaderChooseChannel from "./atom/header";
import SearchInputChannel from "./atom/search-input";
import WelcomeBanner from "./atom/welcome-banner";
import API from "./../../utils/api";
import Icon from "react-native-remix-icon";

import {
  FlatList,
  ScrollView,
  Dimensions,
  LogBox,
  ActivityIndicator
} from "react-native";
import { moderateScale } from "../other/Scaling";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../modules/navigation/navigationContext";
import { getData } from "../../modules/services";
import { encodeHashIds } from "../../utils/encode";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import {
  BannerAvatar,
  BgWorkspace,
  Icon3dot,
  IconBell,
  IconGhost,
  IconHumberger
} from "../../assets";
import { SvgUri } from "react-native-svg";
import moment from "moment";
import LastProject from "./atom/last-project";
import { getValue, saveData } from "../../modules/localData";
import BSConfirmLogout from "../tabsScreen/home/components/BSConfirmLogout";
import BSSheetChoose from "./BSSheet/BSSheetChoose";
import { onChooseActive } from "../../modules/redux/actions/inNavigation";
import { addDataUserWasLogin } from "../../modules/redux/actions/inDataUserLogin";
import { loadDataRoomReq } from "../../modules/redux/actions/home/inMain";

const { width } = Dimensions.get("screen");

const ChooseChannel = ({ navigation }) => {
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    LogBox.ignoreAllLogs();
  }, []);

  const dispatch = useDispatch();

  const { signIn } = React.useContext(AuthContext);

  const toastFailed = React.useRef(null);
  const toastSuccess = React.useRef(null);
  const refConfirmChoose = React.useRef(null);
  const refRBSheetConfirmLogout = React.useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dataProjet, setDataProjet] = React.useState([]);
  const [dataFilter, setDataFilter] = React.useState([]);
  const [itemClick, setItemClick] = React.useState(undefined);
  const [searchChannel, setSearchChannel] = React.useState("");
  const [dataLastProject, setDataLastProject] = React.useState(null);

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  React.useEffect(
    () => {
      const unsubscribe = navigation.addListener("focus", () => {
        setLoading(true);
        getListChannels(dataUser);
      });
      return unsubscribe;
    },
    [navigation]
  );

  useEffect(() => {
    getListChannels(dataUser);
    getLastProject();
  }, []);

  // get channel
  const getListChannels = async user => {
    let headers = {
      token: user.token,
      userId: encodeHashIds(user.user_id)
    };
    try {
      let res = await getData(API.PATH2 + "apps/" + user.id, headers);
      if (Array.isArray(res)) {
        if (res.length != 0) {
          setLoading(false);
          setResponse(res);
          setDataFilter(res);
          setDataProjet(res);
        }
      }
    } catch (e) {
      console.log("e_list_channels", e);
    }
  };

  // search channel
  const changeSearchChannel = txt => {
    setSearchChannel(txt);
    if (txt != "") {
      let filteredName = dataProjet.filter(item => {
        return item.name.toLowerCase().match(txt.toLowerCase());
      });

      if (filteredName.length != 0) {
        setDataFilter([...filteredName]);
      } else {
        setDataFilter([]);
      }
    } else {
      setDataFilter(response);
    }
  };

  const getLastProject = async () => {
    let res = await getValue("LASTPROJECT");
    setDataLastProject(res);
  };

  const goToDinamisPage = item => {
    console.log(item);
    setDataLastProject(item);
    setItemClick(item);
    saveData("LASTPROJECT", item);
    refConfirmChoose.current.open();
  };

  const confirmYes = async () => {
    setIsLoading(true);
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };
    try {
      let res = await getData(
        API.PATH + encodeHashIds(itemClick.id) + "/accessibility/get-role",
        headers
      );
      let dataLogin = {
        app_id: itemClick.id,
        id: dataUser.id,
        name: dataUser.name,
        email: dataUser.email,
        token: dataUser.token,
        role: res,
        online: true,
        reason_offline: null,
        user_id: dataUser.user_id
      };

      saveData("WAS_LOGIN", true);
      saveData("DATA_LOGIN", dataLogin);
      saveData("IS_CHOOSE_ACTIVE", true);
      saveData("IS_CHOOSE_CHANNEL", false);
      dispatch(onChooseActive(true));
      dispatch(addDataUserWasLogin(dataLogin));
      dispatch(loadDataRoomReq(true));

      setTimeout(() => {
        setIsLoading(false);
        refConfirmChoose.current.close();
        signIn();
      }, 1000);
    } catch (e) {
      setIsLoading(false);
      refConfirmChoose.current.close();
      toastFailed.current.show(
        "Terjadi kendala teknis, Harap coba lagi!!",
        1000
      );
    }
  };

  const confirmNo = () => {
    refConfirmChoose.current.close();
    setItemClick(undefined);
  };

  return (
    <ImageBackground style={styles.containerBg} source={BgWorkspace}>
      <ScrollView nestedScrollEnabled={true}>
        {/* header */}
        <HeaderChooseChannel
          dataUser={dataUser}
          onLogout={() => {
            refRBSheetConfirmLogout.current.open();
          }}
        />
        {/* search input */}
        <SearchInputChannel
          onSearch={text => {
            changeSearchChannel(text);
          }}
        />

        {/* WElcomeBanner */}
        {searchChannel ? null : <WelcomeBanner />}

        {/* Your project */}
        <View style={styles.sectionProject}>
          <View style={styles.projectSectionTitle}>
            <Text style={styles.txtYourProject}>Your Project</Text>
            <Text style={styles.txtTotalProject}>
              ( {dataFilter.length} Project )
            </Text>
          </View>
          {/* Card last project */}
          {!dataLastProject ? null : <LastProject data={dataLastProject} />}
          {/* list project */}
          {loading
            ? <View style={styles.containerLoading}>
                <ActivityIndicator size={"large"} color="#323F6B" />
              </View>
            : dataFilter.length
              ? <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={dataFilter}
                  numColumns={2}
                  columnWrapperStyle={{
                    flex: 1,
                    justifyContent: "space-between",
                    marginTop: moderateScale(16)
                  }}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.cardProject}
                        activeOpacity={0.6}
                        onPress={() => {
                          goToDinamisPage(item);
                        }}
                      >
                        <View style={styles.cardTop}>
                          <View style={styles.coverImgCard}>
                            {item.icon.split("-")[0] === "ri"
                              ? <Icon name={item.icon} size="20" color="red" />
                              : <SvgUri
                                  width={moderateScale(20)}
                                  height={moderateScale(20)}
                                  uri={`${API.BASE_URL}auth/public/${item.icon}`}
                                />}
                            {/* <Image source={IconGhost} style={styles.imgIconCard} /> */}
                          </View>
                          <TouchableOpacity>
                            <Icon3dot width={moderateScale(18)} />
                          </TouchableOpacity>
                        </View>
                        <View style={{}}>
                          <Text style={styles.titleCard}>
                            {item.name}
                          </Text>
                          <Text style={styles.descCard}>
                            {item.description}
                          </Text>
                        </View>
                        <View style={{}}>
                          <Text style={styles.createdAtCard}>
                            {`Created At ${moment(item.created_at).format(
                              "DD MMM YYYY"
                            )}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              : <View style={styles.contentNoData}>
                  <Text>Tidak ada Channel yang tersedia!</Text>
                </View>}
        </View>
      </ScrollView>

      <BSSheetChoose
        itemClick={itemClick}
        confirmNo={confirmNo}
        isLoading={isLoading}
        confirmYes={confirmYes}
        refConfirmChoose={refConfirmChoose}
      />
      <BSConfirmLogout refRBSheetConfirmLogout={refRBSheetConfirmLogout} />
    </ImageBackground>
  );
};

export default React.memo(ChooseChannel);

const styles = StyleSheet.create({
  containerBg: {
    flex: 1,
    padding: moderateScale(16)
  },
  flexDirectionBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  flexDirection: {
    height: 60,
    flexDirection: "row",
    alignItems: "center"
  },
  sectionProject: {
    marginTop: moderateScale(24)
  },
  projectSectionTitle: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  txtYourProject: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: "#1C3A5E",
    marginRight: moderateScale(8)
  },
  txtTotalProject: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#A19F9F",
    marginRight: moderateScale(8)
  },

  cardProject: {
    height: 166,
    width: width / 2 - 26,
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: moderateScale(8),
    justifyContent: "space-between",
    padding: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  coverImgCard: {
    height: 40,
    width: 40,
    backgroundColor: "#323F6B",
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center"
  },
  imgIconCard: { height: 20, width: 20 },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  titleCard: {
    fontWeight: "bold",
    color: "black"
  },
  descCard: {
    color: "#A19F9F",
    fontSize: moderateScale(8),
    marginTop: moderateScale(5)
  },
  createdAtCard: {
    fontSize: moderateScale(8),
    color: "#A19F9F"
  },
  containerLoading: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(24)
  },
  contentNoData: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(24)
  }
});
