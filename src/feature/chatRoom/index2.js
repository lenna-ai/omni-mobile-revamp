import * as React  from 'react';

import { 
    Text,
    View,
    Image,
    Linking,
    Keyboard,
    Platform,
    FlatList,
    TextInput,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView
} from 'react-native';

import VideoPlayer from 'react-native-video-player';

//Internal Import
import API from './../../utils/api';
import { getData, putData, postDataOutHeader } from './../../modules/services';
import BSAttachSendChat from './components/BSAttachSendChat';
import { 
    getRoomId,
    addDataChats,
    moreDataChats,
    pushDataLoading
} from "../../modules/redux/actions/inChat";

import { 
    addDataForAssignRoomId, 
    addDataForAssignLivechat,
    addDataForAssignAgentInfo,
} from '../../modules/redux/actions/member/inForAssign';

//External Import
import moment from 'moment';
import HTML from 'react-native-render-html';
import openMap from 'react-native-open-maps';
import { Icon, Image as ImageElement } from 'react-native-elements';
import Voice from '@react-native-community/voice';
import EmojiBoard from 'react-native-emoji-board';
import ImageView from "react-native-image-viewing";
import ParsedText from 'react-native-parsed-text';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Header, Avatar} from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);


//Component Chat Import
import { encodeHashIds, decodeHashIds } from './../../utils/encode';
import { chatCarousel } from './../components/chatRoom/chatCarousel';
import { chatText } from '../components/chatRoom/chatText';
import { getValue } from './../../modules/localData';


//Assets Import
import {
    imageIconPin,
    imageIconBack,
    imageIconResolved,
    imageIconAssignTo,
    imageIconMicActive,
    imageIconBotDefault,
    imageIconAttachment,
    imageIconPaperPlane,
    imageIconMicInactive,
    imageIconMoreVertical,
    imageIconAdminDefault,
    imageIconFemaleAgentDefault,
    imageIllustrationNoActiveChat,
    IconX,
} from './../../assets/icons';

import { moderateScale } from '../other/Scaling';
import LoadingBig from './../../assets/anime/loading_big.gif';
import CheckImageChatRoom from './components/CheckImageChatRoom';
import LoadingSmall from './../../assets/anime/loading_small.gif';
import { onActiveNav } from '../../modules/redux/actions/inNavigation';
import CheckImageLeftChatRoom from './components/CheckImageLeftChatRoom';
// import { AlertToastSuccess, AlertToastFailed } from '../other/AlertToast';

const dimenWidth = Dimensions.get('screen').width;
const keyboardVerticalOffset = Platform.OS == 'ios' ? moderateScale(90) : 0;
const dimenHeight = Dimensions.get('screen').height;
const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';

