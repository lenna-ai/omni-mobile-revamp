import {
    DATA_FOR_ASSIGN_ROOM_ID,
    DATA_FOR_ASSIGN_AGENT_ID,
    DATA_FOR_ASSIGN_LIVECHAT,
    DATA_RESET_ALL_FOR_ASSIGN,
    DATA_FOR_ASSIGN_AGENT_INFO
} from './../../actions/member/inForAssign';

let dataState = {
    roomIdAssign: 0,
    agentIdAssign: 0,
    livechatAssign: null,
    agentInfoAssign: null
};

export const mDataForAssign = (state = dataState, action) => {
    switch (action.type) {
        case DATA_FOR_ASSIGN_AGENT_ID:
            return {...state, agentIdAssign: action.payload};
        case DATA_FOR_ASSIGN_LIVECHAT:
            return {...state, livechatAssign: action.payload};
        case DATA_FOR_ASSIGN_ROOM_ID:
            return {...state, roomIdAssign: action.payload};
        case DATA_FOR_ASSIGN_AGENT_INFO:
            return {...state, agentInfoAssign: action.payload};
        case DATA_RESET_ALL_FOR_ASSIGN:
            return {
                ...state, 
                roomIdAssign: 0,
                agentIdAssign: 0, 
                livechatAssign: null, 
                agentInfoAssign: null
            } 
        default:
            return state;
    }
};
