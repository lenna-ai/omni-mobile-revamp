import * as React  from 'react';

import { 
    Text,
    View,
    Image,
    StatusBar,
    TextInput,
    StyleSheet,
    ActivityIndicator    
} from 'react-native';

import { RNCamera } from 'react-native-camera';
import Modal, { ModalContent } from 'react-native-modals';

const Scan = ({ navigation }) => {

    const refCamera = React.useRef();

    const [passId, setPassId] = React.useState('');
    const [isScan, setIsScan] = React.useState(false);
    const [msgFailed, setMsgFailed] = React.useState('');
    const [isFailed, setIsFailed] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const actionEnterPassID = () => {
        console.log("ID");
        navigation.replace('Inbox');
    }

    const takePicture = async () => {
        if (refCamera.current) {
            const options = { quality: 0.5, base64: true };
            const data = await refCamera.current.takePictureAsync(options);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <View 
                style={styles.containerCamera}
            >
                <RNCamera
                    ref={refCamera}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                    }}
                    androidRecordAudioPermissionOptions={{
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                    }}
                    onBarCodeRead={(barcode) => {
                        if (!isScan) {
                            setIsScan(true)
                            console.log("Data Barcode", barcode);
                            setIsLoading(true);
                            if (barcode.type == 'QR_CODE') {
                                setTimeout(() => {
                                    setIsLoading(false);
                                    navigation.replace('Inbox');
                                }, 3000);
                            } else {
                                setTimeout(() => {
                                    setIsScan(false);
                                    setIsLoading(false);
                                    setMsgFailed('Barcode yang discan \nbukan QR Code!')
                                    setIsFailed(true);
                                }, 3000);
                            }
                        }
                    }}
                />
            </View>
            <View
                style={styles.containerSeconds}
            >
                <View
                    style={styles.containerS2}
                >
                    <View style={styles.list1} />
                    <View style={styles.list2} />
                </View>

                <View style={styles.containListText}>
                    <Text style={styles.belowContainListText} >
                        Trouble Scanning QR Code? Enter Manually
                    </Text>
                    <TextInput
                        value={passId}
                        returnKeyType="go"
                        autoCapitalize="none"
                        style={styles.inputs}
                        keyboardType="default"
                        placeholder="Enter Pass ID"
                        underlineColorAndroid="transparent"
                        onChangeText={passId => setPassId(passId)}
                        onSubmitEditing={actionEnterPassID}
                    />
                </View>

            </View>

            <Modal
                visible={isFailed}
                animationDuration={200}
                overlayBackgroundColor={'#000'}
                onHardwareBackPress={() => true	}
                onTouchOutside={() => {setIsFailed(false);}}
            >
                <ModalContent style={styles.containerModal}>
                    <Image 
                        style={styles.image} 
                        source={require('./../../assets/image/img_oops.png')} 
                    />
                    <Text style={styles.textModal}>
                        {msgFailed}
                    </Text>
                </ModalContent>
            </Modal>

            <Modal
                visible={isLoading}
                animationDuration={200}
                onTouchOutside={() => false}
                overlayBackgroundColor={'#000'}
                onHardwareBackPress={() => true	}
            >
                <ModalContent style={styles.containerModal}>
                    <ActivityIndicator 
                        size="large" 
                        color="#0F223D" 
                    />
                    <Text style={styles.textModal}>
                        Sedang Memuat...
                    </Text>
                </ModalContent>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerModal: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    textModal: {
        textAlign: 'center', 
        marginVertical: 6
    },
    containerCamera: {
        flex: 0.75,
        marginBottom: -22,
        backgroundColor: 'grey'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    capture: {
        flex: 0,
        margin: 20,
        padding: 15,
        borderRadius: 5,
        alignSelf: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#FFF'
    },
    containerSeconds: {
        flex: 0.25,
        backgroundColor: '#fff',
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    inputs: {
        elevation: 5,
        shadowRadius: 2,  
        borderRadius: 10,
        marginBottom: 20,
        marginVertical: 5,
        shadowOpacity: 0.8,
        shadowColor: '#000',
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 1 },
        paddingVertical: Platform.OS == 'android' ? 10 : 14,
    },
    image: {
        width: 120,
        height: 80,
    },
    containerS2: {
        width: '100%',
        alignItems: 'center'
    },
    list1: {
        width: 50,
        height: 3,
        marginTop: 6,
        borderRadius: 12,
        backgroundColor: 'grey'
    },
    list2: {
        width: 50,
        height: 3,
        marginTop:4,
        borderRadius: 12,
        backgroundColor: 'grey'
    },
    belowContainListText: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 6
    },
    containListText: {
        flex: 1, 
        paddingHorizontal: 20, 
        justifyContent: 'center'
    }
});

export default Scan;