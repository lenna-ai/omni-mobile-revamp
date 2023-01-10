import * as React from "react";

import {
  Text,
  View,
  Platform,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

// Internal Import
import API from "./../../../utils/api";
import { encodeHashIds } from "../../../utils/encode";
import { imageIconBack } from "../../../assets/icons";
import { postDataOutHeader, getData } from "../../../modules/services";
// import { AlertToastSuccess, AlertToastFailed } from '../../other/AlertToast';

// Import Third Party
import { moderateScale } from "./../../other/Scaling";
import { useSelector, useDispatch } from "react-redux";
import { Header, CheckBox } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { changeAppConfiguration } from "../../../modules/redux/actions/appConfiguration/inAppConfigruration";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";
const dimenWidht = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const AppConfiguration = ({ navigation }) => {
  const dispatch = useDispatch();

  const disUser = useSelector(state => state.mDataUserLogin);
  let dataUser = disUser.dataUserWasLogin;

  const disAppConfig = useSelector(state => state.mAppConfiguration);
  let dataAppConfig = disAppConfig.dataAppConfiguration;

  const toastFailed = React.useRef(null);
  const toastSuccess = React.useRef(null);

  const [appName, setAppName] = React.useState("");
  const [appDesc, setAppDesc] = React.useState("");
  const [maxChatPerAgent, setMaxChatPerAgent] = React.useState("");
  const [autoResolveTime, setAutoResolveTime] = React.useState("");
  const [autoResolveMessage, setAutoResolveMessage] = React.useState("");
  const [autoAgentAllocation, setAutoAgentAllocation] = React.useState(false);
  const [approvalAssignAgent, setApprovalAssignAgent] = React.useState(false);
  const [autoResolveLivechat, setAutoResolveLivechat] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (dataAppConfig == null) {
      getDataApp(dataUser.app_id);
    } else {
      let data = dataAppConfig.app;
      setAppName(data.name);
      setAppDesc(data.description);
      setMaxChatPerAgent("" + data.settings.max_livechat);
      setAutoResolveTime("" + data.auto_resolve_time);
      setAutoResolveMessage(data.auto_resolve_message);
      setAutoAgentAllocation(data.agent_allocation_automation);
      setApprovalAssignAgent(data.approval_agent);
      setAutoResolveLivechat(data.auto_resolve);
    }
  }, []);

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
      if (data.success) {
        dispatch(changeAppConfiguration(data.data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const goBack = () => {
    navigation.goBack();
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
                  width: "82%",
                  height: 43
                }}
              >
                <TouchableOpacity onPress={() => goBack()}>
                  {imageIconBack(moderateScale(24), moderateScale(24))}
                </TouchableOpacity>
                <Text
                  numberOfLines={1}
                  style={{
                    maxWidth: moderateScale(200),
                    marginLeft: 6,
                    color: "#000",
                    fontSize: 24,
                    fontWeight: "bold",

                    textTransform: "uppercase"
                  }}
                >
                  App Configuration
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

  const onChangeAppName = txt => {
    setAppName(txt);
  };

  const onChangeAppDesc = txt => {
    setAppDesc(txt);
  };

  const onChangeMaxChatPerAgent = txt => {
    setMaxChatPerAgent(txt);
  };

  const onChangeAutoResolveTime = txt => {
    setAutoResolveTime(txt);
  };

  const onChangeAutoResolveMessage = txt => {
    setAutoResolveMessage(txt);
  };

  const onSaveChanges = async () => {
    if (
      appName != "" &&
      appDesc != "" &&
      maxChatPerAgent != "" &&
      autoResolveTime != "" &&
      autoResolveMessage != ""
    ) {
      let data = dataAppConfig.app;
      if (
        appName != data.name ||
        appDesc != data.description ||
        autoAgentAllocation != data.agent_allocation_automation ||
        approvalAssignAgent != data.approval_agent ||
        autoResolveLivechat != data.auto_resolve ||
        autoResolveMessage != data.auto_resolve_message ||
        autoResolveTime != data.auto_resolve_time ||
        maxChatPerAgent != data.settings.max_livechat
      ) {
        setIsLoading(true);
        let headers = {
          token: dataUser.token,
          userId: encodeHashIds(dataUser.user_id)
        };
        let settings = {
          max_livechat: maxChatPerAgent,
          always_allow_livechat: false
        };
        let params = {
          name: appName,
          description: appDesc,
          agent_allocation_automation: autoAgentAllocation,
          approval_agent: approvalAssignAgent,
          auto_resolve: autoResolveLivechat,
          auto_resolve_message: autoResolveMessage,
          auto_resolve_time: autoResolveTime,
          settings: settings,
          created_at: dataAppConfig.app.created_at
        };
        try {
          let res = await postDataOutHeader(
            API.PATH + encodeHashIds(dataUser.app_id) + "/app",
            params,
            headers
          );
          if (res.success) {
            dispatch(changeAppConfiguration(res.data));
            setIsLoading(false);
            toastSuccess.current.show(res.message, 1000);
          } else {
            setIsLoading(false);
            toastFailed.current.show(res.message, 1000);
          }
        } catch (error) {
          // console.log(error);
          setIsLoading(false);
          toastFailed.current.show(
            "Terjadi kendala teknis, Harap coba lagi!!",
            1000
          );
        }
      } else {
        setIsLoading(false);
        toastFailed.current.show(
          "Data tidak ada perubahan dari sebelumnya!!",
          1000
        );
      }
    } else {
      setIsLoading(false);
      toastFailed.current.show("Harap isi field dengan benar!!", 1000);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderComponent />
      <View style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingTop: moderateScale(32),
            paddingHorizontal: moderateScale(24)
          }}
        >
          <View style={styles.containContainerInput}>
            <Text style={styles.textContainInput}>App Name</Text>
            <View style={styles.containInput}>
              <TextInput
                value={appName}
                keyboardType="default"
                style={styles.textInput}
                onChangeText={appName => onChangeAppName(appName)}
              />
            </View>
            {appName == ""
              ? <Text style={styles.textContainField}>
                  App name field is required
                </Text>
              : null}
          </View>
          <View style={styles.containContainerInput}>
            <Text style={styles.textContainInput}>App Description</Text>
            <View style={styles.containInput}>
              <TextInput
                value={appDesc}
                keyboardType="default"
                style={styles.textInput}
                onChangeText={appDesc => onChangeAppDesc(appDesc)}
              />
            </View>
            {appDesc == ""
              ? <Text style={styles.textContainField}>
                  App description field is required
                </Text>
              : null}
          </View>
          <View style={styles.containContainerInput}>
            <CheckBox
              title="Auto agent allocation"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={autoAgentAllocation}
              onPress={() => setAutoAgentAllocation(!autoAgentAllocation)}
            />
          </View>
          <View style={styles.containContainerInput}>
            <CheckBox
              title="Approval assign agent"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={approvalAssignAgent}
              onPress={() => setApprovalAssignAgent(!approvalAssignAgent)}
            />
          </View>
          <View style={styles.containContainerInput}>
            <Text style={styles.textContainInput}>Maximum chat per agent</Text>
            <View style={styles.containInput}>
              <TextInput
                value={maxChatPerAgent}
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={maxChatPerAgent =>
                  onChangeMaxChatPerAgent(maxChatPerAgent)}
              />
            </View>
            {maxChatPerAgent == ""
              ? <Text style={styles.textContainField}>
                  Maximum chat per agent field is required
                </Text>
              : null}
          </View>
          <View style={styles.containContainerInput}>
            <CheckBox
              title="Auto resolve livechat"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={autoResolveLivechat}
              onPress={() => setAutoResolveLivechat(!autoResolveLivechat)}
            />
          </View>
          <View style={styles.containContainerInput}>
            <Text style={styles.textContainInput}>Auto resolve time</Text>
            <View style={styles.containInput}>
              <TextInput
                value={autoResolveTime}
                keyboardType="numeric"
                style={styles.textInput}
                onChangeText={autoResolveTime =>
                  onChangeAutoResolveTime(autoResolveTime)}
              />
            </View>
            {autoResolveTime == ""
              ? <Text style={styles.textContainField}>
                  Auto resolve time field is required
                </Text>
              : null}
          </View>
          <View style={styles.containContainerInput}>
            <Text style={styles.textContainInput}>Auto resolve message</Text>
            <View style={styles.containInput}>
              <TextInput
                value={autoResolveMessage}
                multiline={true}
                keyboardType="default"
                style={styles.textInputMulti}
                onChangeText={autoResolveMessage =>
                  onChangeAutoResolveMessage(autoResolveMessage)}
              />
            </View>
            {autoResolveMessage == ""
              ? <Text style={styles.textContainField}>
                  Auto resolve message field is required
                </Text>
              : null}
          </View>

          {isLoading
            ? <View style={styles.bottomSaveChanges}>
                <ActivityIndicator size="small" color="#ffffff" />
              </View>
            : <TouchableOpacity
                onPress={() => onSaveChanges()}
                style={styles.bottomSaveChanges}
              >
                <Text style={styles.textBottomSaveChanges}>Save Changes</Text>
              </TouchableOpacity>}
        </KeyboardAwareScrollView>
      </View>

      {/* <AlertToastSuccess toastSuccess={toastSuccess} />
            <AlertToastFailed toastFailed={toastFailed}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containContainerInput: {
    marginVertical: moderateScale(8)
  },
  textContainInput: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",

    marginLeft: moderateScale(12),
    marginBottom: moderateScale(8)
  },
  containInput: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: moderateScale(4),
    backgroundColor: "transparent"
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000006",
    backgroundColor: "transparent",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(13)
  },
  textInputMulti: {
    borderBottomWidth: 0.5,
    textAlignVertical: "top",
    minHeight: dimenHeight / 7,
    borderBottomColor: "#000006",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(13)
  },
  textContainField: {
    color: "#e3342f",
    fontWeight: "bold",

    fontSize: moderateScale(10),
    marginLeft: moderateScale(12),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(4)
  },
  bottomSaveChanges: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: moderateScale(44),
    backgroundColor: "#2889C6",
    borderRadius: moderateScale(8),
    marginTop: moderateScale(38),
    marginBottom: moderateScale(62)
  },
  textBottomSaveChanges: {
    color: "#fff",
    fontWeight: "bold",

    fontSize: moderateScale(14),
    lineHeight: moderateScale(22)
  }
});

export default AppConfiguration;
