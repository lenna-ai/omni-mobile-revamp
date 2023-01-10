import React from "react";
import OnBoard from "./../../feature/onBoard";
import Login from "./../../feature/login";
import LoginEmail from "../../feature/login/LoginEmail";
import chooseChannel from "../../feature/chooseChannel";

import Home from "./../../feature/tabsScreen/home";
import AboutApp from "./../../feature/about";
import chatRoom from "./../../feature/chatRoom";
import SettingsOption from "./../../feature/setting";
import AppConfiguration from "./../../feature/setting/components/AppConfiguration";
import AppContentSetting from "./../../feature/setting/components/AppContentSetting";
import AutoResponseAndOfficeHour from "./../../feature/setting/components/AutoResponseAndOfficeHour";
import CustomerBlocker from "./../../feature/setting/components/CustomerBlocker";
import GeneralValue from "./../../feature/setting/components/GeneralValue";
import GroupManagement from "./../../feature/setting/components/GroupManagement";
import Integration from "./../../feature/setting/components/Integration";
import MessageTemplate from "./../../feature/setting/components/MessageTemplate";
import PPOBProduct from "./../../feature/setting/components/PPOBProduct";
import ItemGeneralAnaly from "./../../feature/tabsScreen/analytics/components/childComponent/ItemGeneralAnaly";
import ProfileSetting from "./../../feature/setting/components/profileSetting";
import TagsConfiguration from "./../../feature/setting/components/TagsConfiguration";
import TeamManagement from "./../../feature/setting/components/TeamManagement";
import ProfileOption from "./../../feature/pages/ProfileOption";
import Profile from "./../../feature/profile/index";
import AssignToTeam from "./../../feature/assignToTeam";
import ShowImageZoom from "../../feature/showImageZoom";
import channelRooms from "./../../feature/tabsScreen/channelRooms";
import WithoutProfile from "../../feature/tabsScreen/morePlus";
import Analytics from "./../../feature/tabsScreen/analytics";


import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "./navigationContext";
import { changeIsOpen } from "../redux/actions/other/inBSNavigationPlus";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { moderateScale } from "../../feature/other/Scaling";
import {
  onChooseActive,
  onChooseChannel,
  onLogin,
  onOnBoard
} from "../redux/actions/inNavigation";
import {
  imageIconLineActive,
  imageIconHomeActive,
  imageIconLineInActive,
  imageIconHomeInActive,
  imageIconDashboardActive,
  imageIconPluCirclInactive,
  imageIconChatpanelInactive,
  imageIconDashboardInActive,
} from "./../../assets/icons";


const Tabs = createBottomTabNavigator();
const WasLogin = createStackNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const OnBoardStack = createStackNavigator();
const ChooseChannelStack = createStackNavigator();
const HomeStack = createStackNavigator();
const AnalyticsStack = createStackNavigator();
const ChatsStack = createStackNavigator();
const MoreOptionStach = createStackNavigator();

