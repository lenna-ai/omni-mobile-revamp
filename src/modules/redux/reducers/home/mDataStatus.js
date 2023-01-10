import { 
    DATA_COUNT_ROOM,
    LOAD_COUNT_ROOM,
    LOAD_GET_CUSTOMER
} from './../../actions/home/inStatus';

let dataState = {
    loadingGetCustomer: false,
    loadingCountRoom: false,
    dataCountRoom: {},
};

export const mDataStatus = (state = dataState, action) => {
    switch (action.type) {
        case DATA_COUNT_ROOM:
            return {...state, dataCountRoom: action.payload};
        case LOAD_COUNT_ROOM:
            return {...state, loadingCountRoom: action.payload};
        case LOAD_GET_CUSTOMER:
            return {...state, loadingGetCustomer: action.payload};
        default:
            return state;
    }
};
