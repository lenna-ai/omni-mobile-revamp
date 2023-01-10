export const SESSION_ERROR = 'SESSION_ERROR';
export const DATA_USER_WAS_LOGIN = 'DATA_USER_WAS_LOGIN';
export const RESET_USER_WAS_LOGIN = 'RESET_USER_WAS_LOGIN';

export const addDataUserWasLogin = (data) => ({
    type: DATA_USER_WAS_LOGIN,
    payload: data
});

export const resetDataUserWasLogin = () => ({
    type: RESET_USER_WAS_LOGIN,
});

export const sessionError = (data) => ({
    type: SESSION_ERROR,
    payload: data
})