<script setup>
import { ref } from 'vue'
import { getData, saveData } from '../data/storage'

const data = getData()

const nama = ref(data.profile.nama)
const foto = ref(data.profile.foto)

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
  if (confirm('Yakin ingin menghapus semua data?')) {
    localStorage.clear()
    location.reload()
  }
}
</script>

<template>
  <div class="page clean-theme">
    <div class="content-wrapper">

      <!-- HEADER -->
      <div class="header">
        <h2>⚙️ Pengaturan</h2>
        <p>Sesuaikan profil dan preferensi akun Anda</p>
      </div>

      <!-- KARTU PROFIL UTAMA -->
      <div class="card profile-box">
        <div class="avatar-container">
          <img
            v-if="foto"
            :src="foto"
            class="avatar-img"
          >
          <div
            v-else
            class="avatar-img avatar-placeholder"
          >
            {{ nama ? nama.substring(0,1).toUpperCase() : '👤' }}
          </div>
          
          <label for="foto-input" class="camera-badge" title="Ganti Foto">
            📷
          </label>
        </div>

        <input
          id="foto-input"
          type="file"
          accept="image/*"
          hidden
          @change="pilihFoto"
        >

        <h3 class="profile-name-preview">{{ nama || 'Pengguna' }}</h3>

        <div class="form-group">
          <label>Nama Lengkap</label>
          <input
            v-model="nama"
            placeholder="Masukkan nama Anda"
          >
        </div>

        <button class="btn-primary" @click="simpanProfil">
          Simpan Perubahan
        </button>
      </div>

      <!-- KARTU MENU NAVIGASI -->
      <div class="card menu-box">
        <div class="menu-list">
          <div class="menu-item">
            <span class="menu-text">👤 Edit Profil</span>
            <span class="menu-arrow">›</span>
          </div>
          <div class="menu-item">
            <span class="menu-text">🌙 Tema Tampilan</span>
            <span class="badge-coming">Segera</span>
          </div>
          <div class="menu-item">
            <span class="menu-text">📦 Backup & Restore</span>
            <span class="badge-coming">Segera</span>
          </div>
          <div class="menu-item last">
            <span class="menu-text">ℹ️ Tentang NabungAH</span>
            <span class="menu-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- KARTU ZONA BAHAYA (RESET) -->
      <div class="card danger-box">
        <div class="danger-info">
          <h4>Zona Bahaya</h4>
          <p>Menghapus seluruh data target dan riwayat transaksi secara permanen.</p>
        </div>
        <button class="btn-danger" @click="resetData">
          🗑️ Reset Semua Data
        </button>
      </div>

      <p class="app-version">NabungAH v1.0.0 • Modern Financial Tracker</p>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.page {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: #F4F7F9;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 480px;
  padding: 24px;
  /* Padding bawah ekstra agar tidak tertutup navbar bawah */
  padding-bottom: 150px; 
}

/* --- HEADER --- */
.header {
  margin-bottom: 24px;
}

.header h2 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 4px 0;
  color: #0F172A;
}

.header p {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

/* --- CARDS GLOBAL --- */
.card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F5F9;
  margin-bottom: 20px;
}

/* --- PROFILE BOX --- */
.profile-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-container {
  position: relative;
  margin-bottom: 14px;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #E0F2FE;
  box-shadow: 0 6px 16px rgba(0, 97, 255, 0.15);
}

.avatar-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  color: white;
  font-size: 40px;
  font-weight: 800;
}

.camera-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #0061FF;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  border: 3px solid #FFFFFF;
  box-shadow: 0 4px 10px rgba(0, 97, 255, 0.3);
  transition: transform 0.2s ease;
}

.camera-badge:active {
  transform: scale(0.9);
}

.profile-name-preview {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 20px 0;
  word-break: break-word;
}

.form-group {
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  background: #F8FAFC;
  font-size: 15px;
  font-family: inherit;
  color: #0F172A;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #0061FF;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(0, 97, 255, 0.1);
}

/* --- MENU BOX --- */
.menu-box {
  padding: 0 24px;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #F1F5F9;
  font-size: 15px;
  font-weight: 700;
  color: #334155;
}

.menu-item.last {
  border-bottom: none;
}

.menu-arrow {
  color: #94A3B8;
  font-size: 18px;
  font-weight: 800;
}

.badge-coming {
  font-size: 11px;
  background: #E0F2FE;
  color: #0284C7;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 700;
}

/* --- DANGER BOX (RESET) --- */
.danger-box {
  border: 1px solid #FEE2E2;
  background: #FFFDFD;
}

.danger-info {
  margin-bottom: 16px;
}

.danger-info h4 {
  font-size: 15px;
  font-weight: 800;
  color: #DC2626;
  margin: 0 0 4px 0;
}

.danger-info p {
  font-size: 13px;
  color: #64748B;
  margin: 0;
  line-height: 1.4;
}

/* --- BUTTONS --- */
.btn-primary {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 97, 255, 0.2);
  transition: transform 0.2s ease;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-danger {
  width: 100%;
  padding: 14px;
  background: #FEF2F2;
  border: 1px solid #FCA5A5;
  border-radius: 14px;
  color: #DC2626;
  font-size: 15px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:active {
  background: #FEE2E2;
  transform: scale(0.98);
}

/* --- VERSION --- */
.app-version {
  text-align: center;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 600;
  margin-top: 16px;
}
</style>