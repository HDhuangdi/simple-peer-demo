import axios from "axios";
const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  if (config.query) {
    let queryString = "?";
    for (const key in config.query) {
      const value = config.query[key];
      queryString += `${key}=${value}&`;
    }
    queryString = queryString.slice(0, -1);
    config.url += queryString;
  }

  return config;
});

instance.interceptors.response.use((res) => {
  return res;
});

export default instance;
