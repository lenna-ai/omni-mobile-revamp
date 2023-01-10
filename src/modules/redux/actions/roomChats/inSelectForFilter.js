export const SET_RESET_FILTER = 'SET_RESET_FILTER';
export const SET_CHANNEL_FILTER = 'SET_CHANNEL_FILTER';
export const SET_CONVERSATION_FILTER = 'SET_CONVERSATION_FILTER';


export const setResetFilter = () => ({
    type: SET_RESET_FILTER
});

export const setChannelFilter = (data) => ({
    type: SET_CHANNEL_FILTER,
    payload: data
});

export const setConversationFilter = (data) => ({
    type: SET_CONVERSATION_FILTER,
    payload: data
});
