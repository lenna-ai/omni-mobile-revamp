import { 
    DATA_CHAT_ROOMS,
    DATA_PUSH_CHAT_ROOMS,
    DATA_CHATS_ROOMS_RELOAD,
} from '../actions/inChatRoom';

let dataState = { 
    data: []
};

export const mDataChatRooms = (state = dataState, action) => {
    switch (action.type) {
        case DATA_CHATS_ROOMS_RELOAD:
            return {...state, data: []};
        case DATA_CHAT_ROOMS:
            return {...state, data: [...state.data, ...action.payload]};
        case DATA_PUSH_CHAT_ROOMS:
            let dataChange = action.payload;
            let filteredArr = [...dataChange, ...state.data].reduce((acc, current) => {
                const x = acc.find(item => item.id === current.id);
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
            }, []);
            return {...state, data: filteredArr};
        default:
            return state;
    }
};
  
