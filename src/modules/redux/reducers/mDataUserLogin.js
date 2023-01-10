import {
    SESSION_ERROR,
    DATA_USER_WAS_LOGIN,
    RESET_USER_WAS_LOGIN,
} from '../actions/inDataUserLogin';

let dataState = { 
    dataUserWasLogin: {},
    sessionError: false,
};

export const mDataUserLogin = (state = dataState, action) => {
    switch (action.type) {
        case DATA_USER_WAS_LOGIN:
            return {...state, dataUserWasLogin: action.payload};
        case RESET_USER_WAS_LOGIN: 
            return {...state, dataUserWasLogin: {}};
        case SESSION_ERROR:
            return {...state, sessionError: action.payload};
        default:
            return state;
    }
};
