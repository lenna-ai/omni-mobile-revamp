import * as React from 'react';

import {
    View,
    Image
} from 'react-native';

import LoadingBig from './../../assets/anime/loading_big.gif';

export const Loading = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
                style={{height: 80, width: 80}}
                resizeMode="contain"
                source={LoadingBig}
                autoPlay
            />
        </View>
    )
}