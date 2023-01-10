import { 
    DATA_IS_OPEN,
    DATA_IS_ONLINE
} from './../../actions/other/inBSNavigationPlus';

let dataState = { 
    isOpen: false,
    statusIsOnline: false
};

export const mDataBSNavigationPlus = (state = dataState, action) => {
    switch (action.type) {
        case DATA_IS_OPEN:
            return {...state, isOpen: action.payload};
        case DATA_IS_ONLINE:
            return {...state, statusIsOnline: action.payload};
        default:
            return state;
    }
};
  
