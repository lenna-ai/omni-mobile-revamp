import {
    IS_STATUS_LOGIN,
    IS_LOADING_LOGIN,
    RESULT_SCAN_BARCODE,
    STATUS_MESSAGE_LOGIN,
} from './../actions/inLogin';

let dataState = { 
    isStatusLogin: false,
    isLoadingLogin: false,
    resultScanBarcode: "",
    statusMessageLogin: ""
};

export const mDataLogin = (state = dataState, action) => {
    switch (action.type) {
        case IS_STATUS_LOGIN:
            return {...state, isStatusLogin: action.payload};
        case IS_LOADING_LOGIN:
            return {...state, isLoadingLogin: action.payload};
        case STATUS_MESSAGE_LOGIN:
            return {...state, statusMessageLogin: action.payload};
        case RESULT_SCAN_BARCODE:
            return {...state, resultScanBarcode: action.payload};
        default:
            return state;
    }
};
