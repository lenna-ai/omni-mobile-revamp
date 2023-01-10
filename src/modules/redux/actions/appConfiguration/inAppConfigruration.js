export const CHANGE_APP_CONFIGURATION = 'CHANGE_APP_CONFIGURATION';

export const changeAppConfiguration = (data) => ({
    type: CHANGE_APP_CONFIGURATION,
    payload: data
});