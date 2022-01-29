import axios from 'axios';

const updateEndTime = response => {
  response.customData = response.customData || {};
  response.customData.time = new Date().getTime() - response.config.customData.startTime;
  return response;
};

axios.interceptors.request.use(request => {
  request.customData = request.customData || {};
  request.customData.startTime = new Date().getTime();
  return request;
});

axios.interceptors.response.use(updateEndTime, e => {
  return Promise.reject(updateEndTime(e.response));
});

const restService = async params => {
  try {
    const response = await axios(params);
    return response;
  } catch (err) {
    return err;
  }
};

export default restService;
