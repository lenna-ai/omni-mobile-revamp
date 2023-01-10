export const catchErrorResponse = (error, message, dataError) => {
    let responseError = {
        error: error,
        message: message,
        data: dataError
    };
    return responseError;
}