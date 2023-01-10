// import * as React  from 'react';

// import {
//     Text,
//     View,
//     Image,
//     FlatList,
//     Platform,
//     StyleSheet,
//     Dimensions,
//     TouchableOpacity,
//     ActivityIndicator,
// } from 'react-native';

// //Import Internal
// import API from './../../../utils/api';
// import { getValue } from '../../../modules/localData';
// import { encodeHashIds } from './../../../utils/encode';
// import { Loading } from '../../components/Other/Loading';
// import IconBell from './../../../assets/image/icon_bell.svg';
// import IconOwnapp from './../../../assets/image/icon_ownapp.svg';
// import IconChatbot from './../../../assets/image/icon_chatbot.svg';
// import IconWebChat from './../../../assets/image/icon_webchat.svg';
// import IconTelegram from './../../../assets/image/icon_telegram.svg';
// import IconWhatsapp from './../../../assets/image/icon_whatsapp.svg';
// import IconLitechat from './../../../assets/image/icon_litechat.svg';
// import ImageCarousel2 from './../../../assets/image/image_carousel2.svg';
// import ImageCarousel1 from './../../../assets/image/image_carousel1.svg/';
// import IconFbmessenger from './../../../assets/image/icon_fbmessenger.svg';
// import { getDataWithBody, postDataOutHeader } from '../../../modules/services';
// import { addDataRoomReq, addDataUserLogin } from './../../../modules/redux/actions/inHome';
// import IllustrationNoInquiries from './../../../assets/image/illustration_no_inquiries.svg';

// //Import External
// import { useDispatch, useSelector } from 'react-redux';

// const dimenWidth = Dimensions.get("screen").width;
// const dimenHeight = Dimensions.get("screen").height;
// const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';

// const Home = ({ navigation }) => {

//     const dispatch = useDispatch();
//     const disRoomReq = useSelector((state) => state.mDataChatsReq);

//     let dataRoomsReq = disRoomReq.data;
//     let dataUserLogin = disRoomReq.dataUserLogin;

//     const [nameHome, setNameHome] = React.useState("");
//     const [dataRole, setDataRole] = React.useState("");
//     const [loading, setLoading] = React.useState(false);
//     const [isLoading, setIsLoading] = React.useState(false);

//     React.useEffect(() => {
//         setLoading(true);
//         setIsLoading(true);
//         getDataUser();
//     }, []);

//     const getDataRoomReq = async(data) => {
//         try {
//             let params = {
//                 status: "request",
//             }
//             setDataRole(data.role.name);
//             let res = await getDataWithBody(
//                 API.PATH + encodeHashIds(data.app_id) + '/room/get-room-list-new',
//                 params
//             );
//             console.log("PARAMS_REQ_ROOM_HOME", res);
//             if (res.data != undefined || res.data.length != 0) {
//                 dispatch(addDataRoomReq(res.data));
//             }
//             setLoading(false);
//         } catch (e) {
//             console.log(e);
//         }
//     }

//     const getDataCountRoom = async(data) => {
//         let dataParams = undefined;
//         if (data.role.name == 'Staff') {
//             dataParams = data.user_id
//         } else {
//             dataParams = {};
//         }
//         try {
//             let params = {
//                 userId: dataParams,
//             }
//             dispatch(addDataUserLogin(data));

//             let res = await postDataOutHeader(
//                 API.PATH + encodeHashIds(data.app_id) + '/room/get-count-room-by-status',
//                 params
//             );
//             console.log("PARAMS_COUNT_ROOM", res);
//             setIsLoading(false);
//         } catch (e) {
//             console.log(e);
//         }
//     }

//     const getDataUser = async() => {

//         try {
//             let data = await getValue("DATA_LOGIN");
//             setTimeout(() => {
//                 getDataRoomReq(data);
//             }, 1000);

//             setTimeout(() => {
//                 console.log("DATA_SER_LOGIN", dataUserLogin);
//             }, 2000);
//         } catch (e) {
//             console.log(e);
//         }
//     }

