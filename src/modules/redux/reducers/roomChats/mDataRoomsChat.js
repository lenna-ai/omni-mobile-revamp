import {
    DATA_ROOMS_CHAT,
    DATA_MORE_ROOMS_CHAT,
    DATA_PUSH_ROOMS_CHAT,
    DATA_UPDATE_ROOMS_CHAT,
    DATA_RELOAD_ROOMS_CHAT,
    DATA_TEXT_SEARCH_ROOMS_CHAT
} from './../../actions/roomChats/inRoomChats';

let dataState = { 
    dataRoomsChat: [],
    textSearchRoomsChat: ""
};

export const mDataRoomsChat = (state = dataState, action) => {
    switch (action.type) {
        case DATA_ROOMS_CHAT:
            return {
                ...state, 
                dataRoomsChat: action.payload,
            };
        case DATA_MORE_ROOMS_CHAT:
            return {
                ...state, 
                dataRoomsChat: [
                    ...state.dataRoomsChat, 
                    ...action.payload
                ],
            };
        case DATA_PUSH_ROOMS_CHAT:
            return {...state, dataRoomsChat: action.payload};
        case DATA_UPDATE_ROOMS_CHAT:
            return {...state, dataRoomsChat: action.payload};
        case DATA_RELOAD_ROOMS_CHAT:
            return {
                ...state, 
                dataRoomsChat: [],
            };
        case DATA_TEXT_SEARCH_ROOMS_CHAT:
            return {
                ...state, 
                textSearchRoomsChat: action.payload,
            }
        default:
            return state;
    }
};
  