const ChatRoom = ({ route, navigation }) => {

    const {id} = route.params;
    const {statusAction} = route.params;

    const dispatch = useDispatch();
    const disChat = useSelector((state) => state.mDataChats);
    let dataChats = disChat.data;

    let disRooms = useSelector((state) => state.mDataRoomsChat);
    let dataRooms = disRooms.dataRoomsChat;

    const disUser = useSelector((state) => state.mDataUserLogin);
    let dataUser = disUser.dataUserWasLogin;

    const [show, setShow] = React.useState(false);
    const [chatSend, setChatSend] = React.useState('');
    const [notedSend, setNotedSend] = React.useState('');
    const [firstMsg, setFirstMsg] = React.useState(0);

    const [isLoading, setIsLoading] = React.useState(false);
    const [dataItem, setDataItem] = React.useState(undefined);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [pageMsgTemplate, setPageMsgTemplate] = React.useState(1);
    const [isLoadingBSheet, setIsLoadingBSheet] = React.useState(false);
    const [isLoadingAction, setIsLoadingAction] = React.useState(false);
    const [isErrGetTemplate, setIsErrGetTemplate] = React.useState(false);
    
    const [heightChatSend, setHeightChatSend] = React.useState(0);

    const [dtMsgTemp, setDtMsgTemp] = React.useState([]);
    const [dtMsgTempFilter, setDtMsgTempFilter] = React.useState([]);

    const [isFocus, setIsFocus] = React.useState(true);
    const [showMsgTemp, setShowMsgTemp] = React.useState(0);

    const [isSendMsgTemplate, setIsSendMsgTemplate] = React.useState(false);
    const [dataSendMsgTemplate, setDataSendMsgTemplate] = React.useState([]);

    const [showKeyword, setShowKeyword] = React.useState(false);

    const [isDone, setIsDone] = React.useState(false);

    const toastFailed = React.useRef();
    const toastSuccess = React.useRef();
    const refTextInput = React.useRef();
    const refDataChats = React.useRef();
    const refRBSheetMore = React.useRef();
    const refRBSheetAttach = React.useRef();
    const refRBSheetEndNotes = React.useRef();

    const [micISActive, setMicISActive] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(onActiveNav("chats"));
        });
        return unsubscribe;
    }, navigation);

    React.useEffect(() => {
        if (!isErrGetTemplate) {
            getDataMsgTemplate(dataUser.app_id);
        } 
    }, [pageMsgTemplate]);

    const getDataMsgTemplate = async(appId) => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        try {
            let res = await getData(API.PATH + encodeHashIds(appId) + '/chat-template?page=' + pageMsgTemplate, headers);
            console.log("dataMsgTemp-11", res);
            
            if (res.data.length != 0) {
                if (pageMsgTemplate == 1) {
                    setDtMsgTemp(res.data);
                } else {
                    let arrMsgTemp = [...dtMsgTemp, ...res.data];
                    setDtMsgTemp(arrMsgTemp);
                }
                setPageMsgTemplate(pageMsgTemplate + 1);
            } else {
                setIsErrGetTemplate(true);
            }
        } catch (e) {
            setIsErrGetTemplate(true);
        }
    }

    const updateBadgeRoom = async() => {
        let dataRoomId = id;
        let uBadgeRoom = dataRooms;
        let dataSenderId = dataUser.user_id;

        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        let params = {
            roomId: dataRoomId,
            senderId: dataSenderId
        }
        let res = await putData(
            API.PATH + encodeHashIds(dataUser.app_id) +'/message/update-unread-message', 
            params, 
            headers
        );

        console.log("res.success", res.success)
        if (res.success) {
            for (var i = 0; i < uBadgeRoom.length; i++) {
                if (uBadgeRoom[i].id === id) {
                    if (uBadgeRoom[i].unread_count > 0) {
                        uBadgeRoom[i].unread_count = 0;
                    }
                  break;
                }
            }
        }
        
    }

    const requestToServer1 = async() => {
        setIsDone(false);
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        let params = {
            roomId: id,
            firstMessageId: dataItem.messages[0].id
        }
        let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/message/get-more-message', params, headers);
        if (res.data.messages != 0) {
            const messageFirst = [...dataItem.messages, ...res.data.messages.reverse()];
            // setDataChats(messageFirst);
            dispatch(addDataChats(messageFirst));
            setFirstMsg(res.data.messages[res.data.messages.length-1].id);
        }
        setIsLoading(false);
    }

    const requestToServerAll = async() => {
        let vFirstMessageId = 0;
        if (!isDone) {
            let headers = {
                token: dataUser.token,
                userId: encodeHashIds(dataUser.user_id)
            }

            vFirstMessageId = firstMsg;
            let params = {
                roomId: id,
                firstMessageId: vFirstMessageId
            }
            let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/message/get-more-message', params, headers);
            if (res.data.messages.length != 0) {
                dispatch(moreDataChats(res.data.messages.reverse()));
                setFirstMsg(res.data.messages[res.data.messages.length-1].id);
            } else {
                setIsDone(true);
            }
            setIsLoadingMore(false);
        }
        setIsLoadingMore(false);
    }

    const dataLoadMore = React.useCallback(() => {
        if(isLoadingMore) return;
        setIsLoadingMore(true);
        requestToServerAll();
    });

    React.useEffect(() => {
        if (!isFocus) {
            dispatch(getRoomId(id));
            requestToServer1();
        }
    }, [isFocus])

    React.useEffect(() => {
        setIsLoading(true);
        dataRooms.find((entry) => {
            if (entry.id == id) {
                setDataItem(entry);
                setIsFocus(false);
            }
        });

        updateBadgeRoom();

        function onSpeechStart(e) {};
    
        function onSpeechRecognized(e) {};

        function onSpeechError(e) {};
        
        function onSpeechEnd(e) {
            setMicISActive(false);
        };
        
        function onSpeechResults(e) {
            console.log("e.value[0]", e.value[0]);
            
            setChatSend(e.value[0]);
            setTimeout(() => {
                onSendChat(e.value[0], "text");
                Voice.stop();
            }, 1000);
        };
        
        function onSpeechPartialResults(e) {};
        
        function onSpeechVolumeChanged(e) {};

        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechRecognized = onSpeechRecognized;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
          

        // const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
        //     () => {setShowKeyword(true);}
        // );
        // const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
        //     () => {setShowKeyword(false);}
        // );

        return () => {
            // keyboardDidHideListener.remove();
            // keyboardDidShowListener.remove();
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);
    
    const _startRecognizing = () => {
        Voice.start('id-ID');
        setMicISActive(true);
    };

    const _stopRecognizing = () => {
        Voice.cancel();
        setMicISActive(false);
    };

    const renderHeader = () => {
        if (isLoadingMore) {
            return (
                <View
                  style={{
                    paddingVertical: 8,
                  }}
                >
                  <ActivityIndicator color='#049FFF' size='large' />
                </View>
            )
        } else {
            return null
        }
    }

    const changeTextMsg = (msg) => {
        if (msg.indexOf("/") == 0) {
            setDtMsgTempFilter([...dtMsgTemp]);
            let data = msg.substring(1, msg.length);
            if (data != "") {
                let filteredName = dtMsgTemp.filter((item) => {
                    return item.key.toLowerCase().match(data.toLowerCase()) || item.content.toLowerCase().match(data.toLowerCase())
                })
                
                if (filteredName.length != 0) {
                    setDtMsgTempFilter([...filteredName])
                } else {
                    let dtEmpty = {
                        app_id:0,
                        content:"",
                        created_at:"",
                        id:0,
                        key:"",
                        updated_at:""
                    }
                    setDtMsgTempFilter([dtEmpty]);
                }
            }
            setShowMsgTemp(1);
        } else {
            setShowMsgTemp(0);
        }
        setChatSend(msg);
    }

    const changeTextNoted = (msg) => {
        setNotedSend(msg);
    }

    const onClick = emoji => {
        console.log(emoji);
        setChatSend(chatSend + emoji.code);
    };

    const listEmptyComponent = () => {
        return (
            <View style={styles.containListEmpty}>
                {imageIllustrationNoActiveChat('100%', moderateScale(250))}
                <Text style={styles.txt1ListEmpty}>
                    No active chat yet
                </Text>
                <Text style={styles.txt2ListEmpty}>
                    It looks like your screen is still clean! {'\n'}
                    Why don't you start serving customers?
                </Text>
            </View>
        )
    }

    const HeaderComponent = () => {
        return (
            <Header
                placement="left"
                centerComponent={() => {
                    return (
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 43}}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    {imageIconBack(moderateScale(24), moderateScale(24))}
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Profile', {
                                        id: id
                                    })}
                                    style={{
                                        marginLeft: 8
                                    }}
                                >
                                    <View style={{flexDirection: 'row', width: dimenWidth/2}}>
                                        {isFocus?(
                                            <ShimmerPlaceHolder 
                                                width={52} 
                                                height={52}
                                                autoRun={true} 
                                                style={{borderRadius: 52/2}}
                                            />
                                        ):(
                                            
                                            <CheckImageLeftChatRoom 
                                                url={dataItem.created_by.picture}
                                                wd={moderateScale(52)}
                                                hd={moderateScale(52)}
                                            />
                                        )}
                                        <View style={{flexDirection: 'column', justifyContent: 'center', marginLeft: 16}}>
                                            {isFocus?(
                                                <ShimmerPlaceHolder 
                                                    width={100} 
                                                    height={20}
                                                    autoRun={true} 
                                                />
                                            ):(
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        fontSize: 16,
                                                        fontWeight: 'bold',
                                                        
                                                        textTransform: 'capitalize'
                                                    }}
                                                >
                                                    {dataItem.created_by.name}
                                                </Text>
                                            )}
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: '900',
                                                    
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                -
                                            </Text>
                                        </View>
                                    </View>

                                    
                                </TouchableOpacity>
                                <View 
                                    style={{
                                        right: 0,
                                        flexDirection: 'row',
                                        position: 'absolute'
                                    }}
                                >
                                    <TouchableOpacity onPress={() => refRBSheetMore.current.open()}>
                                        {imageIconMoreVertical(moderateScale(24), moderateScale(24))}
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    )
                }}
                containerStyle={{
                    height: 88,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    paddingTop: 5,
                    marginHorizontal: -12,
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFFFF'
                }}
            />

        )
    }

    const onReloadMain = () => {
        console.log("hai");
    }

    const goToAssign = () => {
        dispatch(addDataForAssignRoomId(dataItem.id));
        dispatch(addDataForAssignAgentInfo(dataItem.agent_info));
        dispatch(addDataForAssignLivechat(dataItem.livechat));
        refRBSheetMore.current.close();
        navigation.navigate("AssignToTeam", {
            namePage: "Chat",
            reload: () => onReloadMain()
        });
    }

    const containMsgType = (item) => {
        switch (item.type) {
            case 'text':
                return containMsgTypeTxt(item);
            case 'carousel':
                return containMsgTypeCarousel(item);
            case 'image':
                return containMsgTypeImage(item);
            case 'video':
                return containMsgTypeVideo(item);
            case 'html':
                return containMsgTypeHTML(item);
            case 'template':
                return containMsgTypeTemplate(item);
            case 'file':
                return containMsgTypeFile(item)
            case 'loadingMsg':
                return containMsgTypeLoadingMsg();
            case 'location':
                return containMsgTypeLocation(item);
            default:
                break;
        }
    }

    const openGps = (lat, lng) => {
        openMap({ latitude: lat, longitude: lng });
      }
      
    // Start - Message Type Chat
    const containMsgTypeLocation = (item) => {
        return (
            <TouchableOpacity
                onPress={() => openGps(item.latitude, item.longitude)}
            >
                <CheckImageChatRoom 
                    url={item.thumbnailImageUrl}
                />
                <Text
                    style={{
                        marginTop: moderateScale(8),
                        maxWidth: dimenWidth-128,
                        fontSize: 14,
                        
                    }}
                >
                    {item.title}
                </Text>
            </TouchableOpacity>
        )
    }
    const containMsgTypeLoadingMsg = () => {
        return (
            <Image
                style={{height: 32, width: 24}}
                resizeMode="contain"
                source={LoadingSmall}
                autoPlay
            />
        )
    }

    const containMsgTypeTxt = (item) => {
        return (
            <ParsedText
                style={{
                    maxWidth: dimenWidth-128,
                    fontSize: 14,
                    
                }}
                parse={[
                    {type: 'url', style: {
                        color: '#3490dc',
                        textDecorationLine: 'underline',
                    }, onPress: handleUrlImageCaption},
                ]}
                childrenProps={{allowFontScaling: false}}
            >
                {item.text}
            </ParsedText>
            // <Text
            //     style={{
            //         maxWidth: dimenWidth-128,
            //         fontSize: 14,
            //         
            //     }}
            // >
            //     {item.text}
            // </Text>
        )
    }

    const itemContainMsgTypeCarousel = (item, index) => {
        return (
            <View
                style={{
                    marginTop: 3,
                    marginBottom: 3,
                    borderRadius: 10,
                    borderWidth: 0.7,
                    marginHorizontal: 5,
                    borderColor: '#c7c5c5',
                    width: (dimenWidth-128)/1.7,
                }}
            >
                <View
                    style={{
                        height: 120,
                        overflow: 'hidden',
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}>
                    <Image
                        style={{
                            flex: 1,
                            height: 120,
                            width: undefined,
                            resizeMode: 'stretch',
                        }}
                        source={{uri: item.thumbnailImageUrl}}
                    />
                </View>

                <Text
                    key={index}
                    style={{
                        
                        margin: 10,
                        fontWeight: 'bold',
                    }}>
                    {item.title.split('<br>')}
                </Text>

                <Text
                    key={index + 1}
                    style={{
                        
                        maxWidth: 250,
                        margin: 10,
                    }}>
                    {item.text.split('<br>')}
                </Text>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    {item.actions.map((dataActions, index) => {
                        return (
                            <TouchableOpacity
                                // onPress={() => this.actionCarousel(dataActions)}
                                transparent
                                style={{height: 30, marginBottom: 5}}
                            >
                                <Text
                                    key={index.toString()}
                                    style={{
                                        
                                        color: '#0087d4',
                                        fontWeight: 'bold',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        magin: 5,
                                    }}
                                >
                                    {dataActions.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        )
    }

    const containMsgTypeCarousel = (item) => {
        return (
            <FlatList 
                horizontal={true}
                data={item.columns}
                style={{width: dimenWidth-128}}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => itemContainMsgTypeCarousel(item, index)}
            />
        )
    }

    const containMsgTypeImage = (item) => {
        
        return (
            <View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ImageZoom', {
                        imageUrl: item.originalContentUrl
                    })}
                    style={{
                        flex: 1,
                        alignItems: 'center'
                    }}
                >
                    {/* <CheckImageChatRoom 
                        url={item.originalContentUrl} 
                    /> */}
                    <ImageElement 
                        style={{
                            resizeMode: 'cover',
                            width: dimenWidth-moderateScale(120),
                            height: dimenWidth-moderateScale(120),
                        }} 
                        placeholderStyle={{
                            backgroundColor: '#ffffff'
                        }}
                        // onError={() => onImageError()}
                        PlaceholderContent={<ActivityIndicator color='#049FFF' size='large'/>}
                        source={{uri: item.originalContentUrl}}  
                    />
                    {/* <Image 
                        style={{
                            resizeMode: 'center',
                            width: dimenWidth-moderateScale(120),
                            height: dimenWidth-moderateScale(120),
                        }} 
                        // onError={() => onImageError()}
                        source={{uri: item.originalContentUrl}}  
                    /> */}
                </TouchableOpacity>
                {item.caption != "" ? (
                    <ParsedText
                        style={{
                            maxWidth: dimenWidth-128,
                            fontSize: 14,
                            marginTop: moderateScale(8),
                            
                        }}
                        parse={[
                            {type: 'url', style: {
                                color: '#3490dc',
                                textDecorationLine: 'underline',
                            }, onPress: handleUrlImageCaption},
                        ]}
                        childrenProps={{allowFontScaling: false}}
                    >
                        {item.caption}
                    </ParsedText>
                ):null}
            </View>
            
            // <Image
            //     style={{
            //         width: dimenWidth-128,
            //         height: 300,
            //         borderRadius: 10,
            //         resizeMode: 'stretch',
            //     }}
            //     source={{uri: item.originalContentUrl}}
            // />
        )
    }

    const containMsgTypeVideo = (item) => {
        return (
            // <Video 
            //     source={{uri: item.originalContentUrl}}
            //     ref={refDataChats}
            //     resizeMode="contain"
            //     paused={true}
            //     // onBuffer={onBuffer}
            //     // onError={this.videoError}
            //     controls={true}
            //     style={styles.backgroundVideo} 
            // />
            <View>
                <VideoPlayer
                    video={{ uri: item.originalContentUrl }}
                    videoWidth={dimenWidth-128}
                    videoHeight={300}
                    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                />
                {/* {('caption' in item) ? (
                    item.caption != "" ? (
                        <ParsedText
                        style={{
                            maxWidth: dimenWidth-128,
                            fontSize: 14,
                            marginTop: moderateScale(8),
                            
                        }}
                        parse={[
                            {type: 'url', style: {
                                color: '#3490dc',
                                textDecorationLine: 'underline',
                            }, onPress: handleUrlImageCaption},
                        ]}
                        childrenProps={{allowFontScaling: false}}
                    >
                        {item.caption}
                    </ParsedText>
                    ):null
                ):null} */}
            </View>
            

            // <VideoPlayer 
            //     source={{ uri: item.originalContentUrl }}
            //     style={styles.backgroundVideo} 
            //     onShowControls={true}
            //     disableBack={true}
            //     disableVolume={true}
            //     disableFullscreen={true}
            //     showOnStart={true}
            //     onPlay={false}
            // />
        )
    }

    const containMsgTypeHTML = (item) => {
        return (
            <View style={{maxWidth: dimenWidth-128}}>
                <HTML html={item.content} imagesMaxWidth={dimenWidth-128} />
            </View>
        )
    }

    const containMsgTypeTemplate = (item) => {
        return (
            <View style={{maxWidth: dimenWidth-128}}>
                <HTML html={item.template} imagesMaxWidth={dimenWidth-128} />
            </View>
        )
    }

    const containMsgTypeFile = (item) => {
        return (
            <View 
                style={{
                    flexDirection: 'row', 
                    alignItems: 'center',
                    width: dimenWidth-128
                }}
            >
                <Image
                    source={{uri: 'https://marketplace.canva.com/MAB5sssN0Qw/1/thumbnail_large/canva-file--MAB5sssN0Qw.png'}}
                    style={{width: 40, height: 40, resizeMode: 'contain'}}
                />
                <TouchableOpacity
                    style={{width: dimenWidth-168}}
                    onPress={() => openLinking(item.fileUrl)}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: '800',
                            
                        }}
                    >
                        {item.fileName}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    //End - Message Type Chat

    const handleUrlImageCaption = (url) => {
        openLinking(url);
    } 

    const openLinking = async(url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }

    const leftBlueBubleChat = (item, date, value, valueText, valueFirst) => {
        let valueTopLeft = 0;
        let valueBottomLeft = 0;

        if (valueFirst == 1) {
            valueTopLeft = 16
        } else {
            if (value == 1) {
                if (value == 0 || valueText == 0) {
                    valueBottomLeft = 16;
                }
            }
    
            if (valueText == 1 || (valueFirst == 1 && valueText == 0)) {
                valueTopLeft = 16
            }
        }


        return (
            <View 
                style={{
                    //Box Shadow
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,

                    elevation: 2,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    backgroundColor: '#E1F2FF',
                    borderRadius: 16,
                    borderBottomLeftRadius: valueBottomLeft,
                    borderTopLeftRadius: valueTopLeft,
                    marginVertical: value == 0 && valueText == 0 ? 4 : 0,
                }}
            >
                {containMsgType(item)}
                <Text
                    style={{
                        fontSize: 10,
                        marginTop: 4,
                        alignSelf: 'flex-end',
                        
                    }}
                >
                    {date}
                </Text>
            </View>
        )
    }

    const rightWhiteBubleChat = (item, date, value, valueText, valueFirst) => {

        let valueTopRight = 0;
        let valueBottomRight = 0;

        if (valueFirst == 1) {
            valueTopRight = 16;
        } else {
            if (value == 1) {
                if (value == 0 || valueText == 0) {
                    valueBottomRight = 16;
                }
            }
    
            if (valueText == 1 || (valueFirst == 1 && valueText == 0)) {
                valueTopRight = 16
            }
        }


        return (
            <View 
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,

                    elevation: 2,
                    paddingVertical: 8,
                    paddingHorizontal: 10,
                    borderRadius: 16,
                    borderBottomRightRadius: valueBottomRight,
                    borderTopRightRadius: valueTopRight,
                    backgroundColor: '#FFFFFF',
                    marginVertical: value == 0 && valueText == 0 ? 7 : 4,
                }}
            >
                {containMsgType(item)}
                {item.type != 'loadingMsg' ? (
                    <Text
                        style={{
                            fontSize: 10,
                            marginTop: 4,
                            
                        }}
                    >
                        {date}
                    </Text>
                ):null}
            </View>
        )
    }

    const LeftBubleChat = (item, value, valueText, valueFirst) => {
        let dateUpdate = moment(item.updated_at).format('LT');
        return (
            <View style={{flexDirection: 'row', alignItems: 'flex-end', width: dimenWidth-54}}>
                <View style={{paddingHorizontal: 10}}>
                    {/* <Image 
                        style={{    
                            width: 34, 
                            height: 34, 
                            marginTop: 3,
                            borderRadius: 34/2,
                            opacity: value
                        }} 
                        source={{uri: item.messageable.picture}} 
                    /> */}
                    <CheckImageLeftChatRoom 
                        url={item.messageable.picture}
                        wd={moderateScale(34)}
                        hd={moderateScale(34)}
                        value={value}
                    />
                </View>
                <FlatList 
                    horizontal={false}
                    data={item.content}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => leftBlueBubleChat(item, dateUpdate, value, valueText, valueFirst)}
                />
            </View>
        )
    }

    const RightBubleChat = (item, value, valueText, valueFirst) => {
        let dateUpdate = moment(item.updated_at).format('LT');

        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', width: dimenWidth-54}}>
                <FlatList 
                    horizontal={false}
                    data={item.content}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => rightWhiteBubleChat(item, dateUpdate, value, valueText, valueFirst)}
                />
                <View style={{paddingHorizontal: 10}}>
                    {
                        item.messageable_type != 'bot' && item.messageable_type == 'user_platform'
                        ? dataUser.user_id == item.messageable.id
                            ? imageIconAdminDefault(moderateScale(34), moderateScale(34), value)
                            : imageIconFemaleAgentDefault(moderateScale(34), moderateScale(34), value)
                        : imageIconBotDefault(moderateScale(34), moderateScale(34), value)
                    }
                </View>
            </View>
        )
    }

    const renderDataMsg = ({item, index}) => {

        let valueOpacity = 1;
        let textOpacity = 0;
        let valueFirst = 0;

        if (dataChats[index-1] != undefined) {
            if (dataChats[index-1].messageable_id == item.messageable_id) {
                valueOpacity = 0;
            }
        }

        if (dataChats[index+1] != undefined) {
            if (dataChats[index+1].messageable_id != item.messageable_id) {
                textOpacity = 1;
            }
        }

        if (dataChats.length-1 == index) {
            valueFirst = 1
        }

        if (item.messageable_type == 'user') {
            return (
                <View
                    style={{
                        marginTop: valueFirst == 1 ? 18 : 0,
                        marginBottom: valueOpacity == 1 ? 18 : 0,
                        alignSelf: 'flex-start'
                    }}
                >
                    {LeftBubleChat(item, valueOpacity, textOpacity, valueFirst)}
                </View>
            )
        } else {
            return (
                <View
                    style={{
                        marginTop: valueFirst == 1 ? 18 : 0,
                        marginBottom: valueOpacity == 1 ? 18 : 0,
                        alignSelf: 'flex-end'
                    }}
                >
                    {textOpacity == 1 || (valueFirst == 1 && textOpacity == 0) ? (
                        <Text
                            style={{
                                alignSelf: 'flex-end',
                                marginRight: 54,
                                fontSize: 12,
                                
                            }}
                        >
                            {
                                item.content[0].type != 'loadingMsg' ? (
                                    item.messageable.name
                                ) : null
                            }
                        </Text>
                    ):null}
                    {RightBubleChat(item, valueOpacity, textOpacity, valueFirst)}
                </View>
            )
        }
    }

    const pressEmot = () => {
        setShowKeyword(false);
        setShow(!show);
    }

    const setParamsChatMsgTmp = (item, type) => {
        let date = Date.now();
        let dateMilliseconds = moment(date).format('x');
        let dataSenderId = dataUser.user_id;
        let dataRoomId = id;

        let dataMessage = [];
        let objMessage = {};

        if (type == 1) {
            objMessage = {
                originalContentUrl: item.originalContentUrl,
                previewImageUrl: item.previewImageUrl,
                type: "image"
            }
        } else {
            objMessage = {
                template: item,
                type: "template"

            }
        }

        dataMessage.push(objMessage);

        let params = {
            roomId: dataRoomId,
            senderId: dataSenderId,
            temporaryId: dateMilliseconds,
            message: dataMessage
        }

        return params;
    }

    const setParamsChat = (msg, type) => {
        let date = Date.now();
        let dateMilliseconds = moment(date).format('x');
        let dataSenderId = dataUser.user_id;
        let dataRoomId = id;

        let dataMessage = [];
        let dataSpeech = msg;
        let dataText = msg;
        let dataType = type;

        let objMessage = {
            speech: dataSpeech,
            text: dataText,
            type: dataType,
        }

        dataMessage.push(objMessage);

        let params = {
            roomId: dataRoomId,
            senderId: dataSenderId,
            temporaryId: dateMilliseconds,
            message: dataMessage
        }

        return params;
    }

    const onSendChat = async(msg, type) => {
        if (msg.trim() != "") {
            if (isSendMsgTemplate) {
                if (dataSendMsgTemplate.length != 0) {
                    
                    for (let i=0; i <= dataSendMsgTemplate.length; i++) {
                        let dataArray = [unshiftDataChatLoading()];
                        dispatch(pushDataLoading(dataArray));
                        setChatSend("");
                        refTextInput.current.blur();

                        let headers = {
                            token: dataUser.token,
                            userId: encodeHashIds(dataUser.user_id)
                        }
                        if (i< dataSendMsgTemplate.length) {
                            await postDataOutHeader(
                                API.PATH + encodeHashIds(dataUser.app_id) +'/chat/send-message', 
                                setParamsChatMsgTmp(dataSendMsgTemplate[i], 1),
                                headers
                            ); 
                        } else {
                            let dataSend = await postDataOutHeader(
                                API.PATH + encodeHashIds(dataUser.app_id) +'/chat/send-message', 
                                setParamsChatMsgTmp(msg, 2),
                                headers
                            );

                            if (dataSend.succes) {
                                setDataSendMsgTemplate([]);
                                setIsSendMsgTemplate(false);
                            } else {
                                setDataSendMsgTemplate([]);
                                setIsSendMsgTemplate(false);
                            }

                        }
                    }
                } else {
                    let dataArray = [unshiftDataChatLoading()];
                    setChatSend("");
                    refTextInput.current.blur();
                    dispatch(pushDataLoading(dataArray));
                    let headers = {
                        token: dataUser.token,
                        userId: encodeHashIds(dataUser.user_id)
                    }
                    await postDataOutHeader(
                        API.PATH + encodeHashIds(dataUser.app_id) +'/chat/send-message', 
                        setParamsChatMsgTmp(msg, 2),
                        headers
                    );
                }
            } else {
                let dataArray = [unshiftDataChatLoading()];
                setChatSend("");
                refTextInput.current.blur();
                dispatch(pushDataLoading(dataArray));
                sendCharts(msg, type);
            }
        }
    }

    const unshiftDataChatLoading = () => {
        let data = {
            id: 0,
            channel_data: null,
            room_id: id,
            messageable_type: "user_platform",
            messageable_id: dataUser.user_id,
            content:[
                {
                    type: "loadingMsg",
                    text: "test",
                    speech :"test"
        
                }
            ],
            data: null,
            deleted_at: null,
            created_at: "2020-07-23 14:23:48",
            updated_at: "2020-07-23 14:23:48",
            messageable: {
                id: dataUser.user_id,
                name: "user_sender"
            }
        }
        return data;
    }

    const sendCharts = async(msg, type) => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        let dataChat = await postDataOutHeader(
            API.PATH + encodeHashIds(dataUser.app_id) +'/chat/send-message', 
            setParamsChat(msg, type),
            headers
        );

        console.log("dataChat", dataChat)
    }

    const onResolved = async() => {
        
        if (notedSend != "") {
            setIsLoadingBSheet(true);
            let headers = {
                token: dataUser.token,
                userId: encodeHashIds(dataUser.user_id)
            }

            let params = {
                agentId: dataUser.user_id,
                userId: dataItem.created_by.id,
                liveChatId: dataItem.livechat.id,
                description: notedSend,
            }

            let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/livechat/resolve', params, headers);
            
            try {
                if (res.success) {
                    setIsLoadingBSheet(false);
                    refRBSheetEndNotes.current.close();
                    navigation.popToTop();
                    toastSuccess.current.show(res.message, 1000);
                } else {
                    setIsLoadingBSheet(false);
                    refRBSheetEndNotes.current.close();
                    toastFailed.current.show(res.message, 1000);
                }
            } catch (error) {
                setIsLoadingBSheet(false);
                refRBSheetEndNotes.current.close();
                let msg = "Terjadi kendala teknis, Harap coba kembali!"
                toastFailed.current.show(msg, 1000);
            }
        }
        
        
    }

    const onChannel = async() => {
        setIsLoadingAction(true);
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        let params = {
            userId: dataItem.created_by.id,
        }

        let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/livechat/request', params, headers);
        
        try {
            console.log("DATA_RES_CHANNEL", res);
            if (res.success) {
                setIsLoadingAction(false);
                toastSuccess.current.show(res.message, 1000);
            } else {
                setIsLoadingAction(false);
                toastFailed.current.show(res.message, 1000);
            }
        } catch (error) {
            setIsLoadingAction(false);
            let msg = "Terjadi kendala teknis, Harap coba kembali!";
            toastFailed.current.show(msg, 1000);
        }
    }

    const resolvedRooms = () => {
        refRBSheetMore.current.close();
        setTimeout(() => {
            refRBSheetEndNotes.current.open();
        }, 1000);
    }

    const handleRooms = () => {
        refRBSheetMore.current.close();
        onChannel();
    }

    const actionsHandSolv = () => {
        if (statusAction == "Resolved" || statusAction == "Unserved") {
            return null;
        } else {
            return (
                <TouchableOpacity 
                    onPress={() => 
                        statusAction == 'Served' ? resolvedRooms() : handleRooms() 
                    }
                    style={{marginBottom: 14}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{width: 37, justifyContent: 'center', alignItems: 'center'}}>
                            {imageIconResolved(moderateScale(36), moderateScale(31))}
                        </View>
                        {statusAction == 'Served' ? (
                            <Text
                                style={{
                                    fontSize: 14,
                                    marginLeft: 16,
                                    lineHeight: 24,
                                    fontWeight: 'bold',
                                    letterSpacing: 0.1,
                                    
                                }}
                            >
                                Resolved
                            </Text>
                        ) : (
                            <Text
                                style={{
                                    fontSize: 14,
                                    marginLeft: 16,
                                    lineHeight: 24,
                                    fontWeight: 'bold',
                                    letterSpacing: 0.1,
                                    
                                }}
                            >
                                Handle
                            </Text>
                            
                        )}
                    </View>
                </TouchableOpacity>
            )
        }
    }

    const cancelNoted = () => {
        setNotedSend("");
        refRBSheetEndNotes.current.close();
    }

    const find_dimesions = (layout) => {
        const {x, y, width, height} = layout;
        let dtHeight = height + (14*2);
        setHeightChatSend(dtHeight)
    }

    const onClickMsgTemp = (item) => {
        setIsSendMsgTemplate(true);
        setDataSendMsgTemplate(JSON.parse(item.files));
        setChatSend(item.content);
        setShowMsgTemp(0);
    }

    const renderItemMsgTemp = ({item, index}) => {
        
        if (item.id != 0) {
            return (
                <TouchableOpacity onPress={() => onClickMsgTemp(item)}>
                    {index != 0 ? (
                        <View
                            style={{
                                width: '100%',
                                height: moderateScale(1),
                                backgroundColor: '#cfcfcf',
                            }}
                        />
                    ):null}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            paddingVertical: moderateScale(6)
                        }}
                    >
                        <Text
                            style={{
                                width: '40%',
                                
                                fontSize: moderateScale(14),
                                lineHeight: moderateScale(24),
                                marginVertical: moderateScale(2),
                            }}
                        >
                            {item.key}
                        </Text>
                        <Text
                            style={{
                                width: '50%',
                                
                                fontSize: moderateScale(14),
                                lineHeight: moderateScale(24),
                                marginVertical: moderateScale(2),
                                marginHorizontal: moderateScale(4)
                            }}
                        >
                            {item.content}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        marginVertical: moderateScale(6),
                        marginHorizontal: moderateScale(12),
                    }}
                >
                    <Text
                        style={{
                            width: '54%',
                            
                            fontSize: moderateScale(14),
                            lineHeight: moderateScale(24),
                            marginVertical: moderateScale(2),
                        }}
                    >
                        No template for keyword
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{
                            width: '46%',
                            color: '#2196f3',
                            
                            fontSize: moderateScale(14),
                            lineHeight: moderateScale(24),
                            marginVertical: moderateScale(2),
                            marginHorizontal: moderateScale(4)
                        }}
                    >
                        {" " + chatSend.substring(1, chatSend.length)}
                    </Text>
                </View>
            )
        }
    }

    return (
        <View style={[styles.container, {backgroundColor: '#FFF'}]}>
            <HeaderComponent />
            <View style={styles.container}>
                {
                    isLoading || isLoadingAction ? (
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Image
                                style={{height: 80, width: 80}}
                                resizeMode="contain"
                                source={LoadingBig}
                                autoPlay
                            />
                        </View>
                    ) : (
                        <View style={styles.container}>
                            {
                                dataChats.length != 0 ? (
                                    <FlatList
                                        inverted
                                        data={dataChats}
                                        horizontal={false}
                                        ref={refDataChats}
                                        renderItem={renderDataMsg}
                                        onEndReachedThreshold={1}
                                        onEndReached={() => dataLoadMore()}
                                        showsVerticalScrollIndicator={false}
                                        ListFooterComponent={() => renderHeader()}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
                                    />
                                ) : (
                                    listEmptyComponent()
                                )
                            }
                        </View>
                    )
                }

                {Platform.OS == 'android' ?(
                    <View>
                        <KeyboardAvoidingView>
                            <View
                                onLayout={(event) => { find_dimesions(event.nativeEvent.layout) }} 
                                style={{
                                    backgroundColor: '#F2F2F2',
                                    borderColor: '#EBEBEB',
                                    borderWidth: 1,
                                    width: dimenWidth-moderateScale(40),
                                    marginHorizontal: moderateScale(20),
                                    marginVertical: 18,
                                    maxHeight: 87,
                                    borderRadius: 10,
                                    alignSelf: 'flex-end',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    paddingHorizontal: 10,
                                    alignItems: 'flex-end'
                                }}
                            >
                                <View
                                    style={{width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 12}}
                                >
                                    {/* <TouchableOpacity>
                                        <IconSmile width={24} height={24} onPress={() => pressEmot()}/>
                                    </TouchableOpacity> */}
                                    <TouchableOpacity onPress={() => refRBSheetAttach.current.open()}>
                                        {imageIconAttachment(moderateScale(24), moderateScale(24))}
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    ref={refTextInput}
                                    multiline={true}
                                    value={chatSend}
                                    style={styles.inputs}
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    placeholder="Type a message"
                                    onFocus={()=>setShow(false)}
                                    placeholderStyle={{color: '#2E3034'}}
                                    onChangeText={chatSend => changeTextMsg(chatSend)}
                                />
                                <View
                                    style={{width: '23%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 9}}
                                >
                                    {
                                        micISActive ? (
                                            <TouchableOpacity 
                                                onPress={() => _stopRecognizing()} 
                                                style={{
                                                    shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 1,
                                                    },
                                                    shadowOpacity: 0.20,
                                                    shadowRadius: 1.41,

                                                    elevation: 2,
                                                }} 
                                            >
                                                {imageIconMicActive(moderateScale(32), moderateScale(32))}
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity 
                                                onPress={() => _startRecognizing()} 
                                                style={{
                                                    shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 1,
                                                    },
                                                    shadowOpacity: 0.20,
                                                    shadowRadius: 1.41,

                                                    elevation: 3,
                                                }} 
                                            >
                                                {imageIconMicInactive(moderateScale(32), moderateScale(32))}
                                            </TouchableOpacity>
                                        )
                                    }
                                    <TouchableOpacity onPress={() => onSendChat(chatSend, "text")}>
                                        {imageIconPaperPlane(moderateScale(28), moderateScale(28))}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                        {showMsgTemp == 1 ? (
                            <View
                                style={{
                                    alignSelf: 'center',
                                    position: 'absolute',
                                    bottom: heightChatSend,
                                    left: moderateScale(20),
                                    right: moderateScale(20),
                                    backgroundColor: '#ffffff',
                                    maxHeight: moderateScale(200),

                                    //Box Shadow
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.20,
                                    shadowRadius: 1.41,

                                    elevation: 2,

                                }}
                            >
                                <FlatList
                                    data={dtMsgTempFilter}
                                    renderItem={renderItemMsgTemp}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        ):null}
                    </View>
                ):(
                    <>
                        <KeyboardAvoidingView
                            behavior="padding"
                            keyboardShouldPersistTaps='handle'
                            keyboardVerticalOffset={keyboardVerticalOffset}
                        >
                            <View
                                onLayout={(event) => { find_dimesions(event.nativeEvent.layout) }} 
                                style={{
                                    backgroundColor: '#F2F2F2',
                                    borderColor: '#EBEBEB',
                                    borderWidth: 1,
                                    width: dimenWidth-moderateScale(40),
                                    marginHorizontal: moderateScale(20),
                                    marginVertical: 18,
                                    maxHeight: 87,
                                    borderRadius: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    padding: 10,
                                    alignItems: 'center'
                                }}
                            >
                                <View
                                    style={{width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}
                                >
                                    {/* <TouchableOpacity>
                                        <IconSmile width={24} height={24} onPress={() => pressEmot()}/>
                                    </TouchableOpacity> */}
                                    <TouchableOpacity onPress={() => refRBSheetAttach.current.open()}>
                                        {imageIconAttachment(moderateScale(24), moderateScale(24))}
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    ref={refTextInput}
                                    multiline={true}
                                    value={chatSend}
                                    style={styles.inputs}
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    placeholder="Type a message"
                                    onFocus={()=>setShow(false)}
                                    placeholderStyle={{color: '#2E3034'}}
                                    onChangeText={chatSend => changeTextMsg(chatSend)}
                                />
                                <View
                                    style={{width: '23%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}
                                >
                                    {
                                        micISActive ? (
                                            <TouchableOpacity 
                                                onPress={() => _stopRecognizing()} 
                                                style={{
                                                    shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 1,
                                                    },
                                                    shadowOpacity: 0.20,
                                                    shadowRadius: 1.41,

                                                    elevation: 2,
                                                }} 
                                            >
                                                {imageIconMicActive(moderateScale(32), moderateScale(32))}
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity 
                                                onPress={() => _startRecognizing()} 
                                                style={{
                                                    shadowColor: "#000",
                                                    shadowOffset: {
                                                        width: 0,
                                                        height: 1,
                                                    },
                                                    shadowOpacity: 0.20,
                                                    shadowRadius: 1.41,

                                                    elevation: 3,
                                                }} 
                                            >
                                                {imageIconMicInactive(moderateScale(32), moderateScale(32))}
                                            </TouchableOpacity>
                                        )
                                    }
                                    <TouchableOpacity onPress={() => onSendChat(chatSend, "text")}>
                                        {imageIconPaperPlane(moderateScale(28), moderateScale(28))}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                        {showMsgTemp == 1 ? (
                            <View
                                style={{
                                    alignSelf: 'center',
                                    position: 'absolute',
                                    bottom: heightChatSend + moderateScale(90),
                                    left: moderateScale(20),
                                    right: moderateScale(20),
                                    backgroundColor: '#ffffff',
                                    maxHeight: moderateScale(200),

                                    //Box Shadow
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.20,
                                    shadowRadius: 1.41,

                                    elevation: 2,

                                }}
                            >
                                <FlatList
                                    data={dtMsgTempFilter}
                                    renderItem={renderItemMsgTemp}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        ):null}
                    </>
                    
                )}

                
                


                
            </View>
            {/* {
                !showKeyword
                ? (
                    <EmojiBoard containerStyle={{position: show ? 'relative' : 'absolute'}} labelStyle={{fontSize: 15,  color: '#5588C3'}} tabBarStyle={{backgroundColor: '#fff'}} numRows={10} emojiSize={20} categoryIconSize={15} showBoard={show} onClick={onClick} />
                ):null
            } */}
            {/* <AlertToastSuccess toastSuccess={toastSuccess}/>
            <AlertToastFailed toastFailed={toastFailed}/> */}
            <RBSheet
                duration={400}
                ref={refRBSheetEndNotes}
                closeOnPressMask={() => cancelNoted()}
                closeOnPressBack={() => cancelNoted()}
                height={dimenHeight/2}
                customStyles={{
                    container: {
                        backgroundColor: 'transparent',
                    }
                }}
            >
                <View style={[styles.BSView, {alignItems: 'center', paddingTop: 20}]}>
                    <View 
                        style={{
                            width: dimenWidth,
                            alignItems: 'flex-end',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => cancelNoted()}
                            style={{
                                marginRight: 14
                            }}
                        >
                            <IconX height={22} width={22}  />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 20,
                                marginTop: 10,
                                marginBottom: 6,
                                color: '#2E3034',
                                fontWeight: 'bold',
                                alignSelf: 'center',
                                
                            }}
                        >
                            Mark as resolved
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                marginBottom: 20,
                                color: '#2E3034',
                                fontWeight: '800',
                                alignSelf: 'center',
                                
                            }}
                        >
                            End Notes
                        </Text>
                    </View>
                    <TextInput
                        multiline={true}
                        value={notedSend}
                        keyboardType="default"
                        style={styles.inputEndNoted}
                        onChangeText={notedSend => changeTextNoted(notedSend)}
                    />
                    <View
                        style={{
                            marginTop: 30,
                            flexDirection: 'row',
                        }}
                    >
                        {isLoadingBSheet?(
                            <View
                                onPress={() => onResolved()}
                                style={{
                                    flex: 1,
                                    alignItems:'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#003473',
                                    paddingVertical: 8,
                                    borderRadius: 10,
                                }}
                            >
                                <ActivityIndicator color='#fff' size='small' />
                            </View>
                        ):(
                            <TouchableOpacity
                                onPress={() => onResolved()}
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    backgroundColor: '#003473',
                                    paddingVertical: 8,
                                    borderRadius: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#fff',
                                        fontWeight: '800',
                                        alignSelf: 'center',
                                        
                                    }}
                                >
                                    Resolve Chat
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </RBSheet>

            <RBSheet
                duration={400}
                ref={refRBSheetMore}
                closeOnPressMask={true}
                closeOnPressBack={true}
                customStyles={{
                    container: {
                        backgroundColor: 'transparent',
                    }
                }}
            >
                <View style={styles.BSView}>
                    <Text
                        style={{
                            fontSize: 18,
                            marginBottom: 26,
                            color: '#2E3034',
                            fontWeight: 'bold',
                            
                        }}
                    >
                        Actions
                    </Text>
                    {actionsHandSolv()}
                    <TouchableOpacity style={{marginBottom: 14}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: 37, justifyContent: 'center', alignItems: 'center'}}>
                                {imageIconPin(moderateScale(24), moderateScale(24))}
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    marginLeft: 16,
                                    lineHeight: 24,
                                    fontWeight: 'bold',
                                    letterSpacing: 0.1,
                                    
                                }}
                            >
                                Pin this user {'&'} coversations
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{marginBottom: 14}}
                        onPress={() => goToAssign()}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: 37, justifyContent: 'center', alignItems: 'center'}}>
                                {imageIconAssignTo(moderateScale(24), moderateScale(24))}
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    marginLeft: 16,
                                    lineHeight: 24,
                                    fontWeight: 'bold',
                                    letterSpacing: 0.1,
                                    
                                }}
                            >
                                Assign to team
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </RBSheet>
            <BSAttachSendChat refRBSheetAttach={refRBSheetAttach} id={id} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imgIconChat: {
        width: '8%',
        height: 25,
        resizeMode: 'contain'
    },
    inputEndNoted: {
        borderWidth: 1,
        paddingVertical: 14,
        width: dimenWidth-60,
        paddingHorizontal: 18,
        borderColor: '#969696',
        textAlignVertical: 'top',
        minHeight: dimenHeight/5,
        backgroundColor: '#f5f5f5',
    },
    inputs: {
        width: '64%',
        backgroundColor: '#00000000'
    },
    BSView: {
        flex: 1,
        paddingTop: 36,
        width: dimenWidth,
        paddingHorizontal: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
    },
    containListEmpty: {
        height: 250,
        width: dimenWidth-20,
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'center',
        paddingVertical: (dimenHeight-250)/2
    },
    txt1ListEmpty: {
        fontSize: 22,
        lineHeight: 24,
        color: '#A5A5A5',
        fontWeight: '500',
        letterSpacing: 0.1,
        
        textTransform: 'capitalize',
    },
    txt2ListEmpty: {
        fontSize: 14,
        lineHeight: 24,
        color: '#A5A5A5',
        fontWeight: '300',
        letterSpacing: 0.1,
        
        textTransform: 'capitalize',
    },
    backgroundVideo: {
        height: 300,
        borderRadius: 10,
        width: dimenWidth-128,
        backgroundColor: '#000',
        // width: dimenWidth-144,
    }
});

export default React.memo(ChatRoom);
