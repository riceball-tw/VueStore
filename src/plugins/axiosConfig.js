import { useToast } from 'vue-toastification';
import axios from 'axios';
import getAuthToken from '@/helper/getAuthToken';

const axiosWithAuth = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API}/api/${import.meta.env.VITE_APP_PATH}/`,
  headers: {
    Authorization: getAuthToken(),
  },
});

axiosWithAuth.interceptors.response.use(
  (res) => {
    if (!res.data.success) {
      useToast().error(`${res.data.message}`);
      return res;
    }
    if (res.data.message) useToast().success(`${res.data.message}`);
    return res;
  },
  (err) => {
    useToast().error(`${err.message}`);
    Promise.reject(err);
  },
);

export default {
  axios,
  axiosWithAuth,
};
