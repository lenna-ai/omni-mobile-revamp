import * as React  from 'react';

import { 
    Text,
    View,
    Image,
    Platform,
    TextInput,
    FlatList,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground
} from 'react-native';

// Import Internal
import API from './../../../utils/api';
import { encodeHashIds } from '../../../utils/encode';
import { getData, putData, postDataOutHeader, postDataForFormData } from '../../../modules/services';

// Import Asset
import IconBack from './../../../assets/image/icon_back.svg';
import IconSearch from './../../../assets/image/icon_search.svg';
import LoadingBig from './../../../assets/anime/loading_big.gif';

// Import Third Party
import moment from 'moment';
import { useSelector } from 'react-redux';
import {Header, Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import { moderateScale } from './../../other/Scaling';
import EmptyComponent from '../../other/EmptyComponent';
import DocumentPicker from 'react-native-document-picker';
// import { AlertToastSuccess, AlertToastFailed } from '../../other/AlertToast';
import { IconCheckCircle, IconEdit2, IconEyeWhite, IconImage, IconLink, IconPlus, IconPlusCircle, IconTrash2, IconUploadCLoud, IconX, IconXCircle, IconXWhite, imageIconAttachmentWhite } from '../../../assets/icons';

const dimenWidth = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;
const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';

const MessageTemplate = ({ navigation }) => {

    const toastFailed = React.useRef(null);
    const toastSuccess = React.useRef(null);
    const refRBSheetEdit = React.useRef(null);
    const refRBSheetInfo = React.useRef(null);
    const refRBSheetConfirmDel = React.useRef(null);
    const [isDone, setIsDone] = React.useState(true);
    const [isSearch, setIsSearch] = React.useState(false);
    const [textSearch, setTextSearch] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [textKeyword, setTextKeyword] = React.useState("");
    const [textMessage, setTextMessage] = React.useState("");
    const [textWasSearch, setTextWasSearch] = React.useState("");
    const [isLoadingSave, setLoadingSave] = React.useState(false);
    const [containMsgTemp, setContainMsgTemp] = React.useState([]);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [textInfoMsgTemp, setTextInfoMsgTemp] = React.useState("");
    const [statusEditOrCreate, setStatusEditOrCreate] = React.useState(2);
    const [pageMsgSearchTemplate, setPageMsgSearchTemplate] = React.useState(1);
    const [dataEditMessageTemplate, setDataEditMessageTemplate] = React.useState([]);
    const [indexEditMessageTemplate, setIndexEditMessageTemplate] = React.useState(0);

    const [isFileEmpty, setIsFileEmpty] = React.useState(true);
    const [isLoadingImg, setIsLoadingImg] = React.useState(false);
    const [imageMsgTemplate, setImageMsgTemplate] = React.useState(false);
    const [dataUploadWillShow, setDataUploadWillShow] = React.useState([]);
    const [dataDeleteWillShow, setDataDeleteWillShow] = React.useState([]);

    const disUser = useSelector((state) => state.mDataUserLogin);
    let dataUser = disUser.dataUserWasLogin;

    React.useEffect(() => {
        setIsLoading(true);
        requestToServer();
    }, []);

    const closeSearch = () => {
        if (textWasSearch != "") {
            setTextWasSearch('');
            onFetching();
        }
    }

    const onSubmitSearch = () => {
        if (textSearch != '') {
            setIsLoading(true);
            setPageMsgSearchTemplate(1);
            setTimeout(() => {
                requestToServer();
            }, 2000);
        }
    }

    const clearTextSearch = () => {
        setTextSearch("");
    }

    const showSearchInHeader = () => {
        if (isSearch) {
            return (
                <>
                    <View
                        style={[
                            styles.containInput,
                            {
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                            }
                        ]}
                    >
                        <TouchableOpacity onPress={() => {
                            setIsSearch(false);
                            closeSearch();
                            clearTextSearch();
                        }}>
                            <View style={{marginRight: 4}}>
                            <IconX width={16} height={16} />

                            </View>
                        </TouchableOpacity>
                        <TextInput
                            value={textSearch}
                            autoCapitalize="none"
                            returnKeyType="search"
                            placeholder="Search customer"
                            underlineColorAndroid='transparent'
                            onChangeText={textSearch => setTextSearch(textSearch)}
                            onSubmitEditing={onSubmitSearch}
                        />
                    </View>
                </>
            )
        } else {
            return null
        }
    }

    const goBack = () => {
        navigation.goBack();
    }

    const hideSearchInHeader = () => {
        if (!isSearch) {
            return (
                <>
                    <TouchableOpacity onPress={() => goBack()}>
                        <IconBack />
                    </TouchableOpacity>
                    <Text
                        numberOfLines={1}
                        style={{
                            maxWidth: moderateScale(200),
                            marginLeft: 6,
                            color: '#000',
                            fontSize: 24,
                            fontWeight: 'bold',
                            
                            textTransform: 'uppercase'
                        }}
                    >
                        MESSAGE TEMPLATE
                    </Text>
                    <TouchableOpacity 
                        onPress={() => setIsSearch(true)}
                        style={{
                            right: 0,
                            position: 'absolute',
                        }}
                    >
                        <IconSearch width={16} height={16}/>
                    </TouchableOpacity>
                </>
            )
        } else {
            return null
        }
    }

    const headerComponent = () => {
        return (
            <Header
                placement="left"
                centerComponent={() => {
                    return (
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '82%', height: 43}}>
                                {showSearchInHeader()}
                                {hideSearchInHeader()}
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '18%', justifyContent: 'flex-end'}}>
                                <TouchableOpacity 
                                    onPress={() => onCRMsgTemp(2)}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 40/2,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#049FFF'
                                    }}
                                >
                                    <IconPlus height={16} width={16} />
                                </TouchableOpacity>
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

    const onDelMsgTemp = (item) => {
        let dataDel = [item];
        setDataEditMessageTemplate(dataDel);
        refRBSheetConfirmDel.current.open();
    }

    const itemListMsgTemp = ({item, index}) => {
        return (
            <View style={{
                flexDirection: 'row', 
                marginHorizontal: moderateScale(26),
                marginVertical: moderateScale(10),
                backgroundColor: '#fff',
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 4,
                borderRadius: moderateScale(8),
            }}>
                <View style={{
                    width: '80%', 
                    padding: moderateScale(10),
                }}>
                    <Text
                        style={{
                            color: '#c2c2c2',
                            fontWeight: 'bold',
                            letterSpacing: 0.1,
                            
                            textTransform: 'uppercase',
                            fontSize: moderateScale(12),
                            marginLeft: moderateScale(4),
                            lineHeight: moderateScale(24),
                        }}
                    >
                        Keyword
                    </Text>
                    <Text
                        numberOfLines={2}
                        style={{
                            color: '#000',
                            letterSpacing: 0.1,
                            
                            fontSize: moderateScale(16),
                            marginLeft: moderateScale(4),
                            lineHeight: moderateScale(24),
                            marginBottom: moderateScale(12),
                        }}
                    >
                        {item.key}
                    </Text>
                    <Text
                        style={{
                            color: '#c2c2c2',
                            fontWeight: 'bold',
                            letterSpacing: 0.1,
                            
                            textTransform: 'uppercase',
                            fontSize: moderateScale(12),
                            marginLeft: moderateScale(4),
                            lineHeight: moderateScale(24),
                        }}
                    >
                        Message
                    </Text>
                    <Text
                        numberOfLines={3}
                        style={{
                            color: '#000',
                            letterSpacing: 0.1,
                            
                            fontSize: moderateScale(16),
                            marginLeft: moderateScale(4),
                            lineHeight: moderateScale(24),
                        }}
                    >
                        {item.content}
                    </Text>
                </View>
                <View style={{width: '20%', justifyContent: 'center', alignItems: 'center', paddingVertical: moderateScale(10)}}>
                    <TouchableOpacity
                        onPress={() => onDelMsgTemp(item)}
                    >
                        <IconTrash2 width={24} height={24} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => onCRMsgTemp(1, item, index)}
                        style={{
                            width: 24,
                            height: 24,
                            borderWidth: 1,
                            borderRadius: 28/2,
                            alignItems: 'center',
                            borderColor: '#c2c2c2',
                            justifyContent: 'center',
                            marginVertical: moderateScale(10)
                        }}
                    >
                        <IconEdit2 height={12} width={12} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => onInfoMsgTemp(item.content)}
                        style={{
                            width: 24,
                            height: 24,
                            borderWidth: 1,
                            borderRadius: 28/2,
                            alignItems: 'center',
                            borderColor: '#c2c2c2',
                            justifyContent: 'center',
                        }}
                    >
                        <IconEyeWhite height={12} width={12} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const onInfoMsgTemp = (item) => {
        setTextInfoMsgTemp(item);
        refRBSheetInfo.current.open();
    }

    const offInfoMstTemp = () => {
        setTextInfoMsgTemp("");
        refRBSheetInfo.current.close();
    }

    const onCRMsgTemp = (id, item, index) => {
        // id = 1 open edit message template
        // id = 2 open create message template

        if (id == 1) {
            let dataCRM = [item];
            setTextKeyword(item.key);
            setTextMessage(item.content);
            setIndexEditMessageTemplate(index);
            setDataEditMessageTemplate(dataCRM);
            setDataUploadWillShow(JSON.parse(item.files));
            if (item.files != "[]") {
                setImageMsgTemplate(true);
                setIsFileEmpty(false);
            }
        } else {
            setImageMsgTemplate(false);
            setIsFileEmpty(true);
        }
        setStatusEditOrCreate(id);
        refRBSheetEdit.current.open();
    }

    const changeTextKeyword = (txt) => {
        setTextKeyword(txt);
    }

    const changeTextMessage = (txt) => {
        setTextMessage(txt)
    }

    const closeBSSheetEdit = () => {
        setTextKeyword("");
        setTextMessage("");
        setStatusEditOrCreate(2);
        setImageMsgTemplate(false);
        setDataEditMessageTemplate([]);
        setIndexEditMessageTemplate(0);
        closeBSAttach();
        setLoadingSave(false);
    }

    const requestToServer = async() => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        setContainMsgTemp([]);
        let rqTxtSearch = textSearch;
        console.log("rqTxtSearch", rqTxtSearch);
        let patch = rqTxtSearch != "" ? '/chat-template?page=1&per_page=15&filterText=' + rqTxtSearch : '/chat-template?page=1&per_page=15';
        let res = await getData(API.PATH + encodeHashIds(dataUser.app_id) + patch, headers);
        if (res.data.length != 0) {
            console.log('res.data.leng', res.data.length);
            if (res.data.length < 15) {
                setIsDone(true);
            } else {
                setIsDone(false);
            }
            setPageMsgSearchTemplate(pageMsgSearchTemplate + 1);
            setContainMsgTemp(res.data);
        } else {
            setIsDone(true);
        }
        setIsLoading(false);
        setTextWasSearch(rqTxtSearch);
    }

    const requestToServerMore = async() => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }
        
        if (!isDone) {
            try {
                let patch = textWasSearch != "" ? '/chat-template?page=' + pageMsgSearchTemplate + '&per_page=15&filterText=' + textWasSearch : '/chat-template?page=' + pageMsgSearchTemplate + '&per_page=15';
                let res = await getData(API.PATH + encodeHashIds(dataUser.app_id) + patch, headers);
                if (res.data.length != 0) {
                    let dataMore = [...containMsgTemp, ...res.data];
                    setPageMsgSearchTemplate(pageMsgSearchTemplate + 1);
                    setContainMsgTemp(dataMore);
                    setIsLoadingMore(false);
                } else {
                    setIsDone(true);
                    setIsLoadingMore(false);
                }
            } catch (e) {
                setIsDone(true);
                setIsLoadingMore(false);
            }
        }
        setIsLoadingMore(false);
    }

    const emptyListMsgTemp = () => {
        return (
            <EmptyComponent />
        )
    }

    const onFetching = () => {
        setIsLoading(true);
        clearTextSearch();
        setIsDone(true);
        setIsSearch(false);
        setTextWasSearch('');
        setPageMsgSearchTemplate(1);
        setTimeout(() => {
            requestToServer();
        }, 2000);
    }

    const dataLoadMore = React.useCallback(() => {
        if(isLoadingMore) return;
        setIsLoadingMore(true);
        requestToServerMore();
    });

    const renderFooter = () => {
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

    const addOrChangeMsgTemp = async() => {
        setLoadingSave(true);
        if (textKeyword != "" && textMessage != "") {
            let headers = {
                token: dataUser.token,
                userId: encodeHashIds(dataUser.user_id)
            }
            if (statusEditOrCreate == 1) {
                try {
                    let params = {
                        key: textKeyword,
                        content: textMessage,
                        id: dataEditMessageTemplate[0].id,
                        app_id: dataEditMessageTemplate[0].app_id,
                        created_at: dataEditMessageTemplate[0].created_at,
                        updated_at: dataEditMessageTemplate[0].updated_at,
                        deletedFiles: JSON.stringify(dataDeleteWillShow),
                        files: JSON.stringify(dataUploadWillShow)
                    }
                    let res = await putData(
                        API.PATH + encodeHashIds(dataUser.app_id) +'/chat-template/' + dataEditMessageTemplate[0].id + '/update', 
                        params,
                        headers
                    );
                    if (res.success) {
                        let dataCopy = [...containMsgTemp];
                        dataCopy[indexEditMessageTemplate] = params;
                        setContainMsgTemp(dataCopy);
                        closeBSSheetEdit();
                        toastSuccess.current.show(res.message, 1000);
                    } else {
                        closeBSSheetEdit();
                        toastFailed.current.show(res.message, 1000);
                    }
                } catch (error) {
                    closeBSSheetEdit();
                    toastFailed.current.show("Terjadi kendala teknis, Harap coba lagi!!", 1000);
                }
                
            } else {
                try {
                    let params = {
                        files: JSON.stringify(dataUploadWillShow),
                        key: textKeyword,
                        content: textMessage
                    }
                    console.log("params", params);
                    
                    let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/chat-template', params, headers);
                    if (res.success) {
                        closeBSSheetEdit();
                        toastSuccess.current.show(res.message, 1000, () => {
                            if (textWasSearch == '')  {
                                onFetching();
                            }
                        });
                    } else {
                        closeBSSheetEdit();
                        toastFailed.current.show(res.message, 1000);
                    }
                } catch (error) {
                    closeBSSheetEdit();
                    toastFailed.current.show("Terjadi kendala teknis, Harap coba lagi!!", 1000);
                }
                
            }
        }
    }

    const confirmDel = async(txt) => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }
        
        if (txt == 'yes') {
            try {
                let res = await getData(
                    API.PATH + encodeHashIds(dataUser.app_id) +'/chat-template/' + dataEditMessageTemplate[0].id + '/delete',
                    headers
                );
                if (res.success) {
                    let myArray = containMsgTemp.filter(function( obj ) {
                        return obj.id !== dataEditMessageTemplate[0].id;
                    });    
                    setContainMsgTemp(myArray);   
                    refRBSheetConfirmDel.current.close();
                    toastSuccess.current.show(res.message, 1000);         
                } else {
                    refRBSheetConfirmDel.current.close();
                    toastFailed.current.show(res.message, 1000);
                }
            } catch (error) {
                refRBSheetConfirmDel.current.close();
                toastFailed.current.show("Terjadi kendala teknis, Harap coba lagi!!", 1000);
            }
        }
    }

    const linkMessageTemplate = () => {
        setTextMessage(textMessage + " replace_this_text_with_your_url");
    }

    const imageMessageTemplate = () => {
        setImageMsgTemplate(!imageMsgTemplate);
    }

    const renderItem = ({item}) => {
        console.log("item", item);
        
        return (
            <View
                style={{
                    justifyContent: 'center',
                    padding: moderateScale(2),
                    marginLeft: moderateScale(12), 
                    marginBottom: moderateScale(12),
                    width: (dimenWidth - moderateScale(80))/3,
                    height: ((dimenHeight/2.5) - moderateScale(134))/2
                }}
            >
                <ImageBackground
                    source={{uri: item.originalContentUrl}}
                    resizeMode='contain'
                    style={{
                        width: (dimenWidth - moderateScale(80))/3,
                        height: ((dimenHeight/2.5) - moderateScale(134))/2
                    }}
                > 
                    <View
                        style={{
                            width: (dimenWidth - moderateScale(80))/3,
                            height: ((dimenHeight/2.5) - moderateScale(134))/2,
                            backgroundColor: 'rgba(52, 52, 52, 0.3)'
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => deteleItem(item.fileName)}
                            style={{
                                top: 0,
                                right: 0,
                                position: 'absolute',
                                alignItems: 'flex-end',
                                marginBottom: moderateScale(4),
                            }}
                        >
                            <IconXWhite height={16} width={16} />
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                
                                fontSize: moderateScale(10),
                                marginRight: moderateScale(6),
                                marginBottom: moderateScale(4),
                            }}
                        >
                            {item.fileSize}
                        </Text>
                        <Text
                            numberOfLines={2}
                            style={{
                                color: '#fff',
                                textAlign: 'center',
                                
                                fontSize: moderateScale(10),
                            }}
                        >
                            {item.fileName}
                        </Text>
                    </View>
                </ImageBackground>
                    
                
            </View>
        )
    }

    const bytesToSize = (bytes) => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    
    const uploadFileToServer = async(dateMilliseconds, value) => {
        try {
            setIsLoadingImg(true);
            let dataParams = new FormData();
            dataParams.append("file", {
                uri: value.uri,
                name: dateMilliseconds + "-" + value.name,
                type: value.type
            });

            let data = await postDataForFormData(
                API.PATH + encodeHashIds(dataUser.app_id) + "/chat/upload-file", dataParams,
                dataUser.token,
                encodeHashIds(dataUser.user_id)
            );
            console.log("dataImgTemplate", data);
            
            if (data.success) {
                setIsLoadingImg(false);
                dataArrayShowWill(dateMilliseconds, value);
            } else {
                setIsLoadingImg(false);
            }
        } catch (e) {
            setIsLoadingImg(false);
            console.log(e);
        }
    }

    const dataArrayShowWill = (dateMilliseconds, item) => {
        let dataArr = [];
        let dataShowObj = {};
        dataShowObj = {
            fileName: dateMilliseconds + "-" + item.name,
            fileType: 'image',
            originalContentUrl: API.BASE_URL + 'app/public/upload/chat/' + dateMilliseconds + "-" + item.name,
            previewImageUrl: API.BASE_URL + 'app/public/upload/chat/' + dateMilliseconds + "-" + item.name,
            fileUrl: API.BASE_URL + 'app/public/upload/chat/' + dateMilliseconds + "-" + item.name,
            fileSize: bytesToSize(item.size)
        }
        dataArr = [dataShowObj];
        setDataUploadWillShow([...dataUploadWillShow, ...dataArr]);
        setIsFileEmpty(false);
    }

    const multiSelectFile = async() => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            
            let date = Date.now();
            let dateMilliseconds = moment(date).format('x');
            uploadFileToServer(dateMilliseconds, results);
            
            
            // for (let i=1; i < results.length; i++) {
            //     console.log("num", i);
            //     console.log("results.length", results.length);
                
            //     if (!((results.size/(1024*1024)).toFixed(2) > 5)) {
            //         let date = Date.now();
            //         let dateMilliseconds = moment(date).format('x');
            //         uploadFileToServer(dateMilliseconds, results, i, results.length);
            //     }
            // }
        } catch (e) {
            // console.log(e);
        }
    }

    const dataDeleteItem = (fileName) => {

        if (statusEditOrCreate == 1) {
            let dataDelete = undefined;
            dataDelete = dataUploadWillShow.filter((entry, i) => {
                return entry.fileName == fileName
            });

            if (dataDelete != undefined) {
                setDataDeleteWillShow([...dataDeleteWillShow, ...dataDelete]);
            }
        }
        
        let value = dataUploadWillShow.filter((entry, i) => {
            return entry.fileName != fileName
        });
        
        setDataUploadWillShow(value);
        if (value.length == 0) {
            setIsFileEmpty(true);
        } 
    }

    const deteleItem = async(fileName) => {
        let data = undefined;
        data = dataUploadWillShow.find((entry, i) => {
            return entry.fileName == fileName
        });

        if (data != undefined) {
            try {
                let dataParams = {}
                let headers = {
                    token: dataUser.token,
                    userId: encodeHashIds(dataUser.user_id)
                }
                dataParams = {
                    fileToDelete: fileName
                }
                let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/chat/delete-file', dataParams, headers);
                console.log("DATA_RES", res);
                
                if (res.success) {
                    dataDeleteItem(fileName);
                }
            } catch (error) {
            }
        } 
    }

    const deleteFileUpload = async(data) => {
        if (data.isError == false) {

            try {
                let dataParams = {}
                let headers = {
                    token: dataUser.token,
                    userId: encodeHashIds(dataUser.user_id)
                }
                dataParams = {
                    fileToDelete: data.fileName
                }
                let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/chat/delete-file', dataParams, headers);
    
                if (res.success) {
                    console.log("res.success", res.success);
                    
                    setIsFileEmpty(true);
                    setDataUploadWillShow([]);
                    refRBSheetEdit.current.close();
                }
            } catch (error) {
            }
        } else {
            setIsFileEmpty(true);
            setDataUploadWillShow([]);
            refRBSheetEdit.current.close();
        }
    }

    const closeBSAttach = () => {
        if (dataUploadWillShow.length != 0) {
            dataUploadWillShow.map((data) => {
                deleteFileUpload(data)
            });
        } 
        refRBSheetEdit.current.close();
    }

    const viewConditionRender = () => {
        if (imageMsgTemplate) {
            if (isLoadingImg) {
                return (
                    <View 
                        style={styles.RBSheetContainFirst}
                    >
                        <ActivityIndicator color='#049FFF' size='large' />
                    </View>
                )
            } else {
                if (isFileEmpty) {
                    return (
                        <TouchableOpacity 
                            onPress={() => multiSelectFile()}
                            style={styles.RBSheetContainFirst}
                        >
                            <IconUploadCLoud height={40} width={40} />
                            <Text
                                style={{
                                    color: '#2889C6',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    
                                    fontSize: moderateScale(14),
                                    marginTop: moderateScale(10),
                                    marginBottom: moderateScale(6),
                                    marginHorizontal: moderateScale(10),
                                }}
                            >
                                Click to select a image from your device
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    
                                    fontSize: moderateScale(12),
                                    color: 'rgba(40, 137, 198, 0.5)',
                                    marginHorizontal: moderateScale(10),
                                }}
                            >
                                maximum file is 5000 KB / Kilobyte
                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <View style={styles.RBSheetContainFirst}>
                            <View style={{marginTop: 10}}>
                                <FlatList 
                                    numColumns={3}
                                    data={dataUploadWillShow}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </View>
                    )
                }
            }
        } else {
            return null;
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            {headerComponent()}
            <View style={styles.container}>
                {isLoading ? (
                    <View 
                        style={{
                            flex: 1, 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <Image
                            style={{
                                width: moderateScale(80),
                                height: moderateScale(80), 
                            }}
                            resizeMode="contain"
                            source={LoadingBig}
                            autoPlay
                        />
                    </View>
                ):(
                    <View>
                        <FlatList
                            contentContainerStyle={{
                                paddingVertical: moderateScale(22)
                            }}
                            horizontal={false}
                            data={containMsgTemp}
                            refreshing={isLoading}
                            onEndReachedThreshold={0.5}
                            renderItem={itemListMsgTemp}
                            onRefresh={() => onFetching()}
                            onEndReached={() => dataLoadMore()}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={() => renderFooter()}
                            ListEmptyComponent={() => emptyListMsgTemp()}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
            </View>
            <>
                {/* <AlertToastSuccess toastSuccess={toastSuccess}/>
                <AlertToastFailed toastFailed={toastFailed}/> */}

                <RBSheet
                    duration={400}
                    ref={refRBSheetEdit}
                    closeOnPressMask={false}
                    closeOnPressBack={false}
                    height={imageMsgTemplate ? moderateScale(600) : moderateScale(400)}
                    customStyles={{
                        container: {
                            alignItems: 'center',
                            backgroundColor: '#ffffff',
                            padding: moderateScale(12),
                            borderTopLeftRadius: moderateScale(10),
                            borderTopRightRadius: moderateScale(10),
                        },
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{flex: 1, paddingRight: 4}}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: '#2E3034',
                                    
                                    marginBottom: moderateScale(6),
                                }}
                            >
                                {statusEditOrCreate == 1 
                                    ? "Edit" 
                                    : "Create"
                                } Message Template
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => closeBSSheetEdit()}
                        >
                            <IconX height={22} width={22} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        style={{width: '100%'}}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text
                            style={{
                                
                                alignSelf: 'flex-start',
                                textTransform: 'uppercase',
                                marginBottom: moderateScale(18),
                            }}
                        >
                            Keyword
                        </Text>
                        <TextInput
                            value={textKeyword}
                            keyboardType="default"
                            style={styles.textInputKeyword}
                            onChangeText={textKeyword => changeTextKeyword(textKeyword)}
                        />
                        <Text
                            style={{
                                
                                alignSelf: 'flex-start',
                                textTransform: 'uppercase',
                                fontSize: moderateScale(12),
                                marginVertical: moderateScale(18),
                            }}
                        >
                            Message
                        </Text>
                        <TextInput
                            multiline={true}
                            value={textMessage}
                            keyboardType="default"
                            style={styles.textInputMessage}
                            onChangeText={textMessage => changeTextMessage(textMessage)}
                        />
                        {viewConditionRender()}
                        <View
                            style={{
                                width: dataUploadWillShow.length != 0 ? '60%' : '40%',
                                flexDirection: 'row',
                                backgroundColor: '#f3f3f3',
                                borderRadius: moderateScale(12),
                                paddingVertical: moderateScale(8),
                            }}
                        >
                            <View 
                                style={{
                                    width: dataUploadWillShow.length != 0 ? '30%' : '50%', 
                                    alignItems: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => linkMessageTemplate()}
                                >
                                    <IconLink height={22} width={22} />
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#000',
                                            
                                        }}
                                    >
                                        Link
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View 
                                style={{
                                    width: dataUploadWillShow.length != 0 ? '30%' : '50%', 
                                    alignItems: 'center'
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => imageMessageTemplate()}
                                >
                                    <IconImage height={22} width={22} />
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#000',
                                            
                                        }}
                                    >
                                        Image
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {dataUploadWillShow.length != 0 ? (
                                <View style={{width: '40%', alignItems: 'center'}}>
                                    <TouchableOpacity
                                        onPress={() => multiSelectFile()}
                                    >
                                        <IconPlusCircle height={22} width={22} />
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: '#000',
                                                
                                            }}
                                        >
                                            Add Image
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ): null}
                        </View>
                        {isLoadingSave?(
                            <View
                                style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    backgroundColor: '#003473',
                                    marginTop: moderateScale(32),
                                    borderRadius: moderateScale(10),
                                    paddingVertical: moderateScale(8),
                                }}
                            >
                                <ActivityIndicator size={18} color='#fff' />
                            </View>
                        ):(
                            <TouchableOpacity
                                onPress={() => addOrChangeMsgTemp()}
                                style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    backgroundColor: '#003473',
                                    marginTop: moderateScale(32),
                                    borderRadius: moderateScale(10),
                                    paddingVertical: moderateScale(8),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#fff',
                                        fontWeight: '800',
                                        
                                    }}
                                >
                                    Save
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </RBSheet>

                <RBSheet
                    duration={400}
                    ref={refRBSheetInfo}
                    height={moderateScale(300)}
                    closeOnPressMask={false}
                    closeOnPressBack={false}
                    customStyles={{
                        container: {
                            alignItems: 'center',
                            backgroundColor: '#ffffff',
                            padding: moderateScale(12),
                            borderTopLeftRadius: moderateScale(10),
                            borderTopRightRadius: moderateScale(10),
                        },
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            marginBottom: moderateScale(12)
                        }}
                    >
                        <View style={{flex: 1, paddingRight: 4}}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: '#2E3034',
                                    
                                    marginBottom: moderateScale(6),
                                }}
                            >
                                View Template
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => offInfoMstTemp()}
                        >
                            <IconX height={22} width={22} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        style={{
                            width: '100%',
                            backgroundColor: '#f3f3f3', 
                            marginBottom: moderateScale(6),
                            borderRadius: moderateScale(12),
                        }}>
                        <Text
                            style={{
                                color: '#383d41',
                                letterSpacing: 0.1,
                                
                                fontSize: moderateScale(16),
                                lineHeight: moderateScale(24),
                                paddingVertical: moderateScale(10),
                                paddingHorizontal: moderateScale(16),
                            }}
                        >
                            {textInfoMsgTemp}
                        </Text>
                    </ScrollView>
                </RBSheet>
                <RBSheet
                    duration={400}
                    ref={refRBSheetConfirmDel}
                    height={moderateScale(150)}
                    closeOnPressMask={false}
                    closeOnPressBack={false}
                    customStyles={{
                        container: {
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ffffff',
                            borderTopLeftRadius: moderateScale(10),
                            borderTopRightRadius: moderateScale(10)
                        },
                    }}
                >
                    <Text
                        style={{
                            color: '#000',
                            textAlign: 'center',
                            
                            fontSize: moderateScale(14),
                            marginBottom: moderateScale(24),
                        }}
                    >
                        Apa anda yakin ingin menghapus ?
                    </Text>

                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity 
                            onPress={() => confirmDel("yes")}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: moderateScale(36),
                                backgroundColor: '#eb5337',
                                borderRadius: moderateScale(8),
                                paddingHorizontal: moderateScale(10),
                            }}
                        >
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <IconCheckCircle height={14} width={14} />
                                <Text
                                    style={{
                                        color: '#fff',
                                        letterSpacing: 0.1,
                                        
                                        fontSize: moderateScale(14),
                                        marginLeft: moderateScale(4),
                                        lineHeight: moderateScale(24),
                                        marginVertical: Platform.OS == 'android' ? moderateScale(16) : moderateScale(0),
                                    }}
                                >
                                    Ya
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => confirmDel("no")}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: moderateScale(36),
                                backgroundColor: '#5589c3',
                                marginLeft: moderateScale(24),
                                borderRadius: moderateScale(8),
                                paddingHorizontal: moderateScale(10),
                            }}
                        >
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <IconXCircle height={14} width={14} />
                                <Text
                                    style={{
                                        color: '#fff',
                                        letterSpacing: 0.1,
                                        
                                        fontSize: moderateScale(14),
                                        marginLeft: moderateScale(4),
                                        lineHeight: moderateScale(24),
                                        marginVertical: Platform.OS == 'android' ? moderateScale(16) : moderateScale(0),
                                    }}
                                >
                                    Tidak
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </RBSheet>
            </>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containInput: {
        paddingHorizontal: 20,
        backgroundColor: 'rgba(228, 228, 231, 0.4)',
        borderRadius: dimenWidth/2,
    },
    textInputKeyword: {
        width: '100%',
        textAlignVertical: 'top',
        backgroundColor: '#f3f3f3',
        borderRadius: moderateScale(12),
        paddingTop: moderateScale(16),
        paddingHorizontal: moderateScale(18),
    },
    textInputMessage: {
        flex: 1,
        width: '100%',
        textAlignVertical: 'top',
        backgroundColor: '#f3f3f3',
        borderRadius: moderateScale(12),
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(18),
        marginBottom: moderateScale(18)
    },
    RBSheetContainFirst: {
        borderWidth: 2,
        borderRadius: 1,
        borderStyle: 'dashed',
        borderColor: '#2889C6',
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        marginBottom: moderateScale(14),
        width: dimenWidth - moderateScale(28),
        height: (dimenHeight/2.5) - moderateScale(98)
    },
});

export default React.memo(MessageTemplate);