const AppContainer = () => {
  const dispatch = useDispatch();

  const disNav = useSelector(state => state.mDataNavigation);
  const disUser = useSelector(state => state.mDataUserLogin);
  let containUser = disUser.dataUserWasLogin;
  dataNav = () => {
    dispatch(changeIsOpen(true));
  };

  if (Object.keys(containUser).length != 0) {
    if (containUser.role != null) {
      isAnalytics = containUser.role.name != "Staff" ? true : false;
    } else {
      isAnalytics = false;
    }
  } else {
    isAnalytics = false;
  }

  let isBoard = disNav.isOnBoard;
  let userToken = disNav.isLogin;
  let changeChannel = disNav.isChooseChannel;

  const authContext = React.useMemo(
    () => ({
      boardFun: () => {
        dispatch(onOnBoard(true));
      },
      signIn: () => {
        dispatch(onLogin(true));
        dispatch(onChooseChannel(false));
      },
      onChangeChannel: () => {
        dispatch(onChooseActive(true));
        dispatch(onChooseChannel(true));
        dispatch(onLogin(false));
      },
      signOut: () => {
        dispatch(onLogin(false));
        dispatch(onChooseActive(false));
        dispatch(onChooseChannel(false));
      }
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen
          isBoard={isBoard}
          userToken={userToken}
          changeChannel={changeChannel}
        />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const RootStackScreen = ({ isBoard, userToken, changeChannel }) =>
  <RootStack.Navigator>
    {isBoard
      ? userToken
        ? <RootStack.Screen
            name="WasLogin"
            component={WasLoginStackScreen}
            options={{
              headerShown: false
            }}
          />
        : changeChannel
          ? <RootStack.Screen
              name="ChooseChannels"
              component={ChooseChannelStackScreen}
              options={{
                headerShown: false
              }}
            />
          : <RootStack.Screen
              name="Auth"
              component={AuthStackScreen}
              options={{
                headerShown: false,
                animationEnabled: false
              }}
            />
      : <RootStack.Screen
          name="OnBoard"
          component={OnBoardStackScreen}
          options={{
            headerShown: false,
            animationEnabled: false
          }}
        />}
  </RootStack.Navigator>;

const AuthStackScreen = () =>
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Login"
      component={Login}
      options={{
        headerShown: false,
        animationEnabled: false
      }}
    />
    <AuthStack.Screen
      name="LoginEmail"
      component={LoginEmail}
      options={{
        headerShown: false,
        animationEnabled: false
      }}
    />
  </AuthStack.Navigator>;

const OnBoardStackScreen = () =>
  <OnBoardStack.Navigator>
    <OnBoardStack.Screen
      name="Onboard"
      component={OnBoard}
      options={{
        headerShown: false,
        animationEnabled: false
      }}
    />
  </OnBoardStack.Navigator>;

const WasLoginStackScreen = () =>
  <WasLogin.Navigator>
    <WasLogin.Screen
      name="Tabs"
      component={TabsScreen}
      options={{
        headerShown: false
      }}
    />
    <WasLogin.Screen
      name="About"
      component={AboutApp}
      options={{ headerShown: false }}
    />
    <WasLogin.Screen
      name="Chat"
      component={chatRoom}
      options={{ headerShown: false }}
    />
    <WasLogin.Screen
      name="SettingsOption"
      component={SettingsOption}
      options={{ headerShown: false }}
    />

     <WasLogin.Screen
      name="AppConfiguration"
      component={AppConfiguration}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="AppContentSetting"
      component={AppContentSetting}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="AutoResponseAndOfficeHour"
      component={AutoResponseAndOfficeHour}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="CustomerBlocker"
      component={CustomerBlocker}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="GeneralValue"
      component={GeneralValue}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="GroupManagement"
      component={GroupManagement}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="Integration"
      component={Integration}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="MessageTemplate"
      component={MessageTemplate}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="PPOBProduct"
      component={PPOBProduct}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="ItemGeneralAnaly"
      component={ItemGeneralAnaly}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="ProfileSetting"
      component={ProfileSetting}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="TagsConfiguration"
      component={TagsConfiguration}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="TeamManagement"
      component={TeamManagement}
      options={{ headerShown: false }}
    />

    <WasLogin.Screen
      name="ProfileOption"
      component={ProfileOption}
      options={{ headerShown: false }}
    />
    <WasLogin.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <WasLogin.Screen
      name="AssignToTeam"
      component={AssignToTeam}
      options={{ headerShown: false }}
    />
    <WasLogin.Screen
      name="ImageZoom"
      component={ShowImageZoom}
      options={{ headerShown: false }}
    />
  </WasLogin.Navigator>;

const ChooseChannelStackScreen = () =>
  <ChooseChannelStack.Navigator>
    <ChooseChannelStack.Screen
      name="ChooseChannel"
      component={chooseChannel}
      options={{
        headerShown: false,
        animationEnabled: false
      }}
    />
  </ChooseChannelStack.Navigator>;

const TabsScreen = () => (
  <Tabs.Navigator
    initialRouteName="Home"
    screenOptions={{
      showLabel: false,
      activeTintColor: "#1E1F20",
      inactiveTintColor: "#FFFFFF",
      style: {
        paddingHorizontal: 28,
        height: 65,
      },
      headerShown: false
    }}
  >
    <Tabs.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <>
            {color == "#1E1F20" ? (
              <>
                {imageIconHomeActive(moderateScale(24), moderateScale(24))}
                {imageIconLineActive(moderateScale(24), moderateScale(3))}
              </>
            ) : (
              <>
                {imageIconHomeInActive(moderateScale(24), moderateScale(24))}
                {imageIconLineInActive(moderateScale(24), moderateScale(3))}
              </>
            )}
          </>
        ),
      }}
    />
    {isAnalytics ? (
      <Tabs.Screen
        name="Analytics"
        component={AnalyticsStackScreen}
        options={{
          tabBarVisible: false,
          tabBarIcon: ({ color, size }) => (
            <>
              {color == "#1E1F20" ? (
                <>
                  {imageIconDashboardActive(
                    moderateScale(24),
                    moderateScale(24)
                  )}
                  {imageIconLineActive(moderateScale(24), moderateScale(3))}
                </>
              ) : (
                <>
                  {imageIconDashboardInActive(
                    moderateScale(24),
                    moderateScale(24)
                  )}
                  {imageIconLineInActive(moderateScale(24), moderateScale(3))}
                </>
              )}
            </>
          ),
        }}
      />
    ) : null}
    <Tabs.Screen
      name="Chats"
      component={ChatsStackScreen}
      options={{
        tabBarVisible: false,
        tabBarIcon: ({ color, size }) => (
          <>
            {imageIconChatpanelInactive(moderateScale(24), moderateScale(24))}
            {imageIconLineInActive(moderateScale(24), moderateScale(3))}
          </>
        ),
      }}
    />
    <Tabs.Screen
      name="MoreOption"
      component={MoreOptionStachScreen}
      options={{
        tabBarIcon: () => (
          <>
            {imageIconPluCirclInactive(moderateScale(24), moderateScale(24))}
            {imageIconLineInActive(moderateScale(24), moderateScale(3))}
          </>
        ),
      }}
      listeners={({ navigation, route }) => ({
        tabPress: (e) => {
          // Prevent default action
          e.preventDefault();
          navigation.jumpTo("Home");
          dataNav();
        },
      })}
    />
  </Tabs.Navigator>
);
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={Home}
      options={{
        headerShown: false,
        animationEnabled: false,
      }}
    />
  </HomeStack.Navigator>
);
const AnalyticsStackScreen = () => (
  <AnalyticsStack.Navigator>
    <AnalyticsStack.Screen
      name="Analytics"
      component={Analytics}
      options={{
        headerShown: false,
        animationEnabled: false,
      }}
    />
  </AnalyticsStack.Navigator>
)
const ChatsStackScreen = () => (
  <ChatsStack.Navigator>
    <ChatsStack.Screen
      name="Chats"
      component={channelRooms}
      options={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    />
  </ChatsStack.Navigator>
);
const MoreOptionStachScreen = () => (
  <MoreOptionStach.Navigator>
    <MoreOptionStach.Screen
      name="WithoutProfile"
      component={WithoutProfile}
      options={{
        headerShown: false,
        animationEnabled: false,
      }}
    />
  </MoreOptionStach.Navigator>
);

export default AppContainer;

const styles = StyleSheet.create({});
