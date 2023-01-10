import {
    CHANGE_ID_CUSTOMPROF,
    CLEAR_ALL_CUSTOMPROF,
    CHANGE_TAGS_CUSTOMPROF,
    CHANGE_EMAIL_CUSTOMPROF,
    CHANGE_PHONE_CUSTOMPROF,
    CHANGE_ADDITINFO_CUSTOMPROF,
    CHANGE_CONVERNOTED_CUSTOMPROF,
    CHANGE_ID_CONVERNOTED_CUSTOMPROF
} from './../../actions/customerProfile/inCustomerProfile';

let dataState = { 
    id: 0,
    tagsCustomprof: [],
    emailCustomprof: '',
    phoneCustomprof: '',
    additinfoCustomprof: [],
    convernotedCustomprof: '',
    idConvernotedCustomprof: 0
};

export const mCustomerProfile = (state = dataState, action) => {
    switch (action.type) {
        case CHANGE_ID_CONVERNOTED_CUSTOMPROF:
            return {...state, idConvernotedCustomprof: action.payload};
        case CHANGE_ID_CUSTOMPROF:
            return {...state, id: action.payload};
        case CLEAR_ALL_CUSTOMPROF:
            return {
                ...state, 
                id: 0,
                tagsCustomprof: [],
                emailCustomprof: '',
                phoneCustomprof: '',
                additinfoCustomprof: [],
                convernotedCustomprof: '',
                idConvernotedCustomprof: 0
            };
        case CHANGE_TAGS_CUSTOMPROF:
            return {...state, tagsCustomprof: action.payload};
        case CHANGE_EMAIL_CUSTOMPROF:
            return {...state, emailCustomprof: action.payload};
        case CHANGE_PHONE_CUSTOMPROF:
            return {...state, phoneCustomprof: action.payload};
        case CHANGE_ADDITINFO_CUSTOMPROF:
            return {...state, additinfoCustomprof: action.payload};
        case CHANGE_CONVERNOTED_CUSTOMPROF:
            return {...state, convernotedCustomprof: action.payload};
        default:
            return state;
    }
};