//     const dataListCarousel = [
//         {
//             color: '#BA77E6',
//             image: <ImageCarousel1 width={dimenWidth/3} height={100} />,
//             title: 'The Store is Open',
//             subTitle: 'Office Hour',
//             time: '08.00 - 17.00'
//         },
//         {
//             color: '#60327E',
//             image: <ImageCarousel2 width={134} height={100} />,
//             title: 'The Store is Close',
//             subTitle: 'Office Hour',
//             time: '08.00 - 17.00'
//         }
//     ];

//     const renderDataNew = ({item, index}) => {
//         let picture = {uri: 'https://dev.lenna.ai/app/public/images/pictures/no_avatar.jpg'};
//         return (
//             <View>
//                 <View
//                     style={{
//                         width: dimenWidth-48,
//                         backgroundColor: index != 0 ? '#c4c4c4' : '#00000000',
//                         marginBottom: 10
//                     }}
//                 />

//                 <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
//                     <View style={{flexDirection: 'row', alignItems: 'center', width: 80, justifyContent: 'space-between', marginRight: 16}}>
//                         {
//                             item.channel != null || item.channel != undefined
//                             ?
//                                 item.channel.name == 'webchat'
//                                 ? <IconWebChat width={32} height={32} />
//                                 : item.channel.name == 'whatsapp'
//                                 ? <IconWhatsapp width={32} height={32} />
//                                 : item.channel.name == 'telegram'
//                                 ? <IconTelegram width={32} height={32} />
//                                 : item.channel.name == 'mobile'
//                                 ? <IconOwnapp width={32} height={32} />
//                                 : item.channel.name == 'facebook'
//                                 ? <IconFbmessenger width={32} height={32} />
//                                 : item.channel.name == 'line'
//                                 ? <IconLine width={32} height={32} />
//                                 : item.channel.name == 'litechat'
//                                 ? <IconLitechat width={32} height={32} />
//                                 : <IconChatbot width={32} height={32} />
//                             : null
//                         }
//                         <Image source={picture} style={{width: 40, height: 40, borderRadius: 40/2 }} />
//                     </View>
//                     <View>
//                         <Text
//                             numberOfLines={1}
//                             style={{
//                                 fontSize: 14,
//                                 color: '#2E3034',
//                                 fontWeight: 'bold',

//                                 textTransform: 'capitalize'
//                             }}
//                         >
//                             {item.created_by.name}
//                         </Text>
//                         <Text
//                             numberOfLines={1}
//                             style={{
//                                 fontSize: 12,
//                                 color: '#2E3034',
//                                 fontWeight: 'normal',

//                             }}
//                         >
//                             {item.messages[0].content[0].text}
//                         </Text>
//                     </View>
//                 </View>
//             </View>
//         )
//     }

//     const renderData = ({item}) => {
//         return (
//             <TouchableOpacity>
//                 <View
//                     style={{
//                         borderRadius: 10,
//                         width: dimenWidth-48,
//                         marginHorizontal: 24,
//                         backgroundColor: item.color,
//                     }}
//                 >
//                     <View
//                         style={{
//                             flexDirection: 'row',
//                             alignItems: 'center',
//                             marginHorizontal: 16,
//                             justifyContent: 'space-between'
//                         }}
//                     >
//                         <View
//                             style={{
//                                 flexDirection: 'column'
//                             }}
//                         >
//                             <Text
//                                 style={{
//                                     fontSize: 18,
//                                     lineHeight: 30,
//                                     color: '#fff',
//                                     fontWeight: 'bold',

//                                 }}
//                             >
//                                 {item.title}
//                             </Text>

//                             <View
//                                 style={{
//                                     flexDirection: 'row'
//                                 }}
//                             >
//                                 <Text
//                                     style={{
//                                         fontSize: 12,
//                                         lineHeight: 30,
//                                         color: '#fff',
//                                         marginRight: 8,
//                                         fontWeight: 'normal',

//                                     }}
//                                 >
//                                     {item.subTitle}
//                                 </Text>
//                                 <Text
//                                     style={{
//                                         fontSize: 12,
//                                         lineHeight: 30,
//                                         color: '#fff',
//                                         fontWeight: 'normal',

//                                     }}
//                                 >
//                                     {item.time}
//                                 </Text>
//                             </View>
//                         </View>

//                         <View>
//                             {item.image}
//                         </View>

//                     </View>

//                 </View>
//             </TouchableOpacity>
//         )
//     }

