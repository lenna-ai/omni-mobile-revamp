import * as React from 'react';

import { 
    Text,
    View,
    Image,
    Platform,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import { Header } from 'react-native-elements';

import HeaderContain from './HeaderContain';
import { moderateScale } from '../../../other/Scaling';
import { imageIconBack, imageIconMoreVertical } from '../../../../assets/icons';

const HeaderComponent = ({goBack, isFocus, dataItem, goToProfile, onClickMore}) => {
    
    return (
        <Header
            placement="left"
            centerComponent={() => {
                return (
                    <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 43}}>
                            <TouchableOpacity onPress={() => goBack()}>
                                {imageIconBack(moderateScale(24), moderateScale(24))}
                            </TouchableOpacity>
                            
                            <HeaderContain 
                                isFocus={isFocus}
                                dataItem={dataItem}
                                goToProfile={goToProfile}
                            />

                            <View 
                                style={{
                                    right: 0,
                                    flexDirection: 'row',
                                    position: 'absolute'
                                }}
                            >
                                <TouchableOpacity onPress={() => onClickMore()}>
                                    {imageIconMoreVertical(moderateScale(24), moderateScale(24))}
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                )
            }}
            containerStyle={{
                height: 88,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                paddingTop: 5,
                marginHorizontal: -12,
                justifyContent: 'center',
                backgroundColor: '#FFFFFFFF'
            }}
        />

    )
}

export default React.memo(HeaderComponent);