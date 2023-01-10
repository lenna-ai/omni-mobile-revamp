import * as React from "react";

import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";

//Import Internal
import API from "./../../utils/api";
import { getData } from "./../../modules/services";
import { encodeHashIds } from "./../../utils/encode";

//Import Asset
import IconBack from "./../../assets/image/icon_back.svg";
import LoadingBig from "./../../assets/anime/loading_big.gif";

//Import External
import { useSelector } from "react-redux";
import { Header } from "react-native-elements";
import { moderateScale } from "../other/Scaling";

const dimenWidth = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;
const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";

const SettingsOption = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [listNameSetting, setListNameSetting] = React.useState([]);
  const [listDataSetting, setListDateSetting] = React.useState([]);
  const [listSettings, setListSettings] = React.useState([]);
  console.log("listNameSetting => ", listNameSetting);

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsLoading(true);
      getAllSettings();
    });
    return unsubscribe;
  }, navigation);

  const getUnique = (arr, index) => {
    const unique = arr
      .map(e => e[index])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => arr[e])
      .map(e => arr[e]);

    return unique;
  };

  const getAllSettings = async () => {
    let headers = {
      token: dataUser.token,
      userId: encodeHashIds(dataUser.user_id)
    };

    try {
      let dataSet = undefined;
      let data = await getData(
        API.PATH + encodeHashIds(dataUser.app_id) + "/v3/accessibility",
        headers
      );
      console.log("RESPONSE => ", data);
      if (data.success) {
        dataSet = data.data.menu.find(function(entry) {
          return entry.id == 6;
        });
        if (dataSet != undefined) {
          setListDateSetting(dataSet.submenus);
          let dataRemoveDuplikat = getUnique(dataSet.submenus, "sub_submenu");
          setListNameSetting(dataRemoveDuplikat);
          console.log("dataSet.submenus", dataSet.submenus);
          setIsLoading(false);
        }
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const headerComponent = () => {
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
                  width: "82%",
                  height: 43
                }}
              >
                <TouchableOpacity onPress={() => goBack()}>
                  <IconBack />
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
                  Settings
                </Text>
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

  const goToDinamisPage = item => {
    let dataNav = item.replace(/\s/g, "");
    if (dataNav == "AppContent") {
      navigation.navigate("AppContentSetting");
    } else if (dataNav == "AutoResponse&OfficeHour") {
      navigation.navigate("AutoResponseAndOfficeHour");
    } else {
      navigation.navigate(dataNav);
    }
    // console.log("dataNav",dataNav);
  };

  const renderData = (item, index) => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginTop: moderateScale(6),
          marginBottom: moderateScale(10),
          width: dimenWidth / 2 - moderateScale(24)
        }}
      >
        <TouchableOpacity
          onPress={() => goToDinamisPage(item.name)}
          style={{
            backgroundColor: "#f2f2f2",
            borderRadius: moderateScale(10),
            marginTop: moderateScale(5),
            justifyContent: "center",
            alignItems: "center",
            width: moderateScale(120),
            height: moderateScale(120),
            padding: moderateScale(10)
          }}
        >
          <Image
            style={{
              width: moderateScale(40),
              height: moderateScale(40),
              marginTop: moderateScale(3)
            }}
            source={{ uri: "https://dev.lenna.ai/app/public/" + item.icon }}
          />
          <Text
            numberOfLines={2}
            style={{
              fontSize: 12,
              textAlign: "center",

              textTransform: "capitalize",
              marginTop: moderateScale(10)
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDataFirst = (item, index) => {
    let dataSetting = listDataSetting.filter(function(entry) {
      return entry.sub_submenu == item.sub_submenu;
    });
    return (
      <View
        style={{
          marginVertical: moderateScale(8),
          marginHorizontal: moderateScale(24)
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#A0A4A8",
            fontWeight: "bold",

            textTransform: "uppercase",
            marginVertical: moderateScale(10)
          }}
        >
          {item.sub_submenu}
        </Text>
        <FlatList
          style={{
            flexDirection: "column"
          }}
          numColumns={2}
          data={dataSetting}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => renderData(item, index)}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: "#fff" }]}>
      {headerComponent()}
      <View style={styles.container}>
        {isLoading
          ? <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff"
              }}
            >
              <Image
                style={{ height: 80, width: 80 }}
                resizeMode="contain"
                source={LoadingBig}
                autoPlay
              />
            </View>
          : <FlatList
              contentContainerStyle={{
                paddingBottom: 10
              }}
              horizontal={false}
              numColumns={1}
              data={listNameSetting}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => renderDataFirst(item, index)}
            />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default SettingsOption;
