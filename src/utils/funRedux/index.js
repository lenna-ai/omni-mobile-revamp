import { funGetIndex, funReduceFind } from "./../funReuseable";

export const funResolveMsgRoom = (
  dataUser,
  dataRed,
  dataFromSocket,
  textSearchSubmit,
  dtChannelSeleted,
  dtConversationSeleted
) => {
  console.log("funResolveMsgRoom", dataFromSocket);
  let data = [...dataRed];
  let index = 0;
  let dataIndex = undefined;
  data.find((entry, i) => {
    if (entry.id == dataFromSocket.livechat.room_id) {
      index = i;
      dataIndex = entry;
    }
  });
  if (dataIndex != undefined) {
    if (dtConversationSeleted == "live") {
      data = dataRed.filter(function(entry) {
        return entry.id !== dataFromSocket.livechat.room_id;
      });
    } else {
      dataIndex.livechat = dataFromSocket.livechat;
      data[index] = dataIndex;
    }
  }
  return data;
};

export const funHandleNewMsgRoom = (dataFromSocket, dataRed) => {
  console.log("funHandleNewMsgRoom", dataFromSocket);
  let index = 0;
  let data = [...dataRed];
  let dataIndex = undefined;
  data.find((entry, i) => {
    if (entry.id == dataFromSocket.room.id) {
      index = i;
      dataIndex = entry;
    }
  });
  if (dataIndex != undefined) {
    dataIndex.livechat = dataFromSocket.room.livechat;
    data[index] = dataIndex;
  }
  return data;
};

export const funAssignNewMsgRoom = (
  dataUser,
  dataRed,
  dataFromSocket,
  textSearchSubmit,
  dtChannelSeleted,
  dtConversationSeleted
) => {
  console.log("funAssignNewMsgRoom", dataFromSocket);
  let data = [...dataRed];
  let dataRoom = dataFromSocket.room;
  let index = 0;
  let dataIndex = undefined;
  data.find((entry, i) => {
    if (entry.id == dataRoom.id) {
      index = i;
      dataIndex = entry;
    }
  });
  if (dataIndex != undefined) {
    if (dtConversationSeleted == "live") {
      data = dataRed.filter(function(entry) {
        return entry.id !== dataFromSocket.room.id;
      });
    } else {
      dataIndex.livechat = dataFromSocket.room.livechat;
      data[index] = dataIndex;
    }
  } else {
    dataRoom.unread_count = 0;
    if (dtConversationSeleted == "live" && textSearchSubmit == "") {
      data = funReduceFind([...[dataRoom], ...dataRed]);
    }
  }
  return data;
};

export const funUpdateNewMsgChat = (dataRed, roomId, dataFromSocket) => {
  console.log("funUpdateStatusRoom", dataFromSocket.message);
  let data = [...dataRed];
  let dataChats = dataFromSocket.message;
  let arrChats = [dataFromSocket.message];
  let isHave = undefined;
  isHave = dataRed.filter(function(entry) {
    return entry.id !== 0;
  });

  if (isHave != undefined) {
    if (roomId == dataChats.room_id) {
      data = [...arrChats, ...isHave];
    }
  }

  // if (roomId == dataChats.room_id) {
  //     data = [...arrChats, ...isHave].reduce((acc, current) => {
  //         const x = acc.find(item => item.id === current.id);
  //         if (!x) {
  //             return acc.concat([current]);
  //         } else {
  //             return acc;
  //         }
  //     }, []);
  // }
  return data;
};

