import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {initDB} from './database/sqlite'

async function startApp() {
await initDB()
createApp(App)
.use(router)
.mount('#app')
}

startApp()
