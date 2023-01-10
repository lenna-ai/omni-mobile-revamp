import { 
    DATA_ROOM_REQ,
    DATA_USER_LOGIN,
} from './../actions/inHome';

let dataState = { 
    data: [] ,
    dataUserLogin: {}
};

export const mDataChatsReq = (state = dataState, action) => {
    switch (action.type) {
        case DATA_ROOM_REQ:
            return {...state, data: action.payload};
        case DATA_USER_LOGIN:
                return {...state, dataUserLogin: action.payload};
        default:
            return state;
    }
};
