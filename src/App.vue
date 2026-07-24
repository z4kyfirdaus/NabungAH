<script setup>
import { ref } from 'vue'
import SplashScreen from './components/SplashScreen.vue'
import BottomNav from './components/BottomNav.vue'

// State untuk menampilkan splash screen hanya saat pertama kali buka app
const showSplash = ref(true)
</script>

<template>
  <!-- Tampilkan Splash Screen jika showSplash bernilai true -->
  <SplashScreen v-if="showSplash" @finish="showSplash = false" />

  <!-- Tampilan Utama Aplikasi -->
  <template v-else>
    <router-view />
    <BottomNav />
  </template>
</template>