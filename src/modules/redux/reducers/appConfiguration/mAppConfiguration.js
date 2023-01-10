import {
    CHANGE_APP_CONFIGURATION
} from './../../actions/appConfiguration/inAppConfigruration';

let dataState = { 
    dataAppConfiguration: null
};

export const mAppConfiguration = (state = dataState, action) => {
    switch (action.type) {
        case CHANGE_APP_CONFIGURATION:
            return {...state, dataAppConfiguration: action.payload};
        default:
            return state;
    }
};
