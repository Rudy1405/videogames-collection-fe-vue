import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import router from './router';
import store from './store';
import api from './services/api';

const app = createApp(App);

app.config.globalProperties.$axios = api;

app.use(router).use(store).mount('#app');
