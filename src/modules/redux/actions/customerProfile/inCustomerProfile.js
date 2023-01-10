export const CHANGE_ID_CUSTOMPROF = 'CHANGE_ID_CUSTOMPROF';
export const CLEAR_ALL_CUSTOMPROF = 'CLEAR_ALL_CUSTOMPROF';
export const CHANGE_TAGS_CUSTOMPROF = 'CHANGE_TAGS_CUSTOMPROF';
export const CHANGE_EMAIL_CUSTOMPROF = 'CHANGE_EMAIL_CUSTOMPROF';
export const CHANGE_PHONE_CUSTOMPROF = 'CHANGE_PHONE_CUSTOMPROF';
export const CHANGE_ADDITINFO_CUSTOMPROF = 'CHANGE_ADDITINFO_CUSTOMPROF';
export const CHANGE_CONVERNOTED_CUSTOMPROF = 'CHANGE_CONVERNOTED_CUSTOMPROF';
export const CHANGE_ID_CONVERNOTED_CUSTOMPROF = 'CHANGE_ID_CONVERNOTED_CUSTOMPROF';

export const changeIdCustomprof = (data) => ({
    type: CHANGE_ID_CUSTOMPROF,
    payload: data
});

export const changeEmailCustomprof = (data) => ({
    type: CHANGE_EMAIL_CUSTOMPROF,
    payload: data
});

export const changePhoneCustomprof = (data) => ({
    type: CHANGE_PHONE_CUSTOMPROF,
    payload: data
});

export const changeAdditinfoCustomprof = (data) => ({
    type: CHANGE_ADDITINFO_CUSTOMPROF,
    payload: data
});

export const changeConvernotedCustomprof = (data) => ({
    type: CHANGE_CONVERNOTED_CUSTOMPROF,
    payload: data
});

export const changeIdConvernotedCustomprof = (data) => ({
    type: CHANGE_ID_CONVERNOTED_CUSTOMPROF,
    payload: data
});

export const changeTagsCustomprof = (data) => ({
    type: CHANGE_TAGS_CUSTOMPROF,
    payload: data
});

export const clearAllCustomprof = (data) => ({
    type: CLEAR_ALL_CUSTOMPROF
});