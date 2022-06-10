import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import axios from 'axios'
import { Skeletor } from 'vue-skeletor'
import Toast from 'vue-toastification'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'vue-skeletor/dist/vue-skeletor.css'
import 'vue-toastification/dist/index.css'
import './styles/components.scss'
import './styles/loader.scss'
import './styles/main.css'

const pinia = createPinia();

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common.Accepts = 'application/json';
if (localStorage.getItem('token'))
  axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;

const app = createApp(App)
app.component('Skeletor', Skeletor);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(Toast);
app.use(pinia);
app.use(router);
app.mount('#app')
