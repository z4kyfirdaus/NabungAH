<script setup>
import { ref, watch } from 'vue'
import { getData, saveData } from '../data/storage'
import { useTheme } from '../utils/theme'

const data = getData()
const { isDarkMode } = useTheme()

const nama = ref(data.profile.nama)
const foto = ref(data.profile.foto)
const showAbout = ref(false)
const isNotifActive = ref(true)

function pilihFoto(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    foto.value = reader.result
  }
  reader.readAsDataURL(file)
}

function simpanProfil() {
  data.profile.nama = nama.value
  data.profile.foto = foto.value
  saveData(data)
  alert('Profil berhasil disimpan')
}

function resetData() {
  if (confirm('Peringatan: Seluruh data tabungan dan riwayat akan terhapus. Lanjutkan?')) {
    localStorage.clear()
    location.reload()
  }
}
</script>

<template>
  <div class="setting-page">
    <div class="content-wrapper">
      
      <div class="header">
        <div class="header-title-wrapper">
          <div class="header-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <h1>Pengaturan</h1>
        </div>
      </div>

      <!-- KARTU PROFIL -->
      <div class="card profile-card">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img v-if="foto" :src="foto" class="avatar-image">
            <div v-else class="avatar-placeholder">
              {{ nama ? nama.substring(0,1).toUpperCase() : 'U' }}
            </div>
            <label for="foto-upload" class="edit-photo-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </label>
          </div>
          <input id="foto-upload" type="file" accept="image/*" hidden @change="pilihFoto">
        </div>

        <div class="input-group">
          <label>Nama Pengguna</label>
          <input v-model="nama" type="text" placeholder="Masukkan nama kamu...">
        </div>

        <button class="btn-save" @click="simpanProfil">
          Simpan Profil
        </button>
      </div>

      <!-- KARTU MENU PREFERENSI -->
      <div class="card menu-card">
        <!-- Toggle Dark Mode -->
        <div class="menu-row">
          <div class="menu-label">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </span>
            <span class="label">Mode Gelap</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="isDarkMode">
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="divider"></div>

        <!-- Toggle Notifikasi -->
        <div class="menu-row">
          <div class="menu-label">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.33 21a1.94 1.94 0 0 0 3.34 0"/></svg>
            </span>
            <span class="label">Notifikasi</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="isNotifActive">
            <span class="slider"></span>
          </label>
        </div>

        <div class="divider"></div>

        <!-- Tentang NabungAH -->
        <div class="menu-row clickable" @click="showAbout = !showAbout">
          <div class="menu-label">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/></svg>
            </span>
            <span class="label">Tentang NabungAh</span>
          </div>
          <span class="arrow-icon" :class="{ 'rotate': showAbout }">▼</span>
        </div>

        <!-- Konten Dropdown -->
        <transition name="slide">
          <div v-if="showAbout" class="about-content">
            <div class="about-inner">
              <h3>NabungAh</h3>
              <span class="badge">Versi 1.0.0</span>
              
              <div class="about-description">
                <p>Selamat datang di NabungAh, aplikasi yang dirancang untuk membantu Anda mengelola tabungan dengan lebih mudah, terencana, dan terorganisir. Setiap tujuan keuangan dapat dicapai melalui kebiasaan menabung yang konsisten.</p>
                <p>Melalui NabungAh, Anda dapat membuat wishlist sebagai daftar tujuan keuangan yang disertai target nominal tabungan agar proses menabung lebih terarah.</p>
                <p>Aplikasi ini juga dilengkapi pencatatan transaksi yang memperbarui progres secara otomatis sehingga perjalanan finansial Anda terpantau dengan baik.</p>
              </div>

              <div class="info-list">
                <div class="info-item">
                  <span>Developer</span>
                  <strong>Zaky Firdaus</strong>
                </div>
              </div>
              <p class="copyright">© 2026 NabungAh</p>
            </div>
          </div>
        </transition>
      </div>

      <!-- KARTU RESET DATA -->
      <div class="card danger-card">
        <div class="danger-text">
          <h4>Hapus Semua Data</h4>
          <p>Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <button class="btn-reset" @click="resetData">
          Reset Aplikasi
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

.setting-page {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 20px 120px 20px;
}

.header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.header-icon-box {
  width: 40px;
  height: 40px;
  background: #E0F2FE;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
}

.card {
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.avatar-image {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #E5E5EA;
}

.avatar-placeholder {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #007AFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 800;
}

.edit-photo-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #FFFFFF;
  border: 2px solid #E5E5EA;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  color: #007AFF;
}

.input-group {
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #E5E5EA;
  background: #F2F2F7;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  box-sizing: border-box;
  text-align: left;
  transition: all 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #007AFF;
}

.btn-save {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: #007AFF;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.btn-save:active {
  opacity: 0.8;
}

.menu-card {
  padding: 8px 20px;
}

.menu-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.menu-row.clickable {
  cursor: pointer;
}

.menu-label {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 14px;
  color: #8E8E93;
  transition: transform 0.3s ease;
}

.arrow-icon.rotate {
  transform: rotate(180deg);
}

.divider {
  height: 1px;
  background: #E5E5EA;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 30px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #E5E5EA;
  transition: .3s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .slider {
  background-color: #34C759;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  max-height: 2000px; 
  opacity: 1;
  overflow: hidden;
  transform-origin: top;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-15px);
}

.about-content {
  border-radius: 16px;
  margin-top: 8px;
  margin-bottom: 16px;
  border: 1px solid #E5E5EA;
  overflow: hidden;
}

.about-inner {
  padding: 20px;
  text-align: center;
}

.badge {
  display: inline-block;
  background: #E5F0FF;
  color: #007AFF;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
}

.about-description {
  text-align: left;
  border: 1px solid #E5E5EA;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  font-size: 13.5px;
  line-height: 1.6;
  max-height: 250px;
  overflow-y: auto;
}

.about-description p {
  margin: 0 0 12px 0;
}

.info-list {
  text-align: left;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #E5E5EA;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.copyright {
  margin-top: 16px;
  font-size: 12px;
  color: #8E8E93;
  font-weight: 600;
}

.danger-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #FF3B30;
  background: #FFF5F5;
}

.danger-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 800;
}

.danger-text p {
  margin: 0;
  font-size: 12px;
  color: #8E8E93;
}

.btn-reset {
  background: #FF3B30;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.btn-reset:active {
  opacity: 0.8;
}
</style>