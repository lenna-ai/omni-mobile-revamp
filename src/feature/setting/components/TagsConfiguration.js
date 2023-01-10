import * as React  from 'react';

import { 
    Text,
    View,
    Image,
    Platform,
    TextInput,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

// Import Internal
import API from './../../../utils/api'
import { encodeHashIds } from '../../../utils/encode';
import { getData, putData, postDataOutHeader } from '../../../modules/services';

// Import Asset
import IconBack from './../../../assets/image/icon_back.svg';
import IconSearch from './../../../assets/image/icon_search.svg';
import LoadingBig from './../../../assets/anime/loading_big.gif';

// Import Third Party
import { useSelector } from 'react-redux';
import {Header, Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import { moderateScale } from './../../other/Scaling';
import EmptyComponent from '../../other/EmptyComponent';
import { IconCheckCircle, IconPlus, IconTrash2Blue, IconX, IconXCircle } from '../../../assets/icons';

const dimenWidht = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;
const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';

const MessageTemplate = ({ navigation }) => {

    const refRBSheetTag = React.useRef(null);
    const refRBSheetConfirmDel = React.useRef(null);
    const [isDone, setIsDone] = React.useState(true);
    const [isSearch, setIsSearch] = React.useState(false);
    const [textSearch, setTextSearch] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [textNameTag, setTextNameTag] = React.useState("");
    const [textWasSearch, setTextWasSearch] = React.useState("");
    const [isLoadingSave, setLoadingSave] = React.useState(false);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [pageMsgSearchTag, setPageMsgSearchTag] = React.useState(1);
    const [containTagConfig, setContainTagConfig] = React.useState([]);
    const [dataEditMessageTag, setDataEditMessageTag] = React.useState([]);

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
            setPageMsgSearchTag(1);
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
                                <IconX height={16} width={16} />
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
                        Tags
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
                                    onPress={() => onCRMsgTemp()}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 40/2,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#049FFF'
                                    }}
                                >
                                    <IconPlus/>
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
        setDataEditMessageTag(dataDel);
        refRBSheetConfirmDel.current.open();
    }

    const itemListMsgTemp = ({item}) => {
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
                    paddingTop: moderateScale(10),
                    paddingBottom: moderateScale(14),
                    paddingHorizontal: moderateScale(10),
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
                        name
                    </Text>
                    <Text
                        numberOfLines={2}
                        style={{
                            color: '#000',
                            letterSpacing: 0.1,
                            
                            fontSize: moderateScale(16),
                            marginLeft: moderateScale(4),
                            lineHeight: moderateScale(24)
                        }}
                    >
                        {item.name}
                    </Text>
                </View>
                <View style={{width: '20%', justifyContent: 'center', alignItems: 'center', paddingVertical: moderateScale(10)}}>
                    <TouchableOpacity
                        onPress={() => onDelMsgTemp(item)}
                    >
                        <IconTrash2Blue height={24} width={24} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const onCRMsgTemp = () => {
        refRBSheetTag.current.open();
    }

    const changeTextKeyword = (txt) => {
        setTextNameTag(txt);
    }

    const closeBSSheetEdit = () => {
        setTextNameTag("");
        setDataEditMessageTag([]);
        refRBSheetTag.current.close();
    }

    const requestToServer = async() => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        setContainTagConfig([]);
        let rqTxtSearch = textSearch;
        console.log("rqTxtSearch", rqTxtSearch);
        let patch = rqTxtSearch != "" ? '/tag?page=1&per_page=15&filterText=' + rqTxtSearch : '/tag?page=1&per_page=15';
        let res = await getData(API.PATH + encodeHashIds(dataUser.app_id) + patch, headers);
        if (res.data.length != 0) {
            console.log('res.data.leng', res.data.length);
            if (res.data.length < 15) {
                setIsDone(true);
            } else {
                setIsDone(false);
            }
            setPageMsgSearchTag(pageMsgSearchTag + 1);
            setContainTagConfig(res.data);
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
                let patch = textWasSearch != "" ? '/tag?page=' + pageMsgSearchTag + '&per_page=15&filterText=' + textWasSearch : '/tag?page=' + pageMsgSearchTag + '&per_page=15';
                let res = await getData(API.PATH + encodeHashIds(dataUser.app_id) + patch, headers);
                if (res.data.length != 0) {
                    let dataMore = [...containTagConfig, ...res.data];
                    setPageMsgSearchTag(pageMsgSearchTag + 1);
                    setContainTagConfig(dataMore);
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
        setPageMsgSearchTag(1);
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
        if (textNameTag != "") {
            let headers = {
                token: dataUser.token,
                userId: encodeHashIds(dataUser.user_id)
            }
            let params = {
                name: textNameTag,
            }
            let res = await postDataOutHeader(API.PATH + encodeHashIds(dataUser.app_id) +'/tag', params, headers);
            if (res.success) {
                closeBSSheetEdit();
                if (textWasSearch == '')  {
                    onFetching();
                }
            }
            setLoadingSave(false);
            closeBSSheetEdit();
        }
    }

    const confirmDel = async(txt) => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }
        
        if (txt == 'yes') {
            let res = await getData(
                API.PATH + encodeHashIds(dataUser.app_id) +'/tag/' + dataEditMessageTag[0].id + '/delete',
                headers
            );
            if (res.success) {
                let myArray = containTagConfig.filter(function( obj ) {
                    return obj.id !== dataEditMessageTag[0].id;
                });    
                setContainTagConfig(myArray);            
            }
        }
        refRBSheetConfirmDel.current.close();
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
                            data={containTagConfig}
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
                <RBSheet
                    duration={400}
                    ref={refRBSheetTag}
                    closeOnPressMask={false}
                    closeOnPressBack={false}
                    height={moderateScale(230)}
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
                            >Create Message Tag</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => closeBSSheetEdit()}
                        >
                            <IconX height={22} width={22} />
                        </TouchableOpacity>
                    </View>
                    <Text
                        style={{
                            
                            alignSelf: 'flex-start',
                            textTransform: 'uppercase',
                            marginBottom: moderateScale(18),
                        }}
                    >
                        Name
                    </Text>
                    <TextInput
                        value={textNameTag}
                        keyboardType="default"
                        style={styles.textInputNameTag}
                        onChangeText={textNameTag => changeTextKeyword(textNameTag)}
                    />
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
        borderRadius: dimenWidht/2,
    },
    textInputNameTag: {
        width: '100%',
        textAlignVertical: 'top',
        backgroundColor: '#f3f3f3',
        borderRadius: moderateScale(12),
        paddingTop: moderateScale(16),
        paddingHorizontal: moderateScale(18),
    }
});

export default React.memo(MessageTemplate);