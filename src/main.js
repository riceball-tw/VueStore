import { createApp } from 'vue';
import './style.css';
import { vfmPlugin } from 'vue-final-modal';
import App from './App.vue';
import router from './plugins/router';

createApp(App).use(router).use(vfmPlugin).mount('#app');
