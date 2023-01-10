import * as React from 'react';

import {
    Text,
    Image,
    StyleSheet
} from 'react-native';

//Import External
import { useDispatch, useSelector } from 'react-redux';
import Modal, { ModalContent } from 'react-native-modals';

//Import Internal
import {
    onStatusLogin,
    onResetStatusMessageLogin
} from './../../../modules/redux/actions/inLogin';

const ModalStatus = () => {

    const dispatch = useDispatch();
    const selDataStatus = useSelector((state) => state.mDataLogin);
    const selDataMessage = useSelector((state) => state.mDataLogin);
    
    let dataIsStatusLogin = selDataStatus.isStatusLogin;
    let dataIsStatusMessage = selDataMessage.statusMessageLogin;

    const closeModalStatus = () => {
        dispatch(onResetStatusMessageLogin());
        dispatch(onStatusLogin(false))
    }

    return (
        <Modal
            visible={dataIsStatusLogin}
            animationDuration={200}
            overlayBackgroundColor={'#000'}
            onHardwareBackPress={() => closeModalStatus()}
            onTouchOutside={() => closeModalStatus()}
        >
            <ModalContent style={styles.containerModal}>
                <Image 
                    style={styles.image} 
                    source={require('./../../../assets/image/img_oops.png')} 
                />
                <Text style={styles.textModal}>
                    {dataIsStatusMessage}
                </Text>
            </ModalContent>
        </Modal>
    )
}

const styles = StyleSheet.create({
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

export default ModalStatus;
