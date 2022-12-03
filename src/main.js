import { createApp } from 'vue';
import './style.css';
import { vfmPlugin } from 'vue-final-modal';
import Toast from 'vue-toastification';
import App from './App.vue';
import router from './plugins/router';
import 'vue-toastification/dist/index.css';

createApp(App).use(router).use(vfmPlugin).use(Toast).mount('#app');
