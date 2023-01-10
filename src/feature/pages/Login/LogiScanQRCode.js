import * as React  from 'react';

import {
    Text,
    View,
    Image,
    Platform,
    StatusBar,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

// Internal Export
import API from './../../../utils/api';
import { saveData } from './../../../modules/localData';
import ModalStatus from './../../components/Login/ModalStatus';
import ModalLoading from './../../components/Login/ModalLoading';
import { onLoadingLogin } from './../../../modules/redux/actions/inLogin';
import BottomSheetCamera from './../../components/Login/BottomSheetCamera';
import { AuthContext } from "./../../../modules/navigation/navigationContext";
import { getData, postDataOutHeader, postDataLogin } from './../../../modules/services';
import { encodeHashIds } from './../../../utils/encode';

//External Import
import { useDispatch, useSelector } from 'react-redux';

// Import Image Icons
import {
    imageLogoLennaOmni,
    imageLogoOmnimobile,
    imageIllustrationBg
} from './../../../assets/icons';
import { moderateScale } from '../../other/Scaling';


const dimenWidth = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;


const LoginScanQRCode = ({ navigation }) => {

    const dispatch = useDispatch();
    const refCamera = React.useRef(null);
    const refRBSheetCamera = React.useRef(null);
    const { signIn } = React.useContext(AuthContext);

    const selData = useSelector(state => state.mDataLogin);
    let dataResultScanBarcode = selData.resultScanBarcode;

    const actionHitLogin = () => {
        loginHitApi();
        // setTimeout(() => {
        //     dispatch(onLoadingLogin(false));
        //     console.log("LOGIN_BERHASIL", dataResultScanBarcode);
        // }, 3000);
    };

    const loginHitApi = async() => {

        let data = dataResultScanBarcode;

        const params = {
            id: data,
            fcm_key: "asdasdasdasdasdasd"
        }
        

        try {
            let data = await postDataLogin(API.PATH + "mobile-omni/get-data", params);
            console.log("LOGIN_STATUS_SUCCES", data);
            if (data.success) {
                saveData("DATA_LOGIN", data.data);
                dispatch(onLoadingLogin(false));
                signIn();
                console.log("data_hit_login_success", data);
            } else {
                console.log("data_hit_login_faield_else", data);
                dispatch(onLoadingLogin(false));
            }
        } catch (e) {
            dispatch(onLoadingLogin(false));
            console.log("data_hit_login_faield_catch", e);
        }
    }

    const openBottomSheetScan = () => {
        refRBSheetCamera.current.open()
    }
      
    return (
        <View style={[styles.container, {alignItems: 'center'}]}>

            {imageIllustrationBg(dimenWidth, dimenHeight)}

            <View 
                style={{
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    position: 'absolute', 
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }>
                <View style={{marginVertical: dimenHeight/15}}>
                    {
                        Platform.OS == 'android' ?   
                            imageLogoLennaOmni(moderateScale(100), moderateScale(46))
                        : (
                            <Image 
                                width={moderateScale(100)} 
                                height={moderateScale(46)} 
                                source={require('./../../../assets/image/logo_lenna.png')} />
                        )
                    }
                </View>
                <View>
                    {imageLogoOmnimobile(dimenWidth-160, 307)}
                </View>
                <TouchableOpacity
                    onPress={() => openBottomSheetScan()}
                    style={{
                        height: 48,
                        marginTop: dimenHeight/15,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#5588C3',
                        width: Dimensions.get('screen').width-46,
                    }}
                >
                    <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>Scan QR to Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    // onPress={() => apiLoginTemporary()}
                    style={{
                        height: 48,
                        borderWidth: 1,
                        borderRadius: 10,
                        marginTop: Dimensions.get('screen').height/70,
                        alignItems: 'center',
                        borderColor: '#5588C3',
                        justifyContent: 'center',
                        backgroundColor: '#00000000',
                        width: Dimensions.get('screen').width-46
                    }}
                >
                    <Text style={{color: '#5588C3', fontSize: 14, fontWeight: 'bold'}}>Contact Adminstrator</Text>
                </TouchableOpacity>
            </View>
            
            <ModalStatus />
            <ModalLoading />
            <BottomSheetCamera actionLogin={actionHitLogin} refRBSheetCamera={refRBSheetCamera} refCamera={refCamera}/>

            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    BSView: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        width: Dimensions.get('screen').width
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    containerModal: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    textModal: {
        textAlign: 'center', 
        marginVertical: 6
    },
    image: {
        width: 120,
        height: 80,
    },
});

export default LoginScanQRCode;