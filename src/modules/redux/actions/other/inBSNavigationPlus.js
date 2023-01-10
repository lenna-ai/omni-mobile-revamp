export const DATA_IS_OPEN = 'DATA_IS_OPEN';
export const DATA_IS_ONLINE = 'DATA_IS_ONLINE';

export const changeIsOpen = (data) => ({
    type: DATA_IS_OPEN,
    payload: data
});

export const changeIsOnline = (data) => ({
    type: DATA_IS_ONLINE,
    payload: data
});