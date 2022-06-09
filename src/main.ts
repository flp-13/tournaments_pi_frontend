import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import axios from 'axios'

import '@unocss/reset/tailwind.css'
import './styles/components.scss'
import './styles/main.css'
import 'uno.css'

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Accepts'] = 'application/json';

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.mount('#app')
