<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['finish'])

onMounted(() => {
  // Durasi splash screen muncul (2 detik / 2000 milidetik)
  setTimeout(() => {
    emit('finish')
  }, 2000)
})
</script>

<template>
  <div class="splash-screen">
    <div class="splash-content">
      <div class="logo-container">
        <img src="/logo.jpg" alt="Logo NabungAh" class="splash-logo" />
      </div>
      <h1 class="splash-title">Nabung<span>Ah</span></h1>
      <p class="splash-subtitle">Kelola Keuangan & Tabungan Lebih Mudah</p>
      
      <!-- Indikator Loading / Spinner -->
      <div class="loader-bar">
        <div class="loader-progress"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  background: #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.4s ease-out;
}

.splash-content {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  width: 90px;
  height: 90px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
  margin-bottom: 20px;
  animation: bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.splash-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.splash-title {
  font-size: 32px;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.splash-title span {
  color: #007AFF;
}

.splash-subtitle {
  font-size: 14px;
  color: #8E8E93;
  margin-bottom: 30px;
  font-weight: 600;
}

.loader-bar {
  width: 120px;
  height: 4px;
  background: #2C2C2E;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.loader-progress {
  width: 100%;
  height: 100%;
  background: #007AFF;
  border-radius: 4px;
  position: absolute;
  left: -100%;
  animation: loadingMove 1.5s infinite ease-in-out;
}

@keyframes loadingMove {
  0% { left: -100%; }
  50% { left: 0%; }
  100% { left: 100%; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
</style>