export const funRequestHandel = (
  dataUser,
  dataRed,
  dataFromSocket,
  textSearchSubmit,
  dtChannelSeleted,
  dtConversationSeleted
) => {
  console.log("funUpdateNewMsgRoom", dataFromSocket);
  let data = [...dataRed];
  let dataRoom = dataFromSocket.room;

  // if (dataUser.role.name != 'Staff') {
  //     let index = 0
  //     let dataIndex = undefined;
  //     data.find((entry, i) => {
  //         if (entry.id == dataRoom.id) {
  //             index = i;
  //             dataIndex = entry;
  //         }
  //     });

  //     if (dataIndex != undefined) {
  //         dataIndex.livechat = dataFromSocket.room.livechat;
  //         data[index] = dataIndex;
  //     } else {

  //     }

  // }

  if (textSearchSubmit == "" && dtConversationSeleted == "live") {
    if (dataUser.role.name == "Staff") {
      dataRoom.unread_count = 0;
    } else {
      // let indexRoom = 0
      // let dataIndexRomm = undefined;
      // data.find((entry, i) => {
      //     if (entry.id == dataRoom.id) {
      //         index = i;
      //         dataIndexRoom = entry;
      //     }
      // });
      // if (dataIndexRomm != undefined) {
      //     dataIndex.livechat = dataFromSocket.room.livechat;
      //     data[indexRoom] = dataIndex;
      // }
    }
    let isSeleted = dtChannelSeleted.indexOf(dataRoom.created_by.client);
    if (
      (dtChannelSeleted.length == 0 || dtChannelSeleted.length == 6) &&
      isSeleted == -1
    ) {
      data = funReduceFind([...[dataRoom], ...dataRed]);
    } else if (isSeleted != -1) {
      data = funReduceFind([...[dataRoom], ...dataRed]);
    }
  } else {
    let index = 0;
    let dataIndex = undefined;
    data.find((entry, i) => {
      if (entry.id == dataRoom.id) {
        index = i;
        dataIndex = entry;
      }
    });

    if (dataIndex != undefined) {
      dataIndex.livechat = dataFromSocket.room.livechat;
      data[index] = dataIndex;
    }
  }

  // if (dataUser.role.name != 'Staff' || dataUser.user_id == dataFromSocket.room.livechat.handle_by) {
  //     if (textSearchSubmit == '' && (dtConversationSeleted == 'all' || dtConversationSeleted == 'live')) {
  //         let isSeleted = dtChannelSeleted.indexOf(dataRoom.created_by.client);
  //         if ((dtChannelSeleted.length == 0 || dtChannelSeleted.length == 6) && isSeleted == -1) {
  //             data = funReduceFind([...[dataRoom], ...dataRed]);
  //         } else if (isSeleted != -1) {
  //             data = funReduceFind([...[dataRoom], ...dataRed]);
  //         }
  //     }
  // }
  return data;
};

export const funUpdateNewMsgRoom = (
  dataUser,
  dataRed,
  dataFromSocket,
  textSearchSubmit,
  containNavActive,
  dtChannelSeleted,
  dtConversationSeleted
) => {
  console.log("funUpdateNewMsgRoom", dataFromSocket);
  let data = [...dataRed];
  let dataRoom = dataFromSocket.room;
  let dataIndex = undefined;
  let index = 0;
  data.find((entry, i) => {
    if (entry.id == dataRoom.id) {
      dataIndex = entry;
      index = i;
    }
  });
  if (dataIndex != undefined) {
    dataIndex.unread_count =
      containNavActive != "" && containNavActive == "chats"
        ? dataIndex.unread_count
        : dataIndex.unread_count + dataRoom.messages.length;
    dataIndex.messages = dataRoom.messages;
    dataIndex.livechat = dataRoom.livechat;
    let dataVar = [...dataRed];
    dataVar[index] = dataIndex;
    if (index != 0) {
      data = moveArrayItemToNewIndex(dataVar, index, 0);
    } else {
      data = dataVar;
    }
  } else {
    dataRoom.unread_count = dataRoom.messages.length;
    if (
      dataUser.role.name != "Staff" &&
      textSearchSubmit == "" &&
      dtConversationSeleted == "all"
    ) {
      let isSeleted = dtChannelSeleted.indexOf(dataRoom.created_by.client);
      if (
        (dtChannelSeleted.length == 0 || dtChannelSeleted.length == 6) &&
        isSeleted == -1
      ) {
        data = funReduceFind([...[dataRoom], ...dataRed]);
      } else if (isSeleted != -1) {
        data = funReduceFind([...[dataRoom], ...dataRed]);
      }
    }
  }
  return data;
};

function moveArrayItemToNewIndex(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}
