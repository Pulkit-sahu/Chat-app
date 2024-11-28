import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router'
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura'
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).use(pinia).use(ToastService).use(router).mount('#app')