//     const emptyNewst = () => {
//         return (
//             <IllustrationNoInquiries width={dimenWidth-48} height={200} />
//         )
//     }

//     const renderMainStatus = () => {
//         return(
//             <View style={{flexDirection: 'row', marginHorizontal: 24, marginTop: 8, justifyContent: 'space-between'}}>
//                 <TouchableOpacity>
//                     <View
//                         style={{
//                             height: 144,
//                             borderRadius: 10,
//                             paddingVertical: 10,
//                             alignItems: 'center',
//                             paddingHorizontal: 8,
//                             backgroundColor: '#ED5653',
//                             justifyContent: 'space-around',
//                             width: ((dimenWidth-48)/2)-3.5
//                         }}
//                     >
//                         <Text
//                             style={{
//                                 fontSize: 12,
//                                 lineHeight: 18,
//                                 color: '#ffffff',
//                                 fontWeight: 'normal',
//                                 textAlign: 'center',

//                             }}
//                         >
//                             Unserved Customers
//                         </Text>
//                         <View>
//                             {isLoading?(
//                                 <ActivityIndicator color='#fff' size='large' />
//                             ):(
//                                 <Text
//                                     style={{
//                                         fontSize: 40,
//                                         color: '#ffffff',
//                                         fontWeight: 'bold',

//                                         textAlign: 'center'
//                                     }}
//                                 >
//                                     {dataCountRoom.request}
//                                 </Text>
//                             )}
//                             <Text
//                                 style={{
//                                     fontSize: 14,
//                                     color: '#ffffff',
//                                     fontWeight: 'normal',

//                                     textTransform: 'capitalize',
//                                     textAlign: 'center'
//                                 }}
//                             >
//                                 customers
//                             </Text>
//                         </View>
//                     </View>
//                 </TouchableOpacity>
//                 <TouchableOpacity>
//                     <View
//                         style={{
//                             height: 144,
//                             borderRadius: 10,
//                             paddingVertical: 10,
//                             alignItems: 'center',
//                             paddingHorizontal: 8,
//                             backgroundColor: '#0690A1',
//                             justifyContent: 'space-around',
//                             width: ((dimenWidth-48)/2)-3.5
//                         }}
//                     >
//                         <Text
//                             style={{
//                                 fontSize: 12,
//                                 lineHeight: 18,
//                                 color: '#ffffff',
//                                 fontWeight: 'normal',
//                                 textAlign: 'center',

//                             }}
//                         >
//                             Served by Me (unresolved)
//                         </Text>
//                         <View>
//                             {isLoading?(
//                                 <ActivityIndicator color={"#fff"} size={'large'}/>
//                             ):(
//                                 <Text
//                                     style={{
//                                         fontSize: 40,
//                                         color: '#ffffff',
//                                         fontWeight: 'bold',

//                                         textAlign: 'center'
//                                     }}
//                                 >
//                                     {dataCountRoom.live}
//                                 </Text>
//                             )}
//                             <Text
//                                 style={{
//                                     fontSize: 14,
//                                     color: '#ffffff',
//                                     fontWeight: 'normal',

//                                     textTransform: 'capitalize',
//                                     textAlign: 'center'
//                                 }}
//                             >
//                                 customers
//                             </Text>
//                         </View>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         )
//     }

//     const renderHeaderHome = () => {
//         return (
//             <View
//                 style={{
//                     marginTop: 30,
//                     marginBottom: 11,
//                     alignItems: 'center',
//                     flexDirection: 'row',
//                     marginHorizontal: 24,
//                     justifyContent: 'space-between'
//                 }}
//             >
//                 <View
//                     style={{justifyContent: 'space-between', }}
//                 >
//                     <Text
//                         style={{
//                             fontSize: 16,
//                             lineHeight: 22,
//                             marginBottom: 2,
//                             color: '#2E3034',
//                             fontWeight: 'bold',

//                             textTransform: 'capitalize'
//                         }}
//                     >
//                         Hi, {nameHome}
//                     </Text>
//                     <Text
//                         style={{
//                             fontSize: 16,
//                             lineHeight: 22,
//                             marginBottom: 4,
//                             color: '#2E3034',

//                         }}
//                     >
//                         Have a good day!
//                     </Text>
//                 </View>
//                 <IconBell width={22} height={24} />
//             </View>
//         )
//     }

