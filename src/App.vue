<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import SplashScreen from './components/SplashScreen.vue'
import BottomNav from './components/BottomNav.vue'
import CustomModal from './components/CustomModal.vue'
import { useTheme } from './utils/theme'

const { isDarkMode } = useTheme()

const showSplash = ref(true)
const route = useRoute()
</script>

<template>
  <div class="app-root" :class="{ dark: isDarkMode }">
    <!-- Custom Modal Popup Global (dengan backdrop blur) -->
    <CustomModal />

    <!-- Splash Screen awal -->
    <SplashScreen v-if="showSplash" @finish="showSplash = false" />

    <!-- Tampilan Utama Aplikasi -->
    <template v-else>
      <router-view />
      
      <!-- BottomNav hanya tampil di halaman yang memerlukan Login -->
      <BottomNav v-if="route.meta.requiresAuth" />
    </template>
  </div>
</template>

<style>
.app-root {
  min-height: 100vh;
  width: 100%;
  background-color: #F4F7F9;
  color: #1E293B;
  box-sizing: border-box;
}

.app-root.dark {
  background-color: #000000 !important;
  background: #000000 !important;
  color: #ffffff !important;
}
</style>
