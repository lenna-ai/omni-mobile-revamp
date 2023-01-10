import * as React from 'react';

//Import Packeage
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//Import File Page
import Scan from './../../feature/pages/Scan';
import Login from './../../feature/pages/Login';
import All from '../../feature/pages/ChatPanel';
import Profile from './../../feature/pages/Profile';
import OnBoard from './../../feature/pages/OnBoard';
import ChatRoom from './../../feature/pages/ChatRoom';


const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ChatStack = createStackNavigator();
const AnalyticsStack = createStackNavigator();

const TabsScrean = () => {
  
}

const Stack = createStackNavigator();

const AppContainer = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator 
            initialRouteName="OnBoard"
            screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
          <Stack.Screen 
              name="OnBoard" 
              component={OnBoard}
              options={{headerShown: false}}
          />
          <Stack.Screen 
              name="Scan" 
              component={Scan}
              options={{headerShown: false}}
          />
          <Stack.Screen 
              name="Inbox"
              component={All}
              options={{headerShown: false}}
          />
          <Stack.Screen 
              name="Chat"
              component={ChatRoom}
              options={{headerShown: false}}
          />
          <Stack.Screen 
              name="Login"
              component={Login}
              options={{headerShown: false}}
          />
          <Stack.Screen 
              name="Profile"
              component={Profile}
              options={{headerShown: false}}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppContainer;