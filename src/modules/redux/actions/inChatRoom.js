export const DATA_CHAT_ROOMS = 'DATA_CHAT_ROOMS';
export const DATA_PUSH_CHAT_ROOMS = 'DATA_PUSH_CHAT_ROOMS';
export const DATA_CHATS_ROOMS_RELOAD = 'DATA_CHATS_ROOMS_RELOAD';

export const addDataRooms = (data) => ({
    type: DATA_CHAT_ROOMS,
    payload: data
});

export const pushDataRooms = (data) => ({
    type: DATA_PUSH_CHAT_ROOMS,
    payload: data
});

export const reloadDataRooms = () => ({
    type: DATA_CHATS_ROOMS_RELOAD
});
