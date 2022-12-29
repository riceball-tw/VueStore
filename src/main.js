import { createApp, h } from 'vue';
import './style.css';
import { vfmPlugin } from 'vue-final-modal';
import Toast from 'vue-toastification';
import { currency, toReadableDate, toUnixTimestamp } from '@/helper/unitFilter';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import LoaderIcon from '@/components/AppLoader.vue';

import App from './App.vue';
import router from './plugins/router';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.config.globalProperties.$unitFilters = {
  currency,
  toReadableDate,
  toUnixTimestamp,
};
app
  .use(router)
  // https://www.npmjs.com/package/vue-loading-overlay
  .use(LoadingPlugin, { backgroundColor: '#000' }, { default: h(LoaderIcon) })
  .use(vfmPlugin)
  .use(Toast)
  .mount('#app');
