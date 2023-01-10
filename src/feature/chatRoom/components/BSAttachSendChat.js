import * as React from 'react';

import {
    Text,
    View,
    FlatList,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

//Import Internal
import API from './../../../utils/api';
import { moderateScale, verticalScale, scale } from './../../other/Scaling';

import {
    IconUploadCLoud,
    IconX,
    imageIconAttachmentWhite,
    imageIconPaperPlaneAttach,
} from './../../../assets/icons';

//Import External
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import { encodeHashIds } from '../../../utils/encode';
import DocumentPicker from 'react-native-document-picker';
import { postDataForFormData, postDataOutHeader } from '../../../modules/services';
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";


const dimenWidth = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;
const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const BSAttachSendChat = ({refRBSheetAttach, id, scrollToDown}) => {

    let disUser = useSelector((state) => state.mDataUserLogin);
    let dataUser = disUser.dataUserWasLogin;

    const [isFileEmpty, setIsFileEmpty] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataUploadWillShow, setDataUploadWillShow] = React.useState([]);

    const bytesToSize = (bytes) => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    const uploadFileToServer = async(dateMilliseconds, value) => {
        try {
            setIsLoading(true);
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
            console.log("data", data);
            
            if (data.success) {
                setIsLoading(false);
                dataArrayShowWill(dateMilliseconds, value, false);
            } else {
                setIsLoading(false);
                dataArrayShowWill(dateMilliseconds, value, true);
            }
        } catch (e) {
            setIsLoading(false);
            dataArrayShowWill(dateMilliseconds, value, true);
        }
    }

    const dataArrayShowWill = (dateMilliseconds, item, err) => {
        let dataArr = [];
        let dataShowObj = {};
        dataShowObj = {
            id : dateMilliseconds,
            name: item.name,
            nameId: dateMilliseconds + "-" + item.name,
            size: bytesToSize(item.size),
            isError: err,
            type: item.type
        }
        dataArr = [dataShowObj];
        setDataUploadWillShow([...dataUploadWillShow, ...dataArr]);
        setIsFileEmpty(false);
    }

    const dataUploadFile = (value) => {
        let date = Date.now();
        let dateMilliseconds = moment(date).format('x');

        if ((value.size/(1024*1024)).toFixed(2) > 5) {
            dataArrayShowWill(dateMilliseconds, value, true);
        } else {
            uploadFileToServer(dateMilliseconds, value);
        }
    }

    const multiSelectFile = async() => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            dataUploadFile(results);
        } catch (e) {
            
        }
    }

    const dataDeleteItem = (nameId) => {
        let value = dataUploadWillShow.filter((entry, i) => {
            return entry.nameId != nameId
        });
        setDataUploadWillShow(value);
        if (value.length == 0) {
            setIsFileEmpty(true);
        }   
    }

    const deteleItem = async(nameId) => {
        let data = undefined;
        data = dataUploadWillShow.find((entry, i) => {
            return entry.nameId == nameId
        });

        if (data != undefined) {
            if (data.isError == false) {
                try {
                    let dataParams = {}
                    let headers = {
                        token: dataUser.token,
                        userId: encodeHashIds(dataUser.user_id)
                    }
                    dataParams = {
                        fileToDelete: nameId
                    }
                    let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/chat/delete-file', dataParams, headers);
                    console.log("DATA_RES", res);
                    
                    if (res.success) {
                        dataDeleteItem(nameId);
                    }
                } catch (error) {
                }
            } else {
                let dataFalse = dataUploadWillShow.filter((entry) => {
                    return entry.nameId != nameId
                });
                setDataUploadWillShow(dataFalse);
            }
        } 
    }

    const hitApiSendChat = async(item) => {
        console.log("setParamsChat(item)", setParamsChat(item));

        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }
        
        let res = await postDataOutHeader(
            API.PATH + encodeHashIds(dataUser.app_id) +'/chat/send-message', 
            setParamsChat(item),
            headers
        );

        if (res.success) {
            scrollToDown();
        }
        console.log("res_send_upload", res);
        
    }

    const sendCharts = async() => {
        // let dataArr = [];
        let data = dataUploadWillShow.find((item) => {
            return item.isError == true
        });
        
        if (data == undefined && dataUploadWillShow.length != 0) {
            let dataArr = dataUploadWillShow;
            setIsFileEmpty(true);
            setDataUploadWillShow([]);
            refRBSheetAttach.current.close();
            dataArr.map((item) => {
                hitApiSendChat(item)
            });

        }
    }

    const setParamsChat = (item) => {
        let date = Date.now();
        let dateMilliseconds = moment(date).format('x');

        let dataType = 'file';

        if (item.type.search("image") != -1) {
            dataType = 'image'
        }

        console.log("dataType", dataType);

        let params = {};
        let dataMessage = [];
        let dataMessageObj = {};

        if (dataType == 'image') {
            dataMessageObj = {
                originalContentUrl: API.BASE_URL + "app/public/upload/chat/" + item.nameId,
                previewImageUrl: API.BASE_URL + "app/public/upload/chat/" + item.nameId,
                type: dataType
            }
    
            dataMessage = [dataMessageObj];
        } else {
            dataMessageObj = {
                fileName: item.nameId,
                fileUrl: API.BASE_URL + "app/public/upload/chat/" + item.nameId,
                type: dataType
            }
    
            dataMessage = [dataMessageObj];
        }

        params = {
            roomId: id,
            senderId: dataUser.user_id,
            temporaryId: dateMilliseconds,
            message: dataMessage
        }

        return params
    }

    const renderItem = ({item}) => {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    padding: moderateScale(2),
                    backgroundColor: item.isError?'#ED5653':'#2889C6',
                    marginLeft: moderateScale(12), 
                    marginBottom: moderateScale(12), 
                    width: (dimenWidth - moderateScale(80))/3,
                    height: ((dimenHeight/2.5) - moderateScale(134))/2
                }}
            >
                <TouchableOpacity
                    onPress={() => deteleItem(item.nameId)}
                    style={{
                        top: 0,
                        right: 0,
                        position: 'absolute',
                        alignItems: 'flex-end',
                        marginBottom: moderateScale(4),
                    }}
                >
                    <IconX height={16} width={16} />
                </TouchableOpacity>
                <Text
                    style={{
                        color: '#ffffff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        
                        fontSize: moderateScale(10),
                        marginRight: moderateScale(6),
                        marginBottom: moderateScale(4),
                    }}
                >
                    {item.size}
                </Text>
                <Text
                    numberOfLines={2}
                    style={{
                        color: '#ffffff',
                        textAlign: 'center',
                        
                        fontSize: moderateScale(10),
                    }}
                >
                    {item.isError?'Failed upload file':item.name}
                </Text>
            </View> 
        )
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
                    fileToDelete: data.nameId
                }
                let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/chat/delete-file', dataParams, headers);
    
                if (res.success) {
                    console.log("res.success", res.success);
                    
                    setIsFileEmpty(true);
                    setDataUploadWillShow([]);
                    refRBSheetAttach.current.close();
                }
            } catch (error) {
            }
        } else {
            setIsFileEmpty(true);
            setDataUploadWillShow([]);
            refRBSheetAttach.current.close();
        }
    }

    const closeBSAttach = () => {
        if (dataUploadWillShow.length != 0) {
            dataUploadWillShow.map((data) => {
                deleteFileUpload(data)
            });
        } else {
            refRBSheetAttach.current.close();
        }
    }

    const viewConditionRender = () => {
        if (isLoading) {
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
                            Click to select a file from your device
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
    }

    return (
        <RBSheet
            duration={400}
            ref={refRBSheetAttach}
            closeOnPressMask={false}
            closeOnPressBack={false}
            height={dimenHeight/2.5}
            customStyles={{
                container: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: moderateScale(14),
                    backgroundColor: '#fff',
                }
            }}
        >
            {viewConditionRender()}
            <View style={styles.RBSheetContainSecond}>
                {!isFileEmpty?(
                    <>
                        
                        {!isLoading?(
                            <>
                                <TouchableOpacity
                                    onPress={() => multiSelectFile()}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: moderateScale(50),
                                        height: moderateScale(50),
                                        backgroundColor: '#2889C6',
                                        marginRight: moderateScale(14),
                                        borderRadius: moderateScale(50/2),
                                    }}
                                >
                                    {imageIconAttachmentWhite(moderateScale(22), moderateScale(22))}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => sendCharts()}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: moderateScale(50),
                                        height: moderateScale(50),
                                        backgroundColor: '#2889C6',
                                        marginRight: moderateScale(14),
                                        borderRadius: moderateScale(50/2),
                                    }}
                                >
                                    {imageIconPaperPlaneAttach(moderateScale(22), moderateScale(22))}
                                </TouchableOpacity>
                            </>
                        ):null}
                    </>
                ):null}
                <TouchableOpacity
                    onPress={() => closeBSAttach()}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: moderateScale(50),
                        height: moderateScale(50),
                        backgroundColor: '#2889C6',
                        borderRadius: moderateScale(50/2),
                    }}
                >
                    <IconX height={22} width={22} />
                </TouchableOpacity>
            </View>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    RBSheetContainSecond: {
        flexDirection: 'row',
        alignItems: 'center',
        height: moderateScale(60),
    },
});

export default React.memo(BSAttachSendChat);