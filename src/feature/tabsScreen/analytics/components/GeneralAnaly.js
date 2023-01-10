import * as React  from 'react';

import { 
    Text,
    View,
    Modal,
    Image,
    Platform,
    FlatList,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import API from './../../../../utils/api';
import { encodeHashIds } from '../../../../utils/encode';
import LoadingBig from './../../../../assets/anime/loading_big.gif';
import { moderateScale, verticalScale } from '../../../other/Scaling';
import { getData, getDataWithParams } from '../../../../modules/services';

import { 
    imageIconAmount,
    imageIconTransaction,
    imageIconOverallUsers, 
    imageIconOverallMessages
} from '../../../../assets/icons';

// External Import
import moment from 'moment';
import { useSelector } from 'react-redux';
import { BarChart, PieChart } from "react-native-chart-kit";
import DateRangePicker from "react-native-daterange-picker";

const dimenWidth = Dimensions.get('screen').width;
const dimenHeight = Dimensions.get('screen').height;
const textFontHK = Platform.OS == 'ios' ? 'HK Grotesk' : 'HKGrotesk-Regular';

const dataBase = ["#0087d3", "#1d95d8", "#3aa2dd", "#56b0e2", "#73bde7", "#90cbec", "#add8f1", "#7285A5", "#008081", "1D2951", "#4C516D"];

const chartConfig = {
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    backgroundGradientTo: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientFromOpacity: 0,
    useShadowColorFromDataset: false,
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 135, 211, ${opacity})`,
};

const GeneralAnaly = ({route, navigation}) => {

    const disUser = useSelector((state) => state.mDataUserLogin);
    let dataUser = disUser.dataUserWasLogin;

    const [isLoading, setIsLoading] = React.useState(false);

    const [overallMau, setOverallMau] = React.useState(0);
    const [overallUsers, setOverallUsers] = React.useState(0);
    const [overallMessages, setOverallMessages] = React.useState(0);
    const [overallLiveConversations, setOverallLiveConversations] = React.useState(0);

    const [tags, setTags] = React.useState(null);
    const [dasGeneral, setDasGeneral] = React.useState(null);
    const [consumerBase, setConsumerBase] = React.useState(null);
    const [customNewUser, setCustomNewUser] = React.useState(null);
    const [dasGenTopStories, setDasGenTopStories] = React.useState(null);

    const dateNow = new Date();
    const dateCustom = new Date(dateNow.getTime() - (6 * 24 * 60 * 60 * 1000));
    
    const [endDate, setEndDate] = React.useState(null);
    const [startDate, setStartDate] = React.useState(null);
    const [displayedDate, setDisplayedDate] = React.useState(moment());
    const [maxDate, setMaxDate] = React.useState(moment().set(dateNow));

    const [isClickFilter, setIsClickFilter] = React.useState(false);
    const [heightDaterange, setHeightDaterange] = React.useState(0);

    const [timeShow, setTimeShow] = React.useState(true);

    React.useEffect(() => {
        setStartDate(moment().set("date", dateCustom.getDate()));
        setEndDate(moment().set("date", dateNow.getDate()));
        loadAllData(true);
    }, []);

    const loadAllData = (isFirst) => {
        setIsLoading(true);

        const dataFormat = "YYYY-MM-DD";

        let dateNowFormat = null;
        let dateSevenDayAgoFormat = null;

        if (isFirst) {
            let dateSevenDayAgo = new Date(dateNow - 6 * 24 * 60 * 60 * 1000);

            dateNowFormat = moment(dateNow).format(dataFormat);
            dateSevenDayAgoFormat = moment(dateSevenDayAgo).format(dataFormat);
        } else {
            dateNowFormat = moment(endDate).format(dataFormat);
            dateSevenDayAgoFormat = moment(startDate).format(dataFormat);
        }

        getDataTopStories();
        getDataDashboardMau();
        getDataDashboardOverallUsers();
        getDataDashboardOverallMessages();
        getDataDashboardOverallLiveConversations();
        getDataDashboard(dateSevenDayAgoFormat, dateNowFormat);
    }

    const getDataDashboard = async(startFilter, endFilter) => {

        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        let params = {
            start: startFilter,
            end: endFilter
        }

        console.log("headers_getDataDashboard", params);

        try {
            let res = await getDataWithParams(
                API.PATH + encodeHashIds(dataUser.app_id) + '/dashboard/get-data', 
                params,
                headers
            );
            console.log('ini adlaah response success => ',res);

            // if (res.success) {
            //     setDasGeneral(res.data);
            //     onSetDataCustomTags(res.data.chart.tags);
            //     onSetDataNewUser(res.data.chart.daily_user);
            //     onSetDataCustomCunsumerBase(res.data.chart.consumer_base);

            //     setTimeout(() => {
            //         setIsLoading(false);
            //     }, 1000);
            // } else {
            //     setDasGeneral(null);
            //     onSetDataNewUser(null);
            //     onSetDataCustomTags(null);
            //     onSetDataCustomCunsumerBase(null);

            //     setIsLoading(false);
            // }
        } catch (e) {
            console.log('ini adalah respnse error => ',e);
            // setIsLoading(false);
            // setDasGeneral(null);
            // onSetDataNewUser(null);
            // onSetDataCustomTags(null);
            // onSetDataCustomCunsumerBase(null);

            setIsLoading(false);
        }
    };

    const onSetDataNewUser = (data) => {
        let arrNewUserKey = [];
        let arrDataNewUser = [];

        console.log("data111", data)

        Object.entries(data).
            forEach((value) => {
                let dateNewUser = new Date(value[0]);

                console.log("dateNewUser", dateNewUser)

                let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                let monthAndDay = dateNewUser.getDate() + " " + monthShortNames[dateNewUser.getMonth()];

                arrNewUserKey.push(monthAndDay);
                arrDataNewUser.push(value[1]);
            });

        let objDataSet = [
            {
                data: arrDataNewUser
            }
        ];

        let allDataUser = {
            labels: arrNewUserKey,
            datasets: objDataSet
        }
        setCustomNewUser(allDataUser);
    }

    const onSetDataCustomCunsumerBase = (data) => {
        let arrConsumerBase = [];
        data.map((item, index) => {
            let objConsumerBase = {
                name: item.name,
                population: item.channel_count,
                color: dataBase[index],
                legendFontColor: "#000",
                legendFontSize: 14
            }

            arrConsumerBase.push(objConsumerBase);
        });
        console.log("arrConsumerBase", arrConsumerBase);
        setConsumerBase(arrConsumerBase);
    }

    const onSetDataCustomTags = (data) => {
        let arrTags = [];
        data.map((item, index) => {
            let objTags = {
                name: item.name,
                population: item.tag_count,
                color: dataBase[index],
                legendFontColor: "#000",
                legendFontSize: 14
            }

            arrTags.push(objTags);
        });
        setTags(arrTags);
    }
    
    const getDataTopStories = async() => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        try {
            let res = await getData(
                API.PATH + encodeHashIds(dataUser.app_id) + '/dashboard/top-stories', 
                headers
            );
            setDasGenTopStories(res.data);
        } catch (e) {
            console.log(e);
        }
    }

    const getDataDashboardOverallMessages = async() => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        try {
            let res = await getData(
                API.PATH + encodeHashIds(dataUser.app_id) + '/dashboard/overall-messages', 
                headers
            );
            console.log("getDataDashboardOverallMessages", res);
            setOverallMessages(res);
        } catch (e) {
            console.log(e);
        }
    };

    const getDataDashboardOverallUsers = async() => {

        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        try {
            let res = await getData(
                API.PATH + encodeHashIds(dataUser.app_id) + '/dashboard/overall-users', 
                headers
            );
            console.log("getDataDashboardOverallUsers", res);
            setOverallUsers(res);
        } catch (e) {
            console.log(e);
        }

    };

    const getDataDashboardOverallLiveConversations = async() => {
        
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        try {
            let res = await getData(
                API.PATH + encodeHashIds(dataUser.app_id) + '/dashboard/overall-live-conversations', 
                headers
            );
            console.log("getDataDashboardOverallLiveConversations", res);
            setOverallLiveConversations(res);
        } catch (e) {
            console.log(e);
        }
    };

    const getDataDashboardMau = async() => {
        let headers = {
            token: dataUser.token,
            userId: encodeHashIds(dataUser.user_id)
        }

        try {
            let res = await getData(
                API.PATH + encodeHashIds(dataUser.app_id) + '/dashboard/mau', 
                headers
            );
            console.log("getDataDashboardMau", res);
            setOverallMau(res);
        } catch (e) {
            console.log(e);
        }
    };

    const imageItemContainOverAll = (item) => {
        return (
            <Image
                style={{
                    width: moderateScale(38),
                    height: moderateScale(38)
                }}
                source={item}
            />
        );
    }

    React.useEffect(() => {
        if (heightDaterange > 0) {
            setTimeShow(true);
        }
    }, [heightDaterange]);

    const setDates = (dates) => {
        console.log("datess", dates);
        if (dates.startDate != null && dates.endDate != null) {
            setStartDate(dates.startDate);
            setEndDate(dates.endDate);
        } else {
            if (dates.startDate != null) {
                setStartDate(dates.startDate);
            }
            setEndDate(dates.endDate);
        }

        if (dates.displayedDate != null) {
            setTimeShow(false);
            setDisplayedDate(dates.displayedDate);
        }
      };

    const ItemContainOverAll = ({title, subTitle, imageTitle, isActive, userActive}) => {

        let dataUser = "";
        let isUserActive = false;

        if (isActive != null) {
            isUserActive = isActive;
            dataUser = userActive;
        }

        return (
            <View
                style={{
                    flex: 1,
                    marginTop: moderateScale(8),
                    flexDirection: 'row',
                }}
            >
                <View
                    style={{
                        height: 154,
                        borderRadius: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 8,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        height: verticalScale(76),
                        width: ((dimenWidth-moderateScale(48))/2)-moderateScale(3),

                        //Shadow
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        elevation: 5,
                        shadowRadius: 1,
                        shadowOpacity: 0.1,
                        shadowColor: "#000",
                        borderRadius: moderateScale(10),
                    }}
                >
                    <View>
                        
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontSize: moderateScale(14),
                                    fontWeight: 'bold',
                                    
                                }}
                            >
                                {title}
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={{
                                    
                                    fontSize: moderateScale(11),
                                }}
                            >
                                {subTitle}
                            </Text>
                        </View>
                        {imageTitle}
                    </View>

                    {isUserActive?(
                        <View>
                            <Text
                                style={{
                                    color: '#003473',
                                    
                                    fontSize: moderateScale(11),
                                }}
                            >
                                Active Users {dataUser}
                            </Text>
                        </View>
                    ):null}
                </View>

            </View>
        )
    }

    const ContainOverall = () => {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <Text
                    style={{
                        color: '#000000',
                        
                        alignSelf: 'flex-start',
                        textTransform: 'capitalize',
                        fontSize: moderateScale(24),
                        marginBottom: moderateScale(4)
                    }}
                >
                    overall
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                    <ItemContainOverAll 
                        title={overallMessages}
                        subTitle={"Overall messages"}
                        imageTitle={imageIconOverallMessages(moderateScale(38), moderateScale(38))}
                    />

                    <View style={{width: moderateScale(6)}}/>
                    
                    <ItemContainOverAll 
                        title={overallUsers}
                        subTitle={"Overall users"}
                        imageTitle={imageIconOverallUsers(moderateScale(38), moderateScale(38))}
                    />

                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                    <ItemContainOverAll 
                        title={overallLiveConversations}
                        subTitle={"Overall live conversations"}
                        imageTitle={imageItemContainOverAll(require('../../../../assets/image/icon_overall_live_conversations.png'))}
                    />

                    <View style={{width: moderateScale(6)}}/>

                    <ItemContainOverAll 
                        title={overallMau}
                        subTitle={"Monthly active user february"}
                        imageTitle={imageIconOverallUsers(moderateScale(38), moderateScale(38))}
                    />

                </View>

            </View>
        )
    }

    const ContainGeneral = () => {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <View 
                    style={{
                        flexDirection: 'row', 
                        alignItems: 'center',
                        marginTop: verticalScale(24),
                        marginBottom: verticalScale(6),
                        justifyContent: 'space-between'
                    }}
                >
                    <Text
                        style={{
                            color: '#000000',
                            
                            alignSelf: 'flex-start',
                            textTransform: 'capitalize',
                            fontSize: moderateScale(24),
                            marginBottom: moderateScale(4)
                        }}
                    >
                        general
                    </Text>
                    <TouchableOpacity 
                        onPress={() => setIsClickFilter(true)}
                        style={{
                            borderWidth: 1,
                            borderColor: '#5588C3',
                            paddingTop: moderateScale(4),
                            borderRadius: moderateScale(6),
                            paddingBottom: moderateScale(7),
                            paddingHorizontal: moderateScale(8),
                        }}
                    >
                        <Text 
                            style={{
                                color: '#5588C3',
                                
                                fontSize: moderateScale(14),
                            }}
                        >
                            Custom Range
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <ItemContainOverAll 
                        title={dasGeneral != null ? dasGeneral.total_conversation : "0"}
                        subTitle={"Total Message"}
                        imageTitle={imageIconOverallMessages(moderateScale(38), moderateScale(38))}
                    />
                    <View style={{width: moderateScale(6)}}/>
                    <ItemContainOverAll 
                        title={dasGeneral != null ? dasGeneral.total_user : "0"}
                        subTitle={"New users"}
                        imageTitle={imageIconOverallUsers(moderateScale(38), moderateScale(38))}
                        isActive={true}
                        userActive={dasGeneral != null ? dasGeneral.active_users : "0"}
                    />
                </View>

                <View style={{flexDirection: 'row'}}>
                    <ItemContainOverAll 
                        title={"0"}
                        subTitle={"Transactions"}
                        imageTitle={imageIconTransaction(moderateScale(38), moderateScale(38))}
                    />
                    <View style={{width: moderateScale(6)}}/>
                    <ItemContainOverAll 
                        title={"0"}
                        subTitle={"Amount"}
                        imageTitle={imageIconAmount(moderateScale(38), moderateScale(38))}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <ItemContainOverAll 
                        title={"0"}
                        subTitle={"Total live conversations"}
                        imageTitle={imageItemContainOverAll(require('../../../../assets/image/icon_overall_live_conversations.png'))}
                    />
                    <View style={{width: moderateScale(6)}}/>
                    <ItemContainOverAll 
                        title={dasGeneral != null ? dasGeneral.total_on_going_conversation : "0"}
                        subTitle={"Total on going conversations"}
                        imageTitle={imageIconOverallMessages(moderateScale(38), moderateScale(38))}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <ItemContainOverAll 
                        title={dasGeneral != null ? dasGeneral.total_resolved_conversation : "0"}
                        subTitle={"Total resolved conversation"}
                        imageTitle={imageIconOverallMessages(moderateScale(38), moderateScale(38))}
                    />
                    <View style={{width: moderateScale(6)}}/>
                    <ItemContainOverAll 
                        title={dasGeneral != null ? dasGeneral.average_agent_first_response_time + " Minutes" : "0 Minutes" }
                        subTitle={"Average agent first response time"}
                        imageTitle={imageIconOverallMessages(moderateScale(38), moderateScale(38))}
                    />
                </View>
            </View>
        )
    }

    const ContainTopStories = () => {
        return(
            <View
                style={{
                    marginTop: moderateScale(28),
                    width: dimenWidth-moderateScale(48),
                }}
            >
                <View
                    style={{
                        width: '100%',
                        shadowColor: "#000",
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        marginTop: moderateScale(5),
                        borderRadius: moderateScale(10),
                        paddingVertical: moderateScale(16),
                        paddingHorizontal: moderateScale(18),
                        //shadow
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        elevation: 5,
                        shadowRadius: 3.84,
                        shadowOpacity: 0.25
                    }}
                >
                    <Text
                        style={{
                            color: '#000000',
                            fontWeight: '700',
                            
                            alignSelf: 'flex-start',
                            textTransform: 'capitalize',
                            fontSize: moderateScale(14),
                            marginBottom: moderateScale(24)
                        }}
                    >
                        Top 35 Stories
                    </Text>

                    {dasGenTopStories != null?(
                        <FlatList
                            scrollEnabled={false}
                            keyExtractor={item => item.id}
                            renderItem={itemContainTopStories}
                            data={dasGenTopStories.data.slice(0, 5)}
                            style={{flexDirection: 'column', alignSelf: 'flex-start'}}
                        />
                    ):(
                        <View>
                            <Text
                                style={{
                                    color: '#000000',
                                    
                                    alignSelf: 'flex-start',
                                    textTransform: 'capitalize',
                                    fontSize: moderateScale(14),
                                    marginTop: verticalScale(8)
                                }}
                            >
                                Data not found
                            </Text>
                        </View>
                    )}

                    {dasGenTopStories!=null?
                        dasGenTopStories.data.length > 5?(
                            <>
                                <View 
                                    style={{
                                        height: 1,
                                        backgroundColor: '#c9c9c9',
                                        marginVertical: moderateScale(8),
                                        width: dimenWidth-moderateScale(48),
                                    }}
                                />
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('ItemGeneralAnaly', {
                                        title: 'Top 35 Stories',
                                        data: dasGenTopStories
                                    })}
                                    style={{
                                        alignItems: 'center',
                                        width: dimenWidth-moderateScale(48)
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#3490dc',
                                            
                                            fontSize: moderateScale(12),
                                            textDecorationColor: '#3490dc',
                                            textDecorationLine: 'underline',
                                        }}
                                    >
                                        Lebih Detail
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ):null
                    :null}
                </View>
            </View>
        )
    }

    const ContainAgentAvailability = () => {
        return(
            <View
                style={{
                    marginTop: moderateScale(28),
                    width: dimenWidth-moderateScale(48),
                }}
            >
                <View
                    style={{
                        width: '100%',
                        shadowColor: "#000",
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        marginTop: moderateScale(5),
                        borderRadius: moderateScale(10),
                        paddingVertical: moderateScale(16),
                        paddingHorizontal: moderateScale(18),
                        //shadow
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        elevation: 5,
                        shadowRadius: 3.84,
                        shadowOpacity: 0.25
                    }}
                >
                    <Text
                        style={{
                            color: '#000000',
                            fontWeight: '700',
                            
                            alignSelf: 'flex-start',
                            textTransform: 'capitalize',
                            fontSize: moderateScale(14),
                        }}
                    >
                        Agent Availability
                    </Text>
                    <View 
                        style={{
                            height: 1,
                            backgroundColor: '#c9c9c9',
                            marginVertical: moderateScale(12),
                            width: (dimenWidth-moderateScale(48))+moderateScale(5),
                        }}
                    />

                    {dasGeneral != null?(
                        <FlatList
                            scrollEnabled={false}
                            keyExtractor={item => item.id}
                            renderItem={itemContainAgentAvailability}
                            data={dasGeneral.agent_availability.slice(0, 5)}
                            style={{flexDirection: 'column', alignSelf: 'flex-start'}}
                        />
                    ):(
                        <View>
                            <Text
                                style={{
                                    color: '#000000',
                                    
                                    alignSelf: 'flex-start',
                                    textTransform: 'capitalize',
                                    fontSize: moderateScale(14),
                                    marginTop: verticalScale(8)
                                }}
                            >
                                Data not found
                            </Text>
                        </View>
                    )}

                    {dasGeneral!=null?
                        dasGeneral.agent_availability.length > 5?(
                            <>
                                <View 
                                    style={{
                                        height: 1,
                                        backgroundColor: '#c9c9c9',
                                        marginVertical: moderateScale(8),
                                        width: dimenWidth-moderateScale(48),
                                    }}
                                />
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('ItemGeneralAnaly', {
                                        title: 'Agent Availability',
                                        data: dasGeneral.agent_availability
                                    })}
                                    style={{
                                        alignItems: 'center',
                                        width: dimenWidth-moderateScale(48)
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#3490dc',
                                            
                                            fontSize: moderateScale(12),
                                            textDecorationColor: '#3490dc',
                                            textDecorationLine: 'underline',
                                        }}
                                    >
                                        Lebih Detail
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ):null
                    :null}
                </View>
            </View>
        )
    }

    const ContainRecentUsers = () => {

        return(
            <View
                style={{
                    marginTop: moderateScale(28),
                    width: dimenWidth-moderateScale(48),
                }}
            >
                <View
                    style={{
                        width: '100%',
                        shadowColor: "#000",
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        marginTop: moderateScale(5),
                        borderRadius: moderateScale(10),
                        paddingVertical: moderateScale(16),
                        paddingHorizontal: moderateScale(18),
                        //shadow
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        elevation: 5,
                        shadowRadius: 3.84,
                        shadowOpacity: 0.25
                    }}
                >
                    <Text
                        style={{
                            color: '#000000',
                            fontWeight: '700',
                            
                            alignSelf: 'flex-start',
                            textTransform: 'capitalize',
                            fontSize: moderateScale(14),
                        }}
                    >
                        Recent Users
                    </Text>
                    <View 
                        style={{
                            height: 1,
                            backgroundColor: '#c9c9c9',
                            marginVertical: moderateScale(12),
                            width: dimenWidth-moderateScale(48),
                        }}
                    />

                    {dasGeneral != null ? (
                            <FlatList
                                scrollEnabled={false}
                                keyExtractor={item => item.id}
                                renderItem={itemContainRecentUsers}
                                data={dasGeneral.last_user.slice(0, 5)}
                            />
                    ) : (
                        <View>
                            <Text
                                style={{
                                    color: '#000000',
                                    
                                    alignSelf: 'flex-start',
                                    textTransform: 'capitalize',
                                    fontSize: moderateScale(14),
                                    marginTop: verticalScale(8)
                                }}
                            >
                                Data not found
                            </Text>
                        </View>
                    )}

                    {dasGeneral != null?
                        dasGeneral.last_user.length > 5?(
                            <>
                                <View 
                                    style={{
                                        height: 1,
                                        backgroundColor: '#c9c9c9',
                                        marginVertical: moderateScale(8),
                                        width: dimenWidth-moderateScale(48),
                                    }}
                                />
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('ItemGeneralAnaly', {
                                        title: 'Recent Users',
                                        data: dasGeneral.last_user
                                    })}
                                    style={{
                                        alignItems: 'center',
                                        width: dimenWidth-moderateScale(48)
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#3490dc',
                                            
                                            fontSize: moderateScale(12),
                                            textDecorationColor: '#3490dc',
                                            textDecorationLine: 'underline',
                                        }}
                                    >
                                        Lebih Detail
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ):null
                    :null}
                </View>
            </View>
        )
    }

    const itemContainTopStories = ({item}) => {
        let datValue = parseInt((item.total/dasGenTopStories.total_request)*100);
        return (
            <View>
                <View style={{flex: 1, width: dimenWidth-moderateScale(84)}}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text
                            numberOfLines={1}
                            style={{
                                flex: 0.7,
                                textAlign: 'left',
                                
                                fontSize: moderateScale(11),
                            }}
                        >
                            {item.story}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{
                                flex: 0.3,
                                textAlign: 'right',
                                
                                fontSize: moderateScale(11),
                            }}
                        >
                            {item.total}
                        </Text>
                    </View>
                    <View 
                        style={{
                            height: verticalScale(24),
                            backgroundColor: '#e9ecef',
                            marginTop: verticalScale(8),
                            borderRadius: moderateScale(4),
                            marginBottom: verticalScale(16),
                            width: dimenWidth-moderateScale(84),
                        }}
                    >
                        <View 
                            style={{
                                height: verticalScale(24),
                                backgroundColor: '#5588C3',
                                borderRadius: moderateScale(4),
                                width: datValue.toString() + '%',
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }

    const itemContainAgentAvailability = ({item}) => {
        return (
            <View
                style={{
                    marginVertical: moderateScale(4)
                }}
            >
                <View style={{flexDirection: 'column'}}>
                    <Text
                        numberOfLines={1}
                        style={{
                            
                            fontSize: moderateScale(11),
                        }}
                    >
                        {item.name}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: '#c9c9c9',
                            
                            fontSize: moderateScale(11),
                        }}
                    >
                        {item.email}
                    </Text>
                </View>
            </View>
        )
    }

    const itemContainRecentUsers = ({item}) => {

        return (
            <View
                style={{flexDirection: 'row', marginVertical: moderateScale(4)}}
            >
                 <View 
                    style={{
                        backgroundColor: '#3490dc',
                        paddingTop: moderateScale(8),
                        marginRight: moderateScale(6),
                        borderRadius: moderateScale(12),
                        paddingBottom: moderateScale(8),
                        paddingHorizontal: moderateScale(8),
                    }}
                >
                    <Text
                        style={{
                            color: '#ffffff',
                            
                            fontSize: moderateScale(11),
                        }}
                    >
                        {moment(item.updated_at, 'YYYYMMDD').fromNow()}
                    </Text>
                </View>
                <View style={{flexDirection: 'column'}}>
                    <Text
                        numberOfLines={1}
                        style={{
                            
                            fontSize: moderateScale(11),
                        }}
                    >
                        {item.name}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: '#c9c9c9',
                            
                            fontSize: moderateScale(11),
                        }}
                    >
                        {item.email}
                    </Text>
                </View>
            </View>
        )
    }

    const ContainChartNewUser = () => {
        return(
            <View
                style={{
                    marginTop: moderateScale(28),
                    width: (dimenWidth-moderateScale(48)),
                }}
            >
                <View
                    style={{
                        width: '100%',
                        shadowColor: "#000",
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        marginTop: moderateScale(5),
                        borderRadius: moderateScale(10),
                        paddingVertical: moderateScale(16),
                        paddingHorizontal: moderateScale(18),
                        //shadow
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        elevation: 5,
                        shadowRadius: 3.84,
                        shadowOpacity: 0.25
                    }}
                >
                    <Text
                        style={{
                            color: '#000000',
                            fontWeight: '700',
                            
                            alignSelf: 'flex-start',
                            textTransform: 'capitalize',
                            fontSize: moderateScale(14),
                        }}
                    >
                        New User
                    </Text>

                    {
                        dasGeneral != null?(
                            <ScrollView
                                style={{flex: 1}}
                                horizontal={true}
                                showsVerticalScrollIndicator={false}
                            >
                                <BarChart
                                    data={customNewUser}
                                    height={moderateScale(300)}
                                    chartConfig={chartConfig}
                                    verticalLabelRotation={90}
                                    style={{marginTop: moderateScale(16), marginBottom: moderateScale(8)}}
                                    width={customNewUser.labels.length > 5
                                        ? (customNewUser.labels.length/5)*(dimenWidth-moderateScale(48))
                                        : dimenWidth-moderateScale(48)}
                                />
                            </ScrollView>
                        ):(
                            <View>
                                <Text
                                    style={{
                                        color: '#000000',
                                        
                                        alignSelf: 'flex-start',
                                        textTransform: 'capitalize',
                                        fontSize: moderateScale(14),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Data not found
                                </Text>
                            </View>
                        )

                    }
                </View>
            </View>
        )
    }
    
    const ContainTags = () => {
        return (
            <View
                style={{
                    marginTop: moderateScale(28),
                    width: dimenWidth-moderateScale(48),
                }}
            >
                <View
                    style={{
                        width: '100%',
                        shadowColor: "#000",
                        backgroundColor: '#fff',
                        marginTop: moderateScale(5),
                        borderRadius: moderateScale(10),
                        paddingTop: moderateScale(16),
                        paddingBottom: moderateScale(20),
                        paddingHorizontal: moderateScale(18),
                        //shadow
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        elevation: 5,
                        shadowRadius: 3.84,
                        shadowOpacity: 0.25
                    }}
                >
                    <Text
                        style={{
                            color: '#000000',
                            fontWeight: '700',
                            
                            alignSelf: 'flex-start',
                            textTransform: 'capitalize',
                            fontSize: moderateScale(14),
                        }}
                    >
                        Tags
                    </Text>
                    <View style={{flex: 1, alignSelf: 'flex-start'}}>
                        {dasGeneral != null?
                            <PieChart
                                data={tags}
                                hasLegend={false}
                                paddingLeft={"15"}
                                accessor={"population"}
                                chartConfig={chartConfig}
                                center={[moderateScale(44), 0]}
                                backgroundColor={"transparent"}
                                width={dimenWidth-moderateScale(48)}
                                height={dimenWidth-moderateScale(48)}
                            />
                        :(
                            <View>
                                <Text
                                    style={{
                                        color: '#000000',
                                        
                                        alignSelf: 'flex-start',
                                        textTransform: 'capitalize',
                                        fontSize: moderateScale(14),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Data not found
                                </Text>
                            </View>
                        )}

                        {dasGeneral != null?
                            dasGeneral.chart.tags.map((item, index) => {
                                return (
                                    <View 
                                        key={item.name}
                                        style={{
                                            flex: 1, 
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',  
                                            marginHorizontal: moderateScale(6)
                                        }}
                                    >
                                        <View 
                                            style={{
                                                width: moderateScale(16), 
                                                height: moderateScale(16),
                                                marginRight: moderateScale(8),
                                                borderRadius: moderateScale(16),
                                                backgroundColor: dataBase[index],
                                            }}
                                        />
    
                                        <Text
                                            style={{
                                                color: '#000000',
                                                
                                                alignSelf: 'flex-start',
                                                textTransform: 'capitalize',
                                                fontSize: moderateScale(16),
                                            }}
                                        >
                                            {item.tag_count + " " + item.name} 
                                            {/* {"(" + strPersen + "%)" + " - " + item.tag_count + " " + item.name }  */}
                                        </Text>
    
                                    </View>
                                )
    
                            })
                        :null}
                    </View>
                </View>
            </View>
        )
    }

    const ContainChartConsumerBase = () => {

        return (
            <View
                style={{
                    marginTop: moderateScale(28),
                    width: dimenWidth-moderateScale(48),
                }}
            >
                <View
                    style={{
                        width: '100%',
                        shadowColor: "#000",
                        backgroundColor: '#fff',
                        marginTop: moderateScale(5),
                        borderRadius: moderateScale(10),
                        paddingTop: moderateScale(16),
                        paddingBottom: moderateScale(20),
                        paddingHorizontal: moderateScale(18),
                        //shadow
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        elevation: 5,
                        shadowRadius: 3.84,
                        shadowOpacity: 0.25
                    }}
                >
                    <Text
                        style={{
                            color: '#000000',
                            fontWeight: '700',
                            
                            alignSelf: 'flex-start',
                            textTransform: 'capitalize',
                            fontSize: moderateScale(14),
                        }}
                    >
                        Consumer Base
                    </Text>
                    <View style={{flex: 1, alignSelf: 'flex-start'}}>
                        {dasGeneral != null?(
                            <PieChart
                                data={consumerBase}
                                width={(dimenWidth-moderateScale(48))}
                                height={dimenWidth-moderateScale(48)}
                                chartConfig={chartConfig}
                                accessor={"population"}
                                backgroundColor={"transparent"}
                                paddingLeft={"15"}
                                hasLegend={false}
                                center={[moderateScale(44), 0]}
                            />
                        ):(
                            <View>
                                <Text
                                    style={{
                                        color: '#000000',
                                        
                                        alignSelf: 'flex-start',
                                        textTransform: 'capitalize',
                                        fontSize: moderateScale(14),
                                        marginTop: verticalScale(8)
                                    }}
                                >
                                    Data not found
                                </Text>
                            </View>
                        )}
                        {dasGeneral != null?
                            dasGeneral.chart.consumer_base.map((item, index) => {
                                let persen = (item.channel_count/overallUsers)*100;
                                let strPersen = persen.toFixed(1);
                                return (
                                    <View 
                                        key={item.name}
                                        style={{
                                            flex: 1, 
                                            alignItems: 'center',
                                            flexDirection: 'row', 
                                            justifyContent: 'flex-start', 
                                            marginHorizontal: moderateScale(6)
                                        }}
                                    >
                                        <View 
                                            style={{
                                                width: moderateScale(16), 
                                                height: moderateScale(16),
                                                marginRight: moderateScale(8),
                                                borderRadius: moderateScale(16),
                                                backgroundColor: dataBase[index],
                                            }}
                                        />
    
                                        <Text
                                            style={{
                                                color: '#000000',
                                                
                                                alignSelf: 'flex-start',
                                                textTransform: 'capitalize',
                                                fontSize: moderateScale(16),
                                            }}
                                        >
                                            {"(" + strPersen + "%)" + " - " + item.channel_count + " " + item.name } 
                                        </Text>
    
                                    </View>
                                )
                            })
                        :null}
                    </View>
                </View>
            </View>
        )
    }

    const positionTop = (x) => {
        console.log("xxxten", x);
        setHeightDaterange(x);
    }

    const onFilterDate = () => {
        setIsClickFilter(false);
        setHeightDaterange(0);

        loadAllData(false);
    }

    const onCancelDate = () => {
        setIsClickFilter(false);
        setHeightDaterange(0);

        setStartDate(moment().set("date", dateCustom.getDate()));
        setEndDate(moment().set("date", dateNow.getDate()));
        loadAllData(true);
    }

    const onCloseDate = () => {
        setIsClickFilter(false);
        setHeightDaterange(0);
    }

    const containHeader = () => {
        if (timeShow) {
            return (
                <View style={{
                    alignSelf: 'center',
                    zIndex: 2147483650,
                    position: 'absolute',
                    flexDirection:  'row',
                    width: dimenWidth * 0.85,
                    justifyContent: 'space-between',
                    top: heightDaterange - verticalScale(38),
                }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            marginRight: moderateScale(8),
                            borderRadius: moderateScale(24),
                            paddingVertical: moderateScale(4),
                            paddingHorizontal: moderateScale(4)
                        }}
                        onPress={() => onCloseDate()}
                    >
                        <Image
                            resizeMode="contain"
                            style={{width: moderateScale(24), height: moderateScale(24)}}
                            source={require('./../../../../assets/image/ic_close_round.png')}
                        />
                    </TouchableOpacity>

                    <View style={{
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                    }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#ED5653',
                                marginRight: moderateScale(8),
                                borderRadius: moderateScale(12),
                                paddingVertical: moderateScale(4),
                                paddingHorizontal: moderateScale(12)
                            }}
                            onPress={() => onCancelDate()}
                        >
                            <Text
                                style={{
                                    color: '#ffffff',
                                    
                                    alignSelf: 'flex-start',
                                    textTransform: 'capitalize',
                                    fontSize: moderateScale(16),
                                    marginBottom: moderateScale(3)
                                }}
                            >
                                reset
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                
                                backgroundColor: '#5588C3',
                                borderRadius: moderateScale(12),
                                paddingVertical: moderateScale(4),
                                paddingHorizontal: moderateScale(12),
                            }}
                            onPress={() => onFilterDate()}
                        >
                            <Text
                                style={{
                                    color: '#ffffff',
                                    
                                    alignSelf: 'flex-start',
                                    textTransform: 'capitalize',
                                    fontSize: moderateScale(16),
                                    marginBottom: moderateScale(3)
                                }}
                            >
                                apply
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            )
        } else {
            return null;
        }

    }

    return (
        <View style={styles.container}>
            {
                isLoading?(
                    <View 
                        style={{
                            flex: 1, 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <Image
                            style={{height: 80, width: 80}}
                            resizeMode="contain"
                            source={LoadingBig}
                            autoPlay
                        />
                    </View>
                ) : (
                    <View style={styles.container}>
                        <ScrollView
                            style={{flex: 1}}
                            showsVerticalScrollIndicator={false}
                        >
                            <View 
                                style={{
                                    flex: 1,
                                    alignSelf: 'center',
                                    marginVertical: moderateScale(18),
                                    marginHorizontal: moderateScale(8),
                                    width: dimenWidth-moderateScale(48),
                                }}
                            >
                                <ContainOverall />
                                <ContainGeneral />
                                <ContainChartConsumerBase />
                                <ContainChartNewUser />
                                <ContainRecentUsers />
                                <ContainAgentAvailability />
                                <ContainTopStories />
                                <ContainTags />
                            </View>
                        </ScrollView>
                    </View>
                )
            }
            <Modal transparent={true} visible={isClickFilter}>

                <View>
                    <DateRangePicker
                        range
                        maxDate={maxDate}
                        endDate={endDate}
                        onChange={setDates}
                        open={isClickFilter}
                        startDate={startDate}
                        displayedDate={displayedDate}
                        layoutChange={(x) => positionTop(x)}
                    />

                    {containHeader()}
                    
                </View>
                
                
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default React.memo(GeneralAnaly);