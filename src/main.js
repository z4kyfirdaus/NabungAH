import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Penangkap error global untuk mendeteksi penyebab blank putih di HP
app.config.errorHandler = (err, instance, info) => {
  console.error('Global Error:', err);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace; word-break: break-all;">
      <h3>Terjadi Error Aplikasi:</h3>
      <p>${err.toString()}</p>
      <pre>${err.stack}</pre>
    </div>
  `;
};

app.use(router)
app.mount('#app')