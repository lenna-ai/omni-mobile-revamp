import * as React from 'react';

//Import External
import axios from 'axios';
import { moderateScale } from '../../other/Scaling';
import { View, Image, ActivityIndicator } from 'react-native';

const CheckImageProfileCustomer = ({url, dimenWidth}) => {

    let [imgUrl, setImgUrl] = React.useState(undefined);

    React.useEffect(() => {
        if (url != null) {
            if (url.search('https') != -1) {
                setImgUrl({uri: url});
            } else {
                setImgUrl(require('./../../../assets/image/no_avatar.jpg'));
            }
        } else {
            setImgUrl(require('./../../../assets/image/no_avatar.jpg'));
        }
    }, []);

    const onImageError = () => {
        setImgUrl(require('./../../../assets/image/no_avatar.jpg'));
    }

    return (
        <Image 
            style={{
                width: dimenWidth-moderateScale(150), 
                height: dimenWidth-moderateScale(150), 
                marginVertical: dimenWidth/11,
                borderRadius: (dimenWidth),
            }} 
            onError={() => onImageError()}
            source={imgUrl}  
        />
    )
}

export default CheckImageProfileCustomer;
   