//     const BottomListRequest = () => {
//         if (dataRole == "Staff") {
//             return (
//                 <View style={{height: 70, alignItems: 'center'}}>
//                     <TouchableOpacity>
//                         <View
//                             style={{
//                                 height: 56,
//                                 borderRadius: 10,
//                                 flexDirection: 'row',
//                                 width: dimenWidth-48,
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 backgroundColor: '#5588C3'
//                             }}
//                         >
//                             <Text
//                                 style={{
//                                     fontSize: 14,
//                                     color: '#fff',
//                                     fontWeight: 'bold',

//                                 }}
//                             >
//                                 Get Customer
//                             </Text>
//                             {isLoading?(
//                                 <ActivityIndicator color='#049FFF' size='large' />
//                             ):(
//                                 <View
//                                     style={{
//                                         width: 27,
//                                         height: 24,
//                                         marginLeft: 12,
//                                         borderRadius: 27/2,
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         backgroundColor: '#fff',
//                                     }}
//                                 >
//                                     <Text
//                                         style={{
//                                             fontSize: 12,
//                                             lineHeight: 14,
//                                             marginBottom: 2,
//                                             color: '#F1544A',
//                                             fontWeight: 'bold',

//                                         }}
//                                     >
//                                         {dataCountRoom.request}
//                                     </Text>
//                                 </View>
//                             )}
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             )
//         } else {
//             return (
//                 <View style={{height: 70, alignItems: 'center'}}>
//                     <TouchableOpacity onPress={() => navigation.navigate("AssignToTeam")}>
//                         <View
//                             style={{
//                                 height: 56,
//                                 borderRadius: 10,
//                                 width: dimenWidth-48,
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 backgroundColor: '#5588C3'
//                             }}
//                         >
//                             <Text
//                                 style={{
//                                     fontSize: 14,
//                                     color: '#fff',
//                                     fontWeight: 'bold',

//                                 }}
//                             >
//                                 Assign to
//                             </Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             )
//         }
//     }

//     const ContainerListRequest = () => {
//         return (
//             <View style={{flex: 1, marginHorizontal: 24, marginTop: 18}}>
//                 {
//                     loading ? (
//                         <Loading />
//                     ) : (
//                         <View style={styles.container}>
//                             <ListRequest />
//                         </View>
//                     )
//                 }
//                 <BottomListRequest />
//             </View>
//         )
//     }

//     const TextTitleListRequest = () => {
//         if (dataRoomsReq == undefined || dataRoomsReq.length == 0) {
//             return (
//                 <Text
//                     style={{
//                         fontSize: 14,
//                         color: '#A5A5A5',
//                         textAlign: 'center',
//                         fontWeight: 'bold',

//                         textTransform: 'capitalize'
//                     }}
//                 >
//                     No incoming inquiries
//                 </Text>
//             )
//         } else {
//             return (
//                 <Text
//                     style={{
//                         fontSize: 14,
//                         color: '#2E3034',
//                         fontWeight: 'bold',

//                         textTransform: 'capitalize'
//                     }}
//                 >
//                     Newest incoming inquiries
//                 </Text>
//             )
//         }
//     }

//     const ListRequest = () => {
//         return (
//             <View style={styles.container}>
//                 <TextTitleListRequest />
//                 <FlatList
//                     horizontal={false}
//                     data={dataRoomsReq}
//                     renderItem={renderDataNew}
//                     showsVerticalScrollIndicator={false}
//                     ListEmptyComponent={() => emptyNewst()}
//                     keyExtractor={(item, index) => index.toString()}
//                 />
//             </View>
//         )
//     }

//     return (
//         <View style={[styles.container, {backgroundColor: '#fff'}]}>
//             <View style={styles.container}>
//                 {renderHeaderHome()}
//                 <View>
//                     <FlatList
//                         horizontal={true}
//                         data={dataListCarousel}
//                         renderItem={renderData}
//                         showsVerticalScrollIndicator={false}
//                         keyExtractor={(item, index) => index.toString()}
//                     />
//                 </View>
//                 {/* {renderMainStatus()} */}
//                 <ContainerListRequest />
//             </View>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     },
// });

// export default Home;
