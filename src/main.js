import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router' 
import './style.css' // <--- Sekarang langsung mengarah ke src/style.css
import App from './App.vue'

const app = createApp(App)

// --- PWA REGISTER ENGINE ---
import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

app.use(createPinia())
app.use(router)
app.mount('#app')