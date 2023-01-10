
export const IS_STATUS_LOGIN = 'IS_STATUS_LOGIN';
export const IS_LOADING_LOGIN = 'IS_LOADING_LOGIN';
export const RESULT_SCAN_BARCODE = 'RESULT_SCAN_BARCODE';
export const STATUS_MESSAGE_LOGIN = 'STATUS_MESSAGE_LOGIN';

export const onStatusLogin = (data) => ({
    type: IS_STATUS_LOGIN,
    payload: data
});

export const onLoadingLogin = (data) => ({
    type: IS_LOADING_LOGIN,
    payload: data
});

export const onStatusMessageLogin = (data) => ({
    type: STATUS_MESSAGE_LOGIN,
    payload: data
});

export const onResultScanBarcode = (data) => ({
    type: RESULT_SCAN_BARCODE,
    payload: data
});