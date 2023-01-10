export const DATA_FOR_ASSIGN_ROOM_ID = 'DATA_FOR_ASSIGN_ROOM_ID';
export const DATA_FOR_ASSIGN_AGENT_ID = 'DATA_FOR_ASSIGN_AGENT_ID';
export const DATA_FOR_ASSIGN_LIVECHAT = 'DATA_FOR_ASSIGN_LIVECHAT';
export const DATA_RESET_ALL_FOR_ASSIGN = 'DATA_RESET_ALL_FOR_ASSIGN';
export const DATA_FOR_ASSIGN_AGENT_INFO = 'DATA_FOR_ASSIGN_AGENT_INFO';

export const addDataForAssignAgentID = (data) => ({
    type: DATA_FOR_ASSIGN_AGENT_ID,
    payload: data
});

export const addDataForAssignAgentInfo = (data) => ({
    type: DATA_FOR_ASSIGN_AGENT_INFO,
    payload: data
});

export const resetAllDataForAssign = () => ({
    type: DATA_RESET_ALL_FOR_ASSIGN,
})

export const addDataForAssignLivechat = (data) => ({
    type: DATA_FOR_ASSIGN_LIVECHAT,
    payload: data
});

export const addDataForAssignRoomId = (data) => ({
    type: DATA_FOR_ASSIGN_ROOM_ID,
    payload: data
});
