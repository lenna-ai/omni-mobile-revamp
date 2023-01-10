import * as React from 'react';

import {
    View
} from 'react-native';

//Import Internal
import ListRequest from './ListRequest';
import {Loading} from './../../../other/Loading';

//Import External
import { useSelector } from 'react-redux';

export default MainHome = ({navigation}) => {

    let disDataMain = useSelector((state) => state.mDataMain);
    let containLoading = disDataMain.loadingRoomRequest;

    if (containLoading) {
        return <Loading />
    } else {
        return (
            <View style={{flex: 1}}>
                <ListRequest navigation={navigation}/>
            </View>
        )
    }
}