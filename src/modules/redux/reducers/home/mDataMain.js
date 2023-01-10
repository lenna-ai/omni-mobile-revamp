import {
    DATA_ROOM_REQUEST,
    LOAD_ROOM_REQUEST
} from './../../actions/home/inMain';

let dataState = { 
    loadingRoomRequest: true,
    dataRoomRequest: []
};

export const mDataMain = (state = dataState, action) => {
    switch (action.type) {
        case DATA_ROOM_REQUEST:
            return {...state, dataRoomRequest: action.payload};
        case LOAD_ROOM_REQUEST:
            return {...state, loadingRoomRequest: action.payload};
        default:
            return state;
    }
};
