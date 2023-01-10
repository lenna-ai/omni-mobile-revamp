// Import from Third Party
import axios from "axios";

// Import from Internal
import API from "./../../utils/api";
import store from "../redux/store";
import { catchErrorResponse } from "./onCatchApi";
import { sessionError } from "../redux/actions/inDataUserLogin";

let instance = axios.create({
  baseURL: API.BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "X-Mobile-Omni": true
  }
});

instance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status == 401) {
      store.dispatch(sessionError(true));
    }
    return Promise.reject(error);
  }
);

export const getData = (url, headers) => {
  instance.defaults.headers.common["token"] = headers.token;
  instance.defaults.headers.common["userId"] = headers.userId;
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.get(url);
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const getDataWithBody = (url, dataBody, headers) => {
  instance.defaults.headers.common["token"] = headers.token;
  instance.defaults.headers.common["userId"] = headers.userId;
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.get(url, dataBody);
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const getDataWithParams = (url, params, headers) => {
  instance.defaults.headers.common["token"] = headers.token;
  instance.defaults.headers.common["userId"] = headers.userId;
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.get(url, { params: params });
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const getDataWithParamsReset = (url, headers) => {
  instance.defaults.headers.common["token"] = headers.token;
  instance.defaults.headers.common["userId"] = headers.userId;
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.get(url);
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const postDataForFormData = (url, data, token, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
          userId: userId
        }
      });
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const postDataWithoutToken = (url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.post(url, data);
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const postData = (url, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.post(url, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const postDataOutHeader = (url, data, headers) => {
  instance.defaults.headers.common["token"] = headers.token;
  instance.defaults.headers.common["userId"] = headers.userId;
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.post(url, data);
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const postDataLogin = (url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.post(url, data);
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};

export const putData = (url, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await instance.put(url, data);
      resolve(result.data);
    } catch (error) {
      if (error.response) {
        console.log("error_res", error.response);

        reject(catchErrorResponse(false, "ERR_RES", [error.response.data]));
      } else if (error.request) {
        console.log("error_req", error.request);
        reject(catchErrorResponse(false, "ERR_REQ", [error.request]));
      } else {
        console.log("error", error);
        reject(catchErrorResponse(false, "ERR_MSG", [error.message]));
      }
    }
  });
};
