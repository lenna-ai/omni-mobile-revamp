import {
    DATA_MEMBER_APP,
    PUSH_DATA_MEMBER_APP,
    ADD_LIST_DATA_MEMBER,
    PUSH_LIST_DATA_MEMBER,
} from './../../actions/member/inMember';

let dataState = {
    dataMemberApp: [],
    listDataMember: [],
};

export const mDataMember = (state = dataState, action) => {
    switch (action.type) {
        case DATA_MEMBER_APP:
            return {...state, dataMemberApp: action.payload};
        case PUSH_DATA_MEMBER_APP:
            return {...state, dataMemberApp: [...state.dataMemberApp, ...action.payload]};
        case ADD_LIST_DATA_MEMBER:
            return {...state, listDataMember: action.payload}
        case PUSH_LIST_DATA_MEMBER:
            return {...state, listDataMember: [...state.listDataMember, ...action.payload]}
        default:
            return state;
    }
};
