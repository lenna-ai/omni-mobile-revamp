import { 
    SET_RESET_FILTER,
    SET_CHANNEL_FILTER,
    SET_CONVERSATION_FILTER
} from './../../actions/roomChats/inSelectForFilter';

let dataState = { 
    channelFilter: new Map(),
    conversationFilter: new Map()
};

export const mDataSelectForFilter = (state = dataState, action) => {
    switch (action.type) {
        case SET_CHANNEL_FILTER:
            return {...state, channelFilter: action.payload};
        case SET_CONVERSATION_FILTER:
            return {...state, conversationFilter: action.payload};
        case SET_RESET_FILTER:
            return {
                ...state, 
                channelFilter: new Map(),
                conversationFilter: new Map()
            };
        default:
            return state;
    }
};
  
