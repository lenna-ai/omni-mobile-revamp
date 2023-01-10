export const DATA_MEMBER_APP = 'DATA_MEMBER_APP';
export const PUSH_DATA_MEMBER_APP = 'PUSH_DATA_MEMBER_APP';
export const ADD_LIST_DATA_MEMBER = 'ADD_LIST_DATA_MEMBER';
export const PUSH_LIST_DATA_MEMBER = 'PUSH_LIST_DATA_MEMBER';

export const addDataMemberApp = (data) => ({
    type: DATA_MEMBER_APP,
    payload: data
});

export const pushDataMemberApp = (data) => ({
    type: PUSH_DATA_MEMBER_APP,
    payload: data
});

export const addListDataMember = (data) => ({
    type: ADD_LIST_DATA_MEMBER,
    payload: data
});

export const pushListDataMember = (data) => ({
    type: PUSH_LIST_DATA_MEMBER,
    payload: data
});
