// import * as React  from 'react';

// import {
//     Text,
//     View,
//     Image,
//     Platform,
//     StyleSheet,
//     Dimensions,
//     TouchableOpacity,
// } from 'react-native';

// // Import Asset
// import IconBack from './../../assets/image/icon_back.svg';
// import ImageAvatar from './../../assets/avatar_customer_big.png';

// // Import Asset
// import IconChannelLine from './../../assets/image/icon_channel_line.svg';
// import IconChannelOwnapp from './../../assets/image/icon_channel_ownapp.svg';
// import IconChannelWebchat from './../../assets/image/icon_channel_webchat.svg';
// import IconChannelWhatsapp from './../../assets/image/icon_channel_whatsapp.svg';
// import IconChannelTelegram from './../../assets/image/icon_channel_telegram.svg';

// // Import Third Party
// import {Header, Avatar} from 'react-native-elements';

// const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';
// const dimenWidht = Dimensions.get('screen').width;
// const dimenHeight = Dimensions.get('screen').height;

// const ProfileOption = ({ navigation }) => {

//     const HeaderComponent = () => {
//         return (
//             <Header
//                 placement="left"
//                 centerComponent={() => {
//                     return (
//                         <View style={{width: '100%'}}>
//                             <View style={{flexDirection: 'row', alignItems: 'center', width: '82%', height: 43}}>
//                                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                                     <IconBack />
//                                 </TouchableOpacity>
//                                 <Text
//                                     style={{
//                                         marginLeft: 6,
//                                         color: '#000',
//                                         fontSize: 24,
//                                         fontWeight: 'bold',
//
//                                         textTransform: 'uppercase'
//                                     }}
//                                 >
//                                     Profile
//                                 </Text>

//                             </View>
//                         </View>
//                     )
//                 }}
//                 containerStyle={{
//                     height: 88,
//                     paddingTop: 5,
//                     marginHorizontal: -12,
//                     backgroundColor: '#FFF',
//                     justifyContent: 'center',
//                     borderBottomColor: '#fff'
//                 }}
//             />

//         )
//     }

//     return (
//         <View style={[styles.container, {backgroundColor: '#fff'}]}>
//             <HeaderComponent />
//             <View style={styles.container}>
//                 <View
//                     style={{
//                         flexDirection: 'row',
//                         marginTop: 20,
//                         justifyContent: 'space-around'
//                     }}
//                 >
//                     <Image
//                         source={ImageAvatar}
//                         style={{
//                             width: 120,
//                             height: 120,

//                         }}
//                     />
//                     <View>
//                         <Text
//                             style={{
//                                 fontSize: 24,
//                                 color: '#000',
//                                 lineHeight: 24,
//                                 marginBottom: 8,
//                                 letterSpacing: 0.1,
//                                 fontWeight: 'normal',
//
//                                 textTransform: 'capitalize',
//                             }}
//                         >
//                             Ronald Aryanto
//                         </Text>
//                         <Text
//                             style={{
//                                 fontSize: 14,
//                                 lineHeight: 24,
//                                 marginBottom: 24,
//                                 color: '#979797',
//                                 letterSpacing: 0.1,
//                                 fontWeight: 'normal',
//
//                                 textTransform: 'capitalize',
//                             }}
//                         >
//                             ronaldaryanto@email.com
//                         </Text>
//                         <TouchableOpacity
//                             style={{
//                                 borderRadius: 8,
//                                 paddingVertical: 10,
//                                 paddingHorizontal: 20,
//                                 backgroundColor: '#1A8FDD'
//                             }}
//                         >
//                             <Text
//                                 style={{
//                                     fontSize: 16,
//                                     color: '#fff',
//                                     lineHeight: 17,
//                                     alignSelf: 'center',
//                                     fontWeight: 'normal',
//
//                                     textTransform: 'capitalize',
//                                 }}
//                             >
//                                 Sales Team 01
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <View
//                     style={{
//                         width: dimenWidht-60,
//                         marginHorizontal: 30,
//                         marginTop: 53
//                     }}
//                 >
//                     <Text
//                         style={{
//                             fontSize: 12,
//                             color: '#000',
//                             lineHeight: 24,
//                             marginBottom: 8,
//                             letterSpacing: 0.1,
//                             fontWeight: 'bold',
//
//                             textTransform: 'uppercase',
//                         }}
//                     >
//                         Channels
//                     </Text>

//                     <View
//                         style={{
//                             width: '80%',
//                             flexDirection: 'row',
//                             justifyContent: 'space-around'
//                         }}
//                     >
//                         <IconChannelWhatsapp width={40} height={40}/>
//                         <IconChannelLine width={38} height={38}/>
//                         <IconChannelTelegram width={36} height={36}/>
//                         <IconChannelWebchat width={38} height={36}/>
//                         <IconChannelOwnapp width={40} height={34}/>
//                     </View>
//                 </View>

//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     },
// });

// export default ProfileOption;

import * as React from "react";

import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";

// Import Asset
import IconBack from "./../../assets/image/icon_back.svg";

// Import Asset
import CodingTwoColor from "./../../assets/image/coding__two_color.svg";

// Import Third Party
import { Header, Avatar } from "react-native-elements";
import { moderateScale } from "../other/Scaling";

const textFontHK = Platform.OS == "ios" ? "HK Grotesk" : "HKGrotesk-Regular";
const dimenWidht = Dimensions.get("screen").width;
const dimenHeight = Dimensions.get("screen").height;

const ProfileOption = ({ navigation }) => {
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
                  <IconBack />
                </TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 6,
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "##4F4F4F",

                    textTransform: "uppercase"
                  }}
                >
                  Back to the real world
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderComponent />
      <View style={styles.container}>
        <CodingTwoColor />
        <Text
          style={{
            fontSize: moderateScale(28),
            color: "#A5A5A5",
            fontStyle: "normal",
            fontWeight: "500"
          }}
        >
          Hang on!
        </Text>
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
          This page is still under development.
        </Text>
        <Text
          style={{
            marginVertical: moderateScale(4),
            fontSize: moderateScale(18),
            textAlign: "center",
            color: "#A5A5A5",
            fontStyle: "normal",
            fontWeight: "500"
          }}
        >
          It will be ready very soon!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: moderateScale(20)
  }
});

export default ProfileOption;
