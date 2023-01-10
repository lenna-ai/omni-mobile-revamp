import * as React  from 'react';

import { 
    Text,
    View,
    Image,
    Platform,
    FlatList,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

// Import Asset
import IconX from './../../assets/image/icon_x.svg';
import IconPlus from './../../assets/image/icon_plus.svg';
import IconBack from './../../assets/image/icon_back.svg';
import IconTrash from './../../assets/image/icon_trash.svg';
import LoadingBig from './../../assets/anime/loading_big.gif';

// Import External
import { Icon, Header } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//Import Internal
import API from '../../utils/api';
import { encodeHashIds } from '../../utils/encode';
import { BSConverNoted } from './component/BSConverNoted';
import { BSAddInformation } from './component/BSAddInformation';
import { putData, getData, postDataOutHeader } from '../../modules/services';
import { 
    changeTagsCustomprof, 
    changeEmailCustomprof, 
    changePhoneCustomprof, 
    changeAdditinfoCustomprof, 
    changeConvernotedCustomprof, 
    changeIdConvernotedCustomprof
} from '../../modules/redux/actions/customerProfile/inCustomerProfile';
import { moderateScale, verticalScale } from '../other/Scaling';
import CheckImageProfileCustomer from './component/CheckImageProfileCustomer';
import { IconCheck, IconFile, IconTrash2 } from '../../assets/icons';
// import { AlertToastSuccess, AlertToastFailed } from '../other/AlertToast';


const dimenWidht = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;
const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';

const Profile = ({ route, navigation }) => {

    const {id} = route.params;

    const dispatch = useDispatch();
    
    let disRooms = useSelector((state) => state.mDataRoomsChat);
    let dataRooms = disRooms.dataRoomsChat;

    const disUser = useSelector((state) => state.mDataUserLogin);
    let dataUser = disUser.dataUserWasLogin;

    let disCustomprof = useSelector((state) => state.mCustomerProfile);
    let dataIdCutomprof = disCustomprof.id;
    let dataTagsCutomprof = disCustomprof.tagsCustomprof;
    let dataEmailCutomprof = disCustomprof.emailCustomprof;
    let dataPhoneCutomprof = disCustomprof.phoneCustomprof;
    let dataAdditinfoCutomprof = disCustomprof.additinfoCustomprof;
    let dataConvernotedCutomprof = disCustomprof.convernotedCustomprof;
    let dataIdConvernotedCutomprof = disCustomprof.idConvernotedCustomprof;

    const toastFailed = React.useRef(null);
    const toastSuccess = React.useRef(null);
    const refRBSheetAddInfo = React.useRef(null);
    const refRBSheetConverNoted = React.useRef(null);

    const [page, setPage] = React.useState(1);
    const [isErrListTags, setIsErrListTags] = React.useState(false);
    
    const [txtIp, setTextIp] = React.useState("");
    const [txtTags, setTxtTags] = React.useState("");
    const [txtEmail, setTextEmail] = React.useState("");
    const [txtPhone, setTextPhone] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadingBs, setLoadingBs] = React.useState(false);
    const [selectEmail, setSelectEmail] = React.useState(false);
    const [selectPhone, setSelectPhone] = React.useState(false);
    const [isLoadEmail, setIsLoadEmail] = React.useState(false);
    const [isLoadPhone, setIsLoadPhone] = React.useState(false);
    const [containProfile, setContainProfile] = React.useState(undefined);

    const [showTags, setShowTags] = React.useState(0);

    const [tags, setTags] = React.useState([]);
    const [addInfo, setAddInfo] = React.useState([]);
    const [containTags, setContainTags] = React.useState([]);
    const [filterTags, setFilterTags] = React.useState([]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dataRooms.find((entry) => {
                if (entry.id == id && entry.id == dataIdCutomprof) {
                    setContainProfile(entry);
                    setTags(dataTagsCutomprof);
                    setTextPhone(dataPhoneCutomprof);
                    setTextEmail(dataEmailCutomprof);
                    setTextIp(entry.created_by.ip_address);
                    setAddInfo(dataAdditinfoCutomprof);
                    setTimeout(() => {
                        console.log("tags", tags);
                        setIsLoading(false);
                    }, 2000);
                }
            });
        });
        return unsubscribe;
    }, navigation);

    React.useEffect(() => {
        if (!isErrListTags) {
            getContainListTags();
        } 
    }, [page]);

    const getContainListTags = async() => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        try {
            let res = await getData(API.PATH + encodeHashIds(dataUser.app_id) +'/tag?page=' + page, headers);
            
            console.log("res0a", res);
            
            if (res.data.length != 0) {
                if (page == 1) {
                    setContainTags(res.data);
                } else {
                    let data = containTags.concat(res.data);
                    // let dataT = [...containTags, ...res.data];
                    setContainTags(dataT);
                }
                setPage(page+1);
            } else {
                setIsErrListTags(true);
            }
        } catch (e) {
            setIsErrListTags(true);
        }
    }

    const roomTagCustomer = async(tagId, txt) => {
        setFilterTags([]);
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        let params = {
            tag_id:  tagId,
            room_id: id
        }

        try {
            let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/room-tag', params, headers);
            console.log("TAGS___", res);
            
            if (res.success) {
                let listTags = tags;

                let data = undefined;
                data = containTags.filter(function(entry) {
                    return entry.id == res.data.id;
                });

                if (data != undefined) {
                    let mData = {
                        app_id: dataUser.app_id,
                        created_at: res.data.created_at,
                        id: res.data.id,
                        name: txt,
                        pivot: {
                            id: res.data.id,
                            tag_id: res.data.tag_id, 
                            room_id: res.data.room_id, 
                            updated_at: res.data.created_at, 
                            created_at: res.data.updated_at
                        },
                        updated_at: res.data.updated_at
                    }
                    listTags.push(mData);
                    dispatch(changeTagsCustomprof(listTags));
                    setTags(listTags);
                }
                setTxtTags('');
                toastSuccess.current.show(res.message, 1000);
            } else {
                toastFailed.current.show(res.message, 1000);
            }
        } catch (error) {
            console.log(error);
            
            let msg = "Terjadi kendala teknis, Harap coba kembali!";
            toastFailed.current.show(msg, 1000);
        }
        
    }

    const addTagCustomer = async() => {
        setFilterTags([]);
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }
        let params = {
            name:  txtTags,
            room_id: id
        }

        try {
            let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/tag/with-room', params, headers);
            console.log("TAGS___", res);
            
            if (res.success) {
                let listTags = tags;
                listTags.push(res.data);
                dispatch(changeTagsCustomprof(listTags));
                setTags(listTags);
                setTxtTags('');
                toastSuccess.current.show(res.message, 1000);
            } else {
                toastFailed.current.show(res.message, 1000);
            }
        } catch (error) {
            console.log(error);
            
            let msg = "Terjadi kendala teknis, Harap coba kembali!";
            toastFailed.current.show(msg, 1000);
        }
        
    }

    const HeaderComponent = () => {
        return (
            <Header
                placement="left"
                centerComponent={() => {
                    return (
                        <View style={{width: '100%'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '82%', height: 43}}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <IconBack />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        marginLeft: 6,
                                        color: '#000',
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Customer Profile
                                </Text>
                                
                            </View>
                        </View>
                    )
                }}
                containerStyle={{
                    height: 88,
                    paddingTop: 5,
                    marginHorizontal: -12,
                    backgroundColor: '#FFF',
                    justifyContent: 'center',
                    borderBottomColor: '#fff'
                }}
            />

        )
    }

    const TagComponent = ({item}) => {
        return (
            <View 
                style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10
                }}
            >
                <View
                    style={{
                        borderRadius: 30,
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        backgroundColor: '#5588C3'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            color: '#fff',
                            lineHeight: 24,
                            letterSpacing: 0.1,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            
                            textTransform: 'capitalize',
                        }}
                    >{item.name}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => onDeleteTags(item.pivot.id)}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 4,
                    }}
                >
                    <IconX />
                </TouchableOpacity>
                
            </View>
        )
    }

    const onChangeConverNoted = async(content) => {
        if (content != "") {
            setLoadingBs(true);
            let headers = {
                token: dataUser.token,
                userId: encodeHashIds(dataUser.user_id)
            }
            let params = {
                content: content,
                room_id: id,
            }
            if (dataIdConvernotedCutomprof != 0 && dataIdConvernotedCutomprof > 0) {
                try {
                    let res = await postDataOutHeader(
                        API.PATH + encodeHashIds(dataUser.app_id) +'/notes/' + dataIdConvernotedCutomprof + '/update', 
                        params, 
                        headers
                    );
                    if (res.success) {
                        dispatch(changeConvernotedCustomprof(content));
                        setLoadingBs(false);
                        refRBSheetConverNoted.current.close();
                        toastSuccess.current.show(res.message, 1000);
                    } else {
                        setLoadingBs(false);
                        refRBSheetConverNoted.current.close();
                        toastFailed.current.show(res.message, 1000);
                    }
                } catch (error) {
                    setLoadingBs(false);
                    refRBSheetConverNoted.current.close();
                    let msg = "Terjadi kendala teknis, Harap coba kembali!"
                    toastFailed.current.show(msg, 1000);
                }
                
            } else {
                try {
                    let res = await postDataOutHeader(
                        API.PATH + encodeHashIds(dataUser.app_id) +'/notes', 
                        params, 
                        headers
                    );
                    console.log("/notes", res);
                    
                    if (res.success) {
                        dispatch(changeIdConvernotedCustomprof(res.data.id));
                        dispatch(changeConvernotedCustomprof(res.data.content));
                        setLoadingBs(false);
                        refRBSheetConverNoted.current.close();
                        toastSuccess.current.show(res.message, 1000);
                    } else {
                        setLoadingBs(false);
                        refRBSheetConverNoted.current.close();
                        toastFailed.current.show(res.message, 1000);
                    }
                } catch (error) {
                    setLoadingBs(false);
                    refRBSheetConverNoted.current.close();
                    let msg = "Terjadi kendala teknis, Harap coba kembali!"
                    toastFailed.current.show(msg, 1000);
                }
            }
            
        }
    }

    const onAddInfo = async(title, desc) => {
        if (title != "" && desc != "") {
            setLoadingBs(true);
            let headers = {
                token: dataUser.token,
                userId: encodeHashIds(dataUser.user_id)
            }
            let params = {
                room_id: id,
                title: title,
                description: desc,
                user_id: dataIdCutomprof
            }

            try {
                let res = await postDataOutHeader(
                    API.PATH + encodeHashIds(dataUser.app_id) +'/additional-information', 
                    params,
                    headers
                );
                if (res.success) {
                    let data = addInfo;
                    data.push(res.data);
                    dispatch(changeAdditinfoCustomprof(data));
                    setAddInfo(data);
                    setLoadingBs(false);
                    refRBSheetAddInfo.current.close();
                    toastSuccess.current.show(res.message, 1000);
                } else {
                    setLoadingBs(false);
                    refRBSheetAddInfo.current.close();
                    refRBSheetEndNotes.current.close();
                    toastFailed.current.show(res.message, 1000);
                }
            } catch (error) {
                setLoadingBs(false);
                refRBSheetAddInfo.current.close();
                let msg = "Terjadi kendala teknis, Harap coba kembali!"
                toastFailed.current.show(msg, 1000);
            }
            
        }
    }

    const onDeleteTags = async (idTags) => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        console.log("idTags", idTags);
        

        let res = await getData(API.PATH + encodeHashIds(dataUser.app_id) +'/room-tag/' + idTags +'/delete', headers);
        console.log("del_list_tags", res);
        if (res.success) {
            let data = tags.filter(function(entry) {
                return entry.pivot.id != idTags;
            });
            
            dispatch(changeTagsCustomprof(data));
            setTags(data);
            
        }
    }
    
    const onDeleteAddInfo = async idAddInfo => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        let res = await getData(API.PATH + encodeHashIds(dataUser.app_id) +'/additional-information/' + idAddInfo +'/delete', headers);
        console.log("del_add_inf", res);
        if (res.success) {
            let data = addInfo.filter(function(entry) {
                return entry.id != idAddInfo;
            });
            dispatch(changeAdditinfoCustomprof(data));
            setAddInfo(data);

            // let dataObj = containProfile;
            // dataObj.additional_informations = data;

            // let dataVar = dataRooms;

            // let dt = undefined
            // let index = 0;

            // dataRooms.filter((entry, i) => {
            //     if (entry.id == id) {
            //         dt = entry;
            //         index = i
            //     }
            // });

            // if (dt != undefined) {
            //     dataVar[index] = dataObj;
            //     dispatch(addRoomsChat(data));
            // }
        }
    }

    const listAdditional = ({item}) => {
        return (
            <View style={{marginHorizontal: verticalScale(10), marginTop: verticalScale(10)}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: '35%'}}>
                        <Text
                            style={{
                                color: '#4F4F4F',
                                letterSpacing: 0.1,
                                
                                textTransform: 'uppercase',
                                fontSize: moderateScale(12),
                            }}
                        >
                            {item.title}
                        </Text>
                    </View>
                    <View style={{width: '65%', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text
                            style={{
                                fontSize: 12,
                                color: '#4F4F4F',
                                fontWeight: '700',
                                letterSpacing: 0.1,
                                
                                textTransform: 'capitalize',
                            }}
                        >
                            {item.description}
                        </Text>
                        <IconTrash2 height={16} width={16} />
                    </View>
                </View>
            </View>
        )
    }

    const onCheckEmail = async() => {
        if (containProfile.created_by.email == null) {
            if (txtEmail != "") {
                setIsLoadEmail(true);
            } else {
                setSelectEmail(false);
            }
        } else {
            if (txtEmail != "" && txtEmail != containProfile.created_by.email) {
                setIsLoadEmail(true);
                let headers = {
                    token: dataUser.token,
                    userId: encodeHashIds(dataUser.user_id)
                }
                let params = {
                    email: txtEmail,
                    phone: containProfile.created_by.phone
                }
                let res = await putData(
                    API.PATH + encodeHashIds(dataUser.app_id) +'/user/'+ containProfile.created_by.id + '/update', 
                    params,
                    headers
                );
                console.log("txt_email_res", res);
                if (res.success) {
                    dispatch(changeEmailCustomprof(txtEmail));
                    setIsLoadEmail(false);
                }
            }
        }
    }

    const onCheckPhone = async() => {
        if (containProfile.created_by.phone == null) {
            if (txtPhone != "") {
                setIsLoadPhone(true);
            } else {
                setSelectPhone(false);
            }
        } else {
            if (txtPhone != "" && txtPhone != containProfile.created_by.phone) {
                setIsLoadPhone(true);
                let headers = {
                    token: dataUser.token,
                    userId: encodeHashIds(dataUser.user_id)
                }
                let params = {
                    email: containProfile.created_by.email,
                    phone: txtPhone
                }
                let res = await putData(
                    API.PATH + encodeHashIds(dataUser.app_id) +'/user/'+ containProfile.created_by.id + '/update', 
                    params,
                    headers
                );
                console.log("txt_phone_res", res);
                
                if (res.success) {
                    dispatch(changePhoneCustomprof(txtPhone));
                    setIsLoadPhone(false);
                }
            }
        }
    }

    const changeTextTag = (text) => {
        setTxtTags(text);
        if (text != "") {
            console.log("tagasad", containTags);

            let mFilterTags = containTags.filter((item) => {
                return item.name.toLowerCase().match(text.toLowerCase())
            })
            
            if (mFilterTags != 0) {
                setShowTags(1);
                setFilterTags(mFilterTags);
            } else {
                setShowTags(0);
            }
        } else {
            setShowTags(0);
        }
    };

    const onChangeValueNoTelp = (value) => {
        let dataValue = value;
        if (/^([0-9][0-9]*|0)$/.test(dataValue) || dataValue === '') {
            setTextPhone(dataValue)
        }
    }

    const onClickShowTempTag = (txt, id) => {
        setTxtTags(txt);
        setShowTags(0);
        roomTagCustomer(id, txt);
    }

    const renderItemTags = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => onClickShowTempTag(item.name, item.id)}>
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
                            paddingVertical: moderateScale(6)
                        }}
                    >
                        <Text
                            style={{
                                width: '90%',
                                
                                fontSize: moderateScale(14),
                                lineHeight: moderateScale(24),
                                marginVertical: moderateScale(2),
                            }}
                        >
                            {item.name}
                        </Text>
                    </View>
                </TouchableOpacity>
        )
    }

    const profileContainer = () => {
        
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ImageZoom', {
                            imageUrl: containProfile.created_by.picture
                        })}
                    >
                        <CheckImageProfileCustomer 
                            dimenWidth={dimenWidht}
                            url={containProfile.created_by.picture} 
                        />
                    </TouchableOpacity>
                    <Text
                        numberOfLines={1}
                        style={{
                            width: '75%',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            
                            fontSize: moderateScale(20),
                            textTransform: 'capitalize',
                        }}
                    >
                        {containProfile.created_by.name}
                    </Text>
                </View>
                <View 
                    style={{
                        height: 0.5,
                        backgroundColor: '#000006',
                        width: Dimensions.get('screen').width,
                        marginTop: Dimensions.get('screen').width/verticalScale(13)
                    }}
                />
                <View 
                    style={{
                        marginVertical: moderateScale(20),
                        marginHorizontal: moderateScale(28), 
                    }
                }>
                    <Text
                        style={{
                            color: '#4F4F4F',
                            letterSpacing: 0.2,
                            fontWeight: 'bold',
                            
                            textTransform: 'uppercase',
                            fontSize: moderateScale(14),
                            lineHeight: verticalScale(24),
                        }}
                    >
                        Customer Information
                    </Text>
                    <View 
                        style={{
                            marginTop: moderateScale(16),
                            marginHorizontal: moderateScale(10), 
                        }}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: '35%'}}>
                                <Text
                                    style={{
                                        color: '#4F4F4F',
                                        letterSpacing: 0.1,
                                        
                                        textTransform: 'capitalize',
                                        fontSize: moderateScale(12),
                                        lineHeight: moderateScale(24),
                                    }}
                                >
                                    Email
                                </Text>
                            </View>
                            <View 
                                style={{
                                    width: '65%', 
                                    flexDirection: 'row', 
                                    alignItems: 'center',
                                }}
                            >
                                {
                                    containProfile.created_by.email == null
                                    ? selectEmail 
                                        ? (
                                            <>
                                                <TextInput
                                                    value={txtEmail}
                                                    style={styles.inputsInformation}
                                                    keyboardType="default"
                                                    placeholder="Type here"
                                                    onChangeText={text => setTextEmail(text)}
                                                />

                                                {
                                                    isLoadEmail
                                                    ? (
                                                        <ActivityIndicator 
                                                            color='#5588C3'
                                                            style={{width: moderateScale(16), height: moderateScale(16)}}
                                                        />
                                                    ) : (
                                                    <TouchableOpacity onPress={() => onCheckEmail()}>
                                                        <IconCheck height={16} width={16} />
                                                    </TouchableOpacity>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <TouchableOpacity onPress={() => setSelectEmail(true)}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <IconPlus width={moderateScale(22)} height={moderateScale(22)}/>
                                                    <Text
                                                        style={{
                                                            color: '#5588C3',
                                                            fontWeight: 'bold',
                                                            letterSpacing: 0.1,
                                                            
                                                            textTransform: 'capitalize',
                                                            fontSize: moderateScale(12),
                                                            marginLeft: moderateScale(8),
                                                            lineHeight: moderateScale(24),
                                                        }}
                                                    >
                                                        Add Email
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    : (
                                        <>
                                            <TextInput
                                                value={txtEmail}
                                                style={styles.inputsInformation}
                                                keyboardType="default"
                                                placeholder="Type here"
                                                onChangeText={text => setTextEmail(text)}
                                            />

                                            {
                                                isLoadEmail
                                                ? (
                                                    <ActivityIndicator 
                                                        color='#5588C3'
                                                        style={{width: 16, height: 16}}
                                                    />
                                                ) : (
                                                            <TouchableOpacity onPress={() => onCheckEmail()}>
                                                        <IconCheck height={16} width={16} />
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{marginHorizontal: 10, marginTop: 10}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{width: '35%'}}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        lineHeight: 24,
                                        color: '#4F4F4F',
                                        letterSpacing: 0.1,
                                        
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    Phone
                                </Text>
                            </View>
                            <View style={{width: '65%', flexDirection: 'row', alignItems: 'center'}}>
                                {
                                    containProfile.created_by.phone == null
                                    ? selectPhone 
                                        ? (
                                            <>
                                                <TextInput
                                                    value={txtPhone}
                                                    style={styles.inputsInformation}
                                                    keyboardType="numeric"
                                                    placeholder="Type here"
                                                    onChangeText={text => onChangeValueNoTelp(text)}
                                                />

                                                {
                                                    isLoadPhone
                                                    ? (
                                                        <ActivityIndicator 
                                                            color='#5588C3'
                                                            style={{width: 16, height: 16}}
                                                        />
                                                    ) : (
                                                        <TouchableOpacity onPress={() => onCheckPhone()}>
                                                            <IconCheck height={16} width={16} />
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <TouchableOpacity onPress={() => setSelectPhone(true)}>
                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                    <IconPlus width={22} height={22}/>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            marginLeft: 8,
                                                            lineHeight: 24,
                                                            color: '#5588C3',
                                                            fontWeight: 'bold',
                                                            letterSpacing: 0.1,
                                                            
                                                            textTransform: 'capitalize',
                                                        }}
                                                    >
                                                        Add Phone
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    : (
                                        <>
                                            <TextInput
                                                value={txtPhone}
                                                style={styles.inputsInformation}
                                                keyboardType="numeric"
                                                placeholder="Type here"
                                                onChangeText={text => onChangeValueNoTelp(text)}
                                            />

                                            {
                                                isLoadPhone
                                                ? (
                                                    <ActivityIndicator 
                                                        color='#5588C3'
                                                        style={{width: 16, height: 16}}
                                                    />
                                                ) : (
                                                    <TouchableOpacity onPress={() => onCheckPhone()}>
                                                        <IconCheck height={16} width={16} />
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{marginHorizontal: 10, marginTop: 10}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width: '35%'}}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        lineHeight: 24,
                                        color: '#4F4F4F',
                                        letterSpacing: 0.1,
                                        
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Ip
                                </Text>
                            </View>
                            <View style={{width: '65%'}}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        lineHeight: 24,
                                        color: '#4F4F4F',
                                        fontWeight: '700',
                                        letterSpacing: 0.1,
                                        
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {txtIp}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <FlatList
                        data={addInfo}
                        horizontal={false}
                        renderItem={listAdditional}
                        keyExtractor={item => item.id}
                    />
                    <View style={{marginTop: 22, marginLeft: 8}}>
                        <TouchableOpacity onPress={() => refRBSheetAddInfo.current.open()}>
                            <View style={{flexDirection: 'row'}}>
                                <IconPlus width={22} height={22}/>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        marginLeft: 8,
                                        lineHeight: 24,
                                        color: '#5588C3',
                                        fontWeight: 'bold',
                                        letterSpacing: 0.1,
                                        
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    Additional Information
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View 
                    style={{
                        height: 0.5,
                        backgroundColor: '#000006',
                        width: Dimensions.get('screen').width
                    }}
                />
                <View style={{marginHorizontal: 28, marginVertical: 20}}>
                    <Text
                        style={{
                            fontSize: 14,
                            lineHeight: 24,
                            color: '#4F4F4F',
                            letterSpacing: 0.2,
                            fontWeight: 'bold',
                            
                            textTransform: 'uppercase',
                        }}
                    >
                        Conversation Notes
                    </Text>
                    {dataConvernotedCutomprof != "" ?(
                        <View style={{flex: 1, flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                            <Text
                                style={{
                                    flex: 1,
                                    fontSize: 14,
                                    marginRight: 8,
                                    lineHeight: 24,
                                    letterSpacing: 0.1,
                                    
                                }}
                            >
                                {dataConvernotedCutomprof}
                            </Text>
                            <TouchableOpacity onPress={() => refRBSheetConverNoted.current.open()}>
                                <IconFile height={22} width={22} />
                            </TouchableOpacity>
                        </View>
                    ):(
                        <View style={{marginTop: 22, marginLeft: 8}}>
                            <TouchableOpacity onPress={() => refRBSheetConverNoted.current.open()}>
                                <View style={{flexDirection: 'row'}}>
                                    <IconPlus width={22} height={22}/>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            marginLeft: 8,
                                            lineHeight: 24,
                                            color: '#5588C3',
                                            fontWeight: 'bold',
                                            letterSpacing: 0.1,
                                            
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        Type a note
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View 
                    style={{
                        height: 0.5,
                        backgroundColor: '#000006',
                        width: Dimensions.get('screen').width
                    }}
                />
                <View style={{marginHorizontal: 28, marginVertical: 20}}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#4F4F4F',
                            letterSpacing: 0.2,
                            fontWeight: 'bold',
                            
                            textTransform: 'uppercase',
                        }}
                    >
                        Tags
                    </Text>

                    <TextInput
                        value={txtTags}
                        returnKeyType="go"
                        style={styles.inputs}
                        keyboardType="default"
                        placeholder="Add new tags"
                        onSubmitEditing={() => addTagCustomer()}
                        onChangeText={text => changeTextTag(text)}
                        placeholderTextColor={
                            txtTags == '' 
                            ? 'rgba(85, 136, 195, 0.5)'
                            : 'rgb(85, 136, 195)'
                        }
                    />

                    {
                        showTags == 1 ? (
                            <View
                                style={{
                                    alignSelf: 'center',
                                    position: 'absolute',
                                    bottom: moderateScale(60),
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
                                    data={filterTags}
                                    renderItem={renderItemTags}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        ) : null
                    }
                    
                    <View style={{width: dimenWidht-56, flexDirection: 'row', flexWrap: 'wrap'}}>
                        {
                            tags.length != 0 || tags !== undefined
                            ? tags.map((item) => {
                                    return (<TagComponent item={item}/>);
                                })
                            : null
                        }
                    </View>
                </View>
                <View 
                    style={{
                        height: 0.5,
                        backgroundColor: '#000006',
                        width: Dimensions.get('screen').width
                    }}
                />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={[styles.container, {flex: 1, alignItems: 'center', justifyContent: 'center'}]}>
                <Image
                    style={{height: 80, width: 80}}
                    resizeMode="contain"
                    source={LoadingBig}
                    autoPlay
                />
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <HeaderComponent />
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    enableResetScrollToCoords={true}
                    contentContainerStyle={{flexGrow: 1}}
                >
                    {profileContainer()}
                </KeyboardAwareScrollView>
                <BSAddInformation 
                    refRBSheetAddInfo={refRBSheetAddInfo} 
                    onAddInfo={(title, desc) => onAddInfo(title, desc)} 
                    loadingBs={loadingBs} 
                />
                <BSConverNoted 
                    refRBSheetAddInfo={refRBSheetConverNoted} 
                    onChangeConverNoted={(content) => onChangeConverNoted(content)} 
                    loadingBs={loadingBs} 
                    dataConvernotedCutomprof={dataConvernotedCutomprof}
                />
                {/* <AlertToastSuccess toastSuccess={toastSuccess}/>
                <AlertToastFailed toastFailed={toastFailed}/> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputs: {
        fontSize: 12,
        borderRadius: 10,
        marginVertical: 15,
        paddingVertical: 15,
        letterSpacing: 0.1,
        fontWeight: 'bold',
        marginHorizontal: 4,
        paddingHorizontal: 20,
        
        color: 'rgb(85, 136, 195)',
        backgroundColor: '#F3F3F3',
    },
    inputsInformation: {
        flex: 1,
        color: '#4F4F4F',
        fontWeight: '700',
        letterSpacing: 0.1,
        
        borderColor: '#c0c2c4',
        fontSize: moderateScale(12),
        marginRight: moderateScale(8),
        borderWidth: moderateScale(1),
        borderRadius: moderateScale(10),
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(10),
    }
});

export default React.memo(Profile);