import {
    IS_LOGIN,
    IS_ONBOARD,
    IS_ONACTIVE_NAV,
    IS_CHOOSE_ACTIVE,
    IS_CHOOSE_CHANNEL
} from '../actions/inNavigation';

let dataState = { 
    isLogin: false,
    isOnBoard: false,
    isOnActiveNav: "",
    isChooseActive: false,
    isChooseChannel: false
};

export const mDataNavigation = (state = dataState, action) => {
    switch (action.type) {
        case IS_LOGIN:
            return {...state, isLogin: action.payload};
        case IS_ONBOARD:
            return {...state, isOnBoard: action.payload};
        case IS_ONACTIVE_NAV:
            return {...state, isOnActiveNav: action.payload};
        case IS_CHOOSE_ACTIVE:
            return {...state, isChooseActive: action.payload};
        case IS_CHOOSE_CHANNEL:
            return {...state, isChooseChannel: action.payload};
        default:
            return state;
    }
};
