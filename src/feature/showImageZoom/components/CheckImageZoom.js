import * as React from 'react';

import { View, Dimensions, ActivityIndicator } from 'react-native';

//Import External
import Image from 'react-native-image-progress';
import ImageZoom from 'react-native-image-pan-zoom';
import { moderateScale } from '../../other/Scaling';


const dimenWidth = Dimensions.get('screen').width;

const CheckImageZoom = ({url}) => {

    const [isError, setIsError] = React.useState(false);
    let [imgHeight, setImgHeight] = React.useState(dimenWidth);

    Image.getSize(url, (width, height) => {
        setImgWidth(width);
        setImgHeight(height);
    });

    const onImageError = () => {
        setIsError(true);
        return (
            <Image 
                source={require('./../../../assets/image/image_not_found.jpg')} 
                style={{
                    width: '100%',
                    resizeMode: 'cover',
                    height: moderateScale(400),
                }}
            />
        )
    }

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '100%',
                maxHeight: '100%',
                zIndex: 5,
            }}
        >
            <ImageZoom 
                cropWidth={'100%'}
                cropHeight={'100%'}
                imageWidth={dimenWidth}
                imageHeight={imgHeight != undefined ? imgHeight : moderateScale(400)}
            >
                <Image 
                    style={{
                        alignSelf: 'center',
                        width: '100%', 
                        height: isError?moderateScale(400):imgHeight, 
                        resizeMode: 'contain'
                    }} 
                    indicator={<ActivityIndicator color='#049FFF' size='large' />}
                    renderError={() => onImageError()}
                    source={{uri: url}}  
                />
            </ImageZoom>
        </View>
    )
}

export default CheckImageZoom;
   