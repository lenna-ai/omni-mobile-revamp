import { 
    createStore, 
    applyMiddleware, 
    combineReducers 
} from 'redux';

import thunk from 'redux-thunk';

import { mDataLogin } from './reducers/mDataLogin';
import { mDataChats } from './reducers/mDataChats';
import { mDataChatsReq } from './reducers/mDataChatsReq';
import { mDataNavigation } from './reducers/mDataNavigation';
import { mDataUserLogin } from './reducers/mDataUserLogin';


import { mDataMain } from './reducers/home/mDataMain';
import { mDataStatus } from './reducers/home/mDataStatus';
import { mDataMember } from './reducers/member/mDataMember';
import { mDataOfficeHour } from './reducers/home/mDataOfficeHour';
import { mDataForAssign } from './reducers/member/mDataForAssign';
import { mDataRoomsChat } from './reducers/roomChats/mDataRoomsChat';
import { mProfileWasLogin } from './reducers/profileWasLogin/mProfileWasLogin';
import { mCustomerProfile } from './reducers/customerProfile/mCustomerProfile';
import { mDataBSNavigationPlus } from './reducers/other/mDataBSNavigationPlus';
import { mDataSelectForFilter } from './reducers/roomChats/mDataSelectForFilter';
import { mAppConfiguration } from './reducers/appConfiguration/mAppConfiguration';

const rootReducer = combineReducers({
    mDataMain,
    mDataLogin,
    mDataChats,
    mDataMember,
    mDataStatus,
    mDataChatsReq,
    mDataForAssign,
    mDataUserLogin,
    mDataRoomsChat,
    mDataNavigation,
    mDataOfficeHour,
    mCustomerProfile,
    mProfileWasLogin,
    mAppConfiguration,
    mDataSelectForFilter,
    mDataBSNavigationPlus,
})

export default createStore(rootReducer, applyMiddleware(thunk));
