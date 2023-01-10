export const LOAD_PROFILE_WAS_LOGIN = 'LOAD_PROFILE_WAS_LOGIN';
export const CHANGE_PROFILE_WAS_LOGIN = 'CHANGE_PROFILE_WAS_LOGIN';

export const loadProfileWasLogin = (data) => ({
    type: LOAD_PROFILE_WAS_LOGIN,
    payload: data
});

export const  changeProfileWasLogin= (data) => ({
    type: CHANGE_PROFILE_WAS_LOGIN,
    payload: data
});