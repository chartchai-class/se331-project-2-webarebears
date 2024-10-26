// import './assets/main.css'
import './assets/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'nprogress/nprogress.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth';

const app = createApp(App)

app.use(createPinia())
app.use(router)

const authStore = useAuthStore();
authStore.checkAuthStatus();
app.mount('#app')
