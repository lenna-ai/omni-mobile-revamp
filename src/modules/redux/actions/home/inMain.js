export const DATA_ROOM_REQUEST = 'DATA_ROOM_REQUEST';
export const LOAD_ROOM_REQUEST = 'LOAD_ROOM_REQUEST';

export const addDataRoomReq = (data) => ({
    type: DATA_ROOM_REQUEST,
    payload: data
});

export const loadDataRoomReq = (load) => ({
    type: LOAD_ROOM_REQUEST,
    payload: load
});