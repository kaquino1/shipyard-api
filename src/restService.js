import axios from 'axios';

const updateEndTime = response => {
  response.meta = response.meta || {};
  response.meta.time = new Date().getTime() - response.config.meta.startTime;
  return response;
};

axios.interceptors.request.use(request => {
  console.log(request);
  request.meta = request.meta || {};
  request.meta.startTime = new Date().getTime();
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
