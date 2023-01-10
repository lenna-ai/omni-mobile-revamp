import * as React from 'react';

import { 
    Text,
    View, 
    Platform,
    StyleSheet, 
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

//Import Assets
import IconAbout from './../../../../assets/image/icon_about.svg';
import IconInbox from './../../../../assets/image/icon_inbox.svg';
import IconLogout from './../../../../assets/image/icon_logout.svg';
import IconProfile from './../../../../assets/image/icon_profile.svg';
import IconSupport from './../../../../assets/image/icon_support.svg';
import IconPluCirclActive from './../../../../assets/image/icon_plus_circle_active.svg';

//Import Internal
import API from './../../../../utils/api';
import { encodeHashIds } from '../../../../utils/encode';
import { postDataOutHeader } from '../../../../modules/services';
import { scale, moderateScale, verticalScale} from './../../../../feature/other/Scaling';
import { changeIsOpen, changeIsOnline } from './../../../../modules/redux/actions/other/inBSNavigationPlus';

//Import External
import { SvgUri } from 'react-native-svg';
import { Icon } from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import { saveData } from '../../../../modules/localData';
import { AuthContext } from '../../../../modules/navigation/navigationContext';
import { IconLayout, IconX } from '../../../../assets/icons';

const dimenWidth = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;
const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';
const imageOnline = API.BASE_URL + 'app/public/dist/img/online.744eb0ee.svg';
const imageOffline = API.BASE_URL +"app/public/dist/img/offline.f4bab13f.svg";

export default BSNavigationPlus = ({ refRBSheetMorePlus, navigation, refRBSheetOnline, onLogout }) => {

    const dispatch = useDispatch();

    const { onChangeChannel } = React.useContext(AuthContext);

    const disUser = useSelector((state) => state.mDataUserLogin);
    let dataUser = disUser.dataUserWasLogin;

    const disIsOnline = useSelector((state) => state.mDataBSNavigationPlus);
    let isOnline = disIsOnline.statusIsOnline;

    const disChooseActive = useSelector((state) => state.mDataNavigation);
    let chooseActive = disChooseActive.isChooseActive;

    const [txtOffline, setTxtOffline] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const isChangeChannels = () => {

        let dataLogin = {
            app_id: dataUser.app_id,
            id: dataUser.id,
            name: dataUser.name,
            email: dataUser.email,
            token: dataUser.token,
            role: null,
            online: dataUser.online,
            reason_offline: null,
            user_id: dataUser.user_id
        }

        saveData("WAS_LOGIN", false);
        saveData("DATA_LOGIN", dataLogin);
        saveData("IS_CHOOSE_ACTIVE", false);
        saveData("IS_CHOOSE_CHANNEL", true);
        dispatch(changeIsOpen(false));
        setTimeout(() => {
            refRBSheetMorePlus.current.close();
            onChangeChannel();
        }, 500);
    }

    const onSubmitOffline = async() => {
        if (txtOffline != "") {
            setIsLoading(true);
            try {
                let headers = {
                    token: dataUser.token,
                    userId: encodeHashIds(dataUser.user_id)
                }
                let params = {
                    online: false,
                    reason_offline: txtOffline,
                    agentId: dataUser.user_id,
                }
                let data = await postDataOutHeader(
                    API.PATH + encodeHashIds(dataUser.app_id) + '/agent/change-status', 
                    params,
                    headers
                );
                if (data.success) {
                    dispatch(changeIsOnline(false));
                    setIsLoading(false);
                    closeBSSheetConfir();
                } else {
                    dispatch(changeIsOnline(true));
                    setIsLoading(false);
                    closeBSSheetConfir();
                }
            } catch (error) {
                dispatch(changeIsOnline(true));
                setIsLoading(false);
                closeBSSheetConfir();
            }
        }
    }

    const onSubmitOnline = async() => {
        try {
            let headers = {
                token: dataUser.token,
                userId: encodeHashIds(dataUser.user_id)
            }
            let params = {
                online: true,
                agentId: dataUser.user_id,
            }

            let data = await postDataOutHeader(
                API.PATH + encodeHashIds(dataUser.app_id) + '/agent/change-status', 
                params,
                headers
            );

            if (data.success) {
                dispatch(changeIsOnline(true));
                setIsLoading(false);
            } else {
                dispatch(changeIsOnline(false));
                setIsLoading(false);
            }

        } catch (error) {
            dispatch(changeIsOnline(false));
            setIsLoading(false);
        }
    }

    const onClickOnline = () => {
        if (!isOnline) {
            setIsLoading(true);
            onSubmitOnline();
        } else {
            dispatch(changeIsOpen(false));
            setTimeout(() => {
                refRBSheetOnline.current.open();
            }, 500);
        }
    }

    const changeOffline = (txt) => {
        setTxtOffline(txt);
    }

    const goToProfile = () => {
        dispatch(changeIsOpen(false));
        navigation.navigate('ProfileSetting');
    }

    const goToOther = () => {
        dispatch(changeIsOpen(false));
        navigation.navigate('ProfileOption');
    }

    const goToSetting = () => {
        dispatch(changeIsOpen(false));
        navigation.navigate('SettingsOption');
    }

    const goToAbout = () => {
        dispatch(changeIsOpen(false));
        navigation.navigate('About');
    }

    const closeBSSheetConfir = () => {
        refRBSheetOnline.current.close();
        setTimeout(() => {
            dispatch(changeIsOpen(true));
        }, 410);
    }

    const ContainIsOnline = () => {
        if (dataUser.role.name == 'Staff') {
            return (
                <View style={styles.containBtn}>
                    <View style={styles.containBtnView}>
                        <View style={styles.containBtnViewView}>
                            {isLoading?(
                                <ActivityIndicator size={'small'} color='#049FFF' />
                            ):(
                                <SvgUri
                                    width={moderateScale(24)} 
                                    height={moderateScale(24)}
                                    uri={isOnline ? imageOnline : imageOffline}
                                />
                            )}
                        </View>
                        {isOnline ? (
                            <Text style={styles.containBtnViewText}>
                                Online
                            </Text>
                        ) : (
                            <Text style={styles.containBtnViewText}>
                                Offline
                            </Text>
                        )}
                    </View>
                </View>
            )
        } else {
            return null;
        }
    }

    const ContainSettings = () => {
        if (dataUser.role.name != 'Supervisor') {
            return (
                <View style={styles.containBtn}>
                    <View style={styles.containBtnView}>
                        <View style={styles.containBtnViewView}>
                            <IconInbox width={moderateScale(24)} height={moderateScale(24)} />
                        </View>
                        <Text style={styles.containBtnViewText}>
                            Setting
                        </Text>
                    </View>
                </View>
            )
        } else {
            return null
        }
    }

    return (
        <>
            <RBSheet
                duration={400}
                ref={refRBSheetMorePlus}
                closeOnPressMask={false}
                closeOnPressBack={false}
                height={
                    dataUser.role.name == 'Staff'
                    ? verticalScale(369)
                    : verticalScale(332)
                }
                customStyles={{
                    container: {
                        backgroundColor: 'transparent',
                    }
                }}
            >
                <View style={styles.BSView}>
                    <TouchableOpacity
                        style={styles.containBtn}
                        onPress={() => goToProfile()}
                    >
                        <View style={styles.containBtnView}>
                            <View style={styles.containBtnViewView}>
                                <IconProfile 
                                    width={moderateScale(24)} 
                                    height={moderateScale(24)} 
                                />
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
                                Profile
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => goToSetting()}>
                        <ContainSettings />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => goToOther()}
                        style={styles.containBtn}
                    >
                        <View style={styles.containBtnView}>
                            <View style={styles.containBtnViewView}>
                                <IconSupport width={moderateScale(24)} height={moderateScale(24)} />
                            </View>
                            <Text style={styles.containBtnViewText}>
                                Support
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => goToAbout()}
                        style={styles.containBtn}
                    >
                        <View style={styles.containBtnView}>
                            <View style={styles.containBtnViewView}>
                                <IconAbout width={moderateScale(24)} height={moderateScale(24)} />
                            </View>
                            <Text style={styles.containBtnViewText}>
                                About
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {chooseActive?(
                        <TouchableOpacity 
                            onPress={() => isChangeChannels()}
                            style={styles.containBtn}
                        >
                            <View style={styles.containBtnView}>
                                <View style={styles.containBtnViewView}>
                                    <IconLayout height={24} width={24} />
                                </View>
                                <Text style={styles.containBtnViewText}>
                                    Channel
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ):null}
                    <TouchableOpacity onPress={() => onClickOnline()} >
                        <ContainIsOnline />
                    </TouchableOpacity>
                    <View 
                        style={{
                            width: moderateScale(120),
                            height: 1,
                            marginTop: 4,
                            marginBottom: 14,
                            backgroundColor: '#E0E0E0'
                        }}
                    />
                    <TouchableOpacity 
                        onPress={() => onLogout()}
                        style={styles.containBtn}>
                        <View style={styles.containBtnView}>
                            <View style={styles.containBtnViewView}>
                                <IconLogout width={moderateScale(24)} height={moderateScale(24)} />
                            </View>
                            <Text 
                                style={[
                                    styles.containBtnViewText, 
                                    {color: '#ED5653',}
                                ]}
                            >
                                Logout
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    // onPress={() => dispatch(changeIsOpen(false))}
                    onPress={() => dispatch(changeIsOpen(false))}
                    style={{width: moderateScale(24), height: moderateScale(65), alignSelf: 'flex-end', marginRight: moderateScale(40), justifyContent: 'center', marginBottom: 4}}>
                    <View style={{width: moderateScale(36), height: moderateScale(36), backgroundColor: '#fff', borderRadius: moderateScale(36/2), justifyContent: 'center', alignItems: 'center'}}>
                        <IconPluCirclActive
                            width={moderateScale(24)}
                            height={moderateScale(24)}
                        />
                    </View>
                </TouchableOpacity>
            </RBSheet>
            
            <RBSheet
                duration={400}
                ref={refRBSheetOnline}
                height={moderateScale(300)}
                closeOnPressMask={false}
                closeOnPressBack={false}
                customStyles={{
                    container: {
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        borderTopLeftRadius: moderateScale(10),
                        borderTopRightRadius: moderateScale(10),
                        padding: moderateScale(12)
                    },
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
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
                            Confirmation
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => closeBSSheetConfir()}
                    >
                        <IconX height={22} width={22} />
                    </TouchableOpacity>
                </View>
                <Text
                    style={{
                        fontSize: moderateScale(16),
                        marginBottom: moderateScale(18),
                        
                        alignSelf: 'flex-start',
                    }}
                >
                    Give reasons why you want to go offline ?
                </Text>
                <TextInput
                    multiline={true}
                    value={txtOffline}
                    keyboardType="default"
                    style={styles.inputOffline}
                    onChangeText={txtOffline => changeOffline(txtOffline)}
                />
                <TouchableOpacity
                    onPress={() => isLoading?null:onSubmitOffline()}
                    style={{
                        marginTop: moderateScale(18),
                        width: '100%',
                        backgroundColor: '#003473',
                        paddingVertical: moderateScale(8),
                        alignItems: 'center',
                        borderRadius: moderateScale(10)
                    }}
                >
                    {isLoading?(
                        <ActivityIndicator size={18} color='#fff' />
                    ):(
                        <Text
                            style={{
                                fontSize: 16,
                                color: '#fff',
                                fontWeight: '800',
                                
                            }}
                        >
                            Submit
                        </Text>
                    )}
                </TouchableOpacity>
            </RBSheet>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    BSView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingHorizontal: moderateScale(10),
        marginTop: moderateScale(10),
        paddingTop: moderateScale(10),
        marginBottom: moderateScale(-10),
        width: moderateScale(150),
        borderRadius: moderateScale(10),
        marginRight: moderateScale(10),
        alignSelf: 'flex-end'
    },
    containBtn: {
        marginBottom: moderateScale(14)
    },
    containBtnView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containBtnViewView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: moderateScale(37), 
    },
    containBtnViewText: {
        fontWeight: 'bold',
        letterSpacing: 0.1,
        
        fontSize: moderateScale(14),
        marginLeft: moderateScale(16),
        lineHeight: moderateScale(24),
    },
    inputOffline: {
        flex: 1,
        width: '100%',
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(18),
        borderRadius: moderateScale(12),
        textAlignVertical: 'top',
        // minHeight: dimenHeight/5,
        backgroundColor: '#f3f3f3',
    },
});