export const IS_LOGIN = 'IS_LOGIN';
export const IS_ONBOARD = 'IS_ONBOARD';
export const IS_ONACTIVE_NAV = 'IS_ONACTIVE_NAV';
export const IS_CHOOSE_ACTIVE = 'IS_CHOOSE_ACTIVE';
export const IS_CHOOSE_CHANNEL = 'IS_CHOOSE_CHANNEL';

export const onLogin = (data) => ({
    type: IS_LOGIN,
    payload: data
});

export const onOnBoard = (data) => ({
    type: IS_ONBOARD,
    payload: data
});

export const onActiveNav = (data) => ({
    type: IS_ONACTIVE_NAV,
    payload: data
});

export const onChooseActive = (data) => ({
    type: IS_CHOOSE_ACTIVE,
    payload: data
});

export const onChooseChannel = (data) => ({
    type: IS_CHOOSE_CHANNEL,
    payload: data
});