
export const DATA_COUNT_ROOM = 'DATA_COUNT_ROOM';
export const LOAD_COUNT_ROOM = 'LOAD_COUNT_ROOM';
export const LOAD_GET_CUSTOMER = 'LOAD_GET_CUSTOMER';

export const addDataCountRoom = (data) => ({
    type: DATA_COUNT_ROOM,
    payload: data
});

export const loadDataCountRoom = (data) => ({
    type: LOAD_COUNT_ROOM,
    payload: data
});

export const loadDataGetCustomer = (data) => ({
    type: LOAD_GET_CUSTOMER,
    payload: data
});