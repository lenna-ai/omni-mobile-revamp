export const DATA_OFFICE_HOUR = 'DATA_OFFICE_HOUR';
export const LOAD_OFFICE_HOUR = 'LOAD_OFFICE_HOUR';

export const addDataOfficeHour = (data) => ({
    type: DATA_OFFICE_HOUR,
    payload: data
});

export const loadDataOfficeHour = (load) => ({
    type: LOAD_OFFICE_HOUR,
    payload: load
});