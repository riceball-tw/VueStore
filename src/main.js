import { createApp, h } from 'vue';

import './style.css';
import 'vue-toastification/dist/index.css';
<<<<<<< HEAD
=======

import axios from 'axios';
>>>>>>> 026d735821dd2844b10b4d7336b6d71c7d282f41
import VueAxios from 'vue-axios';
import { vfmPlugin } from 'vue-final-modal';
import { currency, toReadableDate, toUnixTimestamp } from '@/helper/unitFilter';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import Toast from 'vue-toastification';
import LoaderIcon from '@/components/AppLoader.vue';
<<<<<<< HEAD

import axiosConfig from '@/plugins/axiosConfig';
=======
import getAuthToken from '@/helper/getAuthToken';
>>>>>>> 026d735821dd2844b10b4d7336b6d71c7d282f41
import router from './plugins/router';
import App from './App.vue';

const app = createApp(App);
app.config.globalProperties.$unitFilters = {
  currency,
  toReadableDate,
  toUnixTimestamp,
};

<<<<<<< HEAD
=======
const axiosWithAuth = axios.create({
  headers: { Authorization: getAuthToken() },
});

>>>>>>> 026d735821dd2844b10b4d7336b6d71c7d282f41
app
  // https://www.npmjs.com/package/vue-loading-overlay
  .use(LoadingPlugin, { backgroundColor: '#000' }, { default: h(LoaderIcon) })
  .use(vfmPlugin)
<<<<<<< HEAD
  .use(VueAxios, axiosConfig)
  .provide('axios', app.config.globalProperties.axios)
  .provide('axiosWithAuth', app.config.globalProperties.axiosWithAuth)
=======
  .use(VueAxios, { axios, axiosWithAuth })
  .provide('axios', app.config.globalProperties.axios)
>>>>>>> 026d735821dd2844b10b4d7336b6d71c7d282f41
  .use(Toast, { position: 'top-center', icon: true })
  .use(router(app))
  .mount('#app');
