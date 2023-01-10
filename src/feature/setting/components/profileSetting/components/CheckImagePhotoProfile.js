import * as React from 'react';

import {Dimensions} from 'react-native';

//Import External
import { moderateScale } from '../../../../other/Scaling';

import Image from 'react-native-image-progress';


const dimenWidth = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;

const CheckImagePhotoProfile = ({url, dimenWidth}) => {

    const onImageError = () => {
        return (
            <Image 
                source={require('./../../../../../assets/image/no_photo_profile.png')}
                style={{
                    borderRadius: dimenWidth,
                    width: dimenWidth-moderateScale(150), 
                    height: dimenWidth-moderateScale(150), 
                }}
            />
        )
    }

    return (
        <Image 
            style={{
                borderRadius: dimenWidth,
                width: dimenWidth-moderateScale(150), 
                height: dimenWidth-moderateScale(150), 
            }} 
            source={imgUrl}  
            renderError={() => onImageError()}
        />
    )
}

export default CheckImagePhotoProfile;
   