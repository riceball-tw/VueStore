import { createApp, h } from 'vue';

import './style.css';
import 'vue-toastification/dist/index.css';
import VueAxios from 'vue-axios';
import { vfmPlugin } from 'vue-final-modal';
import { currency, toReadableDate, toUnixTimestamp } from '@/helper/unitFilter';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import Toast from 'vue-toastification';
import LoaderIcon from '@/components/AppLoader.vue';

import axiosConfig from '@/plugins/axiosConfig';
import router from './plugins/router';
import App from './App.vue';

const app = createApp(App);
app.config.globalProperties.$unitFilters = {
  currency,
  toReadableDate,
  toUnixTimestamp,
};

app
  // https://www.npmjs.com/package/vue-loading-overlay
  .use(LoadingPlugin, { backgroundColor: '#000' }, { default: h(LoaderIcon) })
  .use(vfmPlugin)
  .use(VueAxios, axiosConfig)
  .provide('axios', app.config.globalProperties.axios)
  .provide('axiosWithAuth', app.config.globalProperties.axiosWithAuth)
  .use(Toast, { position: 'top-center', icon: true })
  .use(router(app))
  .mount('#app');
