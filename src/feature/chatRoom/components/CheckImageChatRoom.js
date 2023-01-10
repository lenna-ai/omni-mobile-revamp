import * as React from 'react';

//Import External
import axios from 'axios';
// import { View, Image, Dimensions, ActivityIndicator } from 'react-native';
import {Dimensions, ActivityIndicator} from 'react-native';

import Image from 'react-native-image-progress';
import { moderateScale, scale } from '../../other/Scaling';

const dimenWidth = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;

const CheckImageChatRoom = ({url, size}) => {

    // const [loading, setLoading] = React.useState(true);
    // const [imgUrl, setImgUrl] = React.useState(undefined);
    const [imgWidth, setImgWidth] = React.useState(dimenWidth);
    const [imgHeight, setImgHeight] = React.useState(dimenWidth);
    const [isError, setIsError] = React.useState(false);

    // React.useEffect(() => {
    //     setImgUrl(undefined);
    //     setImgWidth(dimenWidth);
    //     setImgHeight(dimenWidth);
    //     setTimeout(() => {
    //         if (url != null) {
    //             if (url.search('https') != -1) {
    //                 getSizeImage(url);
    //                 setImgUrl({uri: url});
    //                 setLoading(false);
    //             } else {
    //                 setLoading(false);
    //                 setImgUrl(require('./../../../assets/image/image_not_found.jpg'));
    //             }
    //         } else {
    //             setLoading(false);
    //             setImgUrl(require('./../../../assets/image/image_not_found.jpg'));
    //         }
    //     }, 3000);
    // }, []);

    // const getSizeImage = (url) => {
    //     Image.getSize(url, (width, height) => {
    //         const screenWidth = dimenWidth-moderateScale(120)
    //         const scaleFactor = width / screenWidth
    //         const imageHeight = height / scaleFactor
    //         setImgWidth(screenWidth);
    //         setImgHeight(imageHeight);
    //     });
    // }

    // const onImageError = () => {
    //     const sizeImage = dimenWidth-moderateScale(120)
    //     setImgWidth(sizeImage);
    //     setImgHeight(sizeImage);
    //     setImgUrl(require('./../../../assets/image/image_not_found.jpg'));
    // }

    // if (loading) {
    //     return (
    //         <View 
    //             style={{ 
    //                 alignItems: 'center',
    //                 justifyContent: 'center', 
    //                 width: moderateScale(120),
    //                 height: moderateScale(120)
    //             }}
    //         >
    //             <ActivityIndicator color='#049FFF' size='large' />
    //         </View>
    //     )
    // } else {
    //     return (
    //         <Image 
    //             style={{
    //                 width: dimenWidth-moderateScale(120),
    //                 height: dimenWidth-moderateScale(120),
    //                 resizeMode: 'cover',
    //             }} 
    //             onError={() => onImageError()}
    //             source={imgUrl}  
    //         />
    //     )
    // }

    Image.getSize(url, (width, height) => {
        const screenWidth = size
        const scaleFactor = width / screenWidth
        const imageHeight = height / scaleFactor
        setImgWidth(screenWidth);
        setImgHeight(imageHeight);
    });

    const onImageError = () => {
        setIsError(true);
        return (
            <Image 
                source={require('./../../../assets/image/image_not_found.jpg')} 
                style={{
                    resizeMode: 'cover',
                    width: size,
                    height: moderateScale(130),
                    maxWidth: size
                }}
            />
        )
    }
    
    return (
        <Image 
            source={{ uri: url}} 
            indicator={<ActivityIndicator color='#049FFF' size='large' />} 
            style={{
                resizeMode: 'cover',
                width: isError?size:imgWidth,
                height: isError?moderateScale(130):imgHeight,
                maxWidth: size
            }}
            renderError={() => onImageError()}
        />
    )
}

export default React.memo(CheckImageChatRoom);
   
