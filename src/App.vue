<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import SplashScreen from './components/SplashScreen.vue'
import BottomNav from './components/BottomNav.vue'
import CustomModal from './components/CustomModal.vue'
import { useTheme } from './utils/theme'

// Inisialisasi tema awal
useTheme()

const showSplash = ref(true)
const route = useRoute()
</script>

<template>
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
</template>
