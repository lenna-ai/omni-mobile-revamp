export const DATA_ROOM_REQ = 'DATA_ROOM_REQ';
export const DATA_USER_LOGIN = 'DATA_USER_LOGIN';

export const addDataRoomReq = (data) => ({
    type: DATA_ROOM_REQ,
    payload: data
});

export const addDataUserLogin = (data) => ({
    type: DATA_USER_LOGIN,
    payload: data
});
