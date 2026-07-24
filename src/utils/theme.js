import { ref, watch } from 'vue'

// Ambil status dari localStorage, default-nya false (Light Mode)
const isDarkMode = ref(localStorage.getItem('nabungah_dark') === 'true')

// Fungsi untuk Menerapkan Kelas Dark ke Body HTML
function applyTheme(dark) {
  if (dark) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

// Terapkan saat pertama kali aplikasi dimuat
applyTheme(isDarkMode.value)

// Pantau setiap ada perubahan
watch(isDarkMode, (val) => {
  localStorage.setItem('nabungah_dark', val)
  applyTheme(val)
})

export function useTheme() {
  return {
    isDarkMode
  }
}