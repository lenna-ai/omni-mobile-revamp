import {
    LOAD_PROFILE_WAS_LOGIN,
    CHANGE_PROFILE_WAS_LOGIN
} from './../../actions/profileWasLogin/inProfileWasLogin';

let dataState = { 
    changeProfileWasLogin: {},
    loadingProfileWasLogin: false,
};

export const mProfileWasLogin = (state = dataState, action) => {
    switch (action.type) {
        case LOAD_PROFILE_WAS_LOGIN:
            return {...state, loadingProfileWasLogin: action.payload};
        case CHANGE_PROFILE_WAS_LOGIN:
            return {...state, changeProfileWasLogin: action.payload};
        default:
            return state;
    }
};
