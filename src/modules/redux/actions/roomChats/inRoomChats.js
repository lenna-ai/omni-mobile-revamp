export const DATA_ROOMS_CHAT = 'DATA_ROOMS_CHAT';
export const DATA_MORE_ROOMS_CHAT = 'DATA_MORE_ROOMS_CHAT';
export const DATA_PUSH_ROOMS_CHAT = 'DATA_PUSH_ROOMS_CHAT';
export const DATA_UPDATE_ROOMS_CHAT = 'DATA_UPDATE_ROOMS_CHAT';
export const DATA_RELOAD_ROOMS_CHAT = 'DATA_RELOAD_ROOMS_CHAT';
export const DATA_TEXT_SEARCH_ROOMS_CHAT = 'DATA_TEXT_SEARCH_ROOMS_CHAT';

export const addRoomsChat = (data) => ({
    type: DATA_ROOMS_CHAT,
    payload: data
});

export const moreRoomsChat = (data) => ({
    type: DATA_MORE_ROOMS_CHAT,
    payload: data
});

export const pushRoomsChat = (data) => ({
    type: DATA_PUSH_ROOMS_CHAT,
    payload: data,
});

export const updateRoomsChat = (data) => ({
    type: DATA_UPDATE_ROOMS_CHAT,
    payload: data,
});

export const reloadRoomsChat = (data) => ({
    type: DATA_RELOAD_ROOMS_CHAT,
    payload: data,
});

export const setTextSearchRoomsChat = (data) => ({
    type: DATA_TEXT_SEARCH_ROOMS_CHAT,
    payload: data,
});
