import {
    DATA_OFFICE_HOUR,
    LOAD_OFFICE_HOUR
} from './../../actions/home/inOfficeHour';

let dataState = { 
    loading: false,
    dataOfficeHour: []
};

export const mDataOfficeHour = (state = dataState, action) => {
    switch (action.type) {
        case DATA_OFFICE_HOUR:
            let dateNow = new Date();
            let dayNow = dateNow.getDay();
            if (dayNow == 0) {
                dayNow = 7
            }
            return {...state, dataOfficeHour: action.payload[dayNow-1].hour};
        case LOAD_OFFICE_HOUR:
            return {...state, loading: action.payload};
        default:
            return state;
    }
};
