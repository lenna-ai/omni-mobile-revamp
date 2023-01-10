import * as React from 'react';

//Import External
import axios from 'axios';
import { View, Image, ActivityIndicator } from 'react-native';
import { moderateScale } from '../../other/Scaling';

const CheckImageLeftChatRoom = ({url, wd, hd, value}) => {

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
                width: wd, 
                height: hd,
                opacity: value,
                borderRadius: hd,
                marginTop: moderateScale(3),
            }} 
            onError={() => onImageError()}
            source={imgUrl}  
        />
    )
}

export default React.memo(CheckImageLeftChatRoom);