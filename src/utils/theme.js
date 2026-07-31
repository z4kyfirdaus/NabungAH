import { ref, watch } from 'vue'

// Ambil status dari localStorage, default-nya false (Light Mode)
const isDarkMode = ref(localStorage.getItem('nabungah_dark') === 'true')

// Fungsi untuk Menerapkan Kelas Dark ke Body HTML & Meta Theme Color
function applyTheme(dark) {
  if (dark) {
    document.documentElement.classList.add('dark-mode')
    document.body.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
    document.body.classList.remove('dark-mode')
  }

  // Tangani meta theme-color untuk frame / status bar browser & mobile
  let metaTheme = document.querySelector('meta[name="theme-color"]')
  if (!metaTheme) {
    metaTheme = document.createElement('meta')
    metaTheme.name = 'theme-color'
    document.head.appendChild(metaTheme)
  }
  metaTheme.content = dark ? '#000000' : '#ffffff'
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