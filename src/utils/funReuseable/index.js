export const funIsSeletedChannel = (dtChannelSeleted) => {
    let dataArray = [];
    let data = [...dtChannelSeleted];
    if (data.length != undefined || data.length > 0) {
        data.map((dt) => {
            if (dt[0] != 'all') {
                if (dt[1] == true) {
                    dataArray.push(dt[0]);
                }
            }
        });
    }
    return dataArray;
}

export const funIsSeletedStatus = (dtConversationSeleted, role) => {
    let dataNum = 0;
    let dataParams = '';
    let data = [...dtConversationSeleted];

    if (data.length != undefined || data.length > 0) {
        data.map((dt) => {
            if (dt[1] == true) {
                dataNum = dt[0];
            }
        });

        if (role != 'Staff') {
            switch (dataNum) {
                case 4:
                    dataParams = 'request'
                    break;
                case 3:
                    dataParams = 'live'
                    break;
                case 2:
                    dataParams = 'resolved'
                    break;
                default:
                    dataParams = 'all';
                    break;
            }
        } else {
            switch (dataNum) {
                case 2:
                    dataParams = 'resolved'
                    break;
                default:
                    dataParams = 'live';
                    break;
            }
        }
    }
    return dataParams;
} 

export const funGetIndex = (value, arr) => {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] === value) {
            return i;
        }
    }
    return -1;
}

export const funReduceFind = (data) => {
    let arrayData = data.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
    }, []);
    return arrayData;
}