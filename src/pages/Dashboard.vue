<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from '../data/storage'
import { cekNotifikasi } from '../utils/notification'
import { showAlert } from '../utils/modal'
import { useTheme } from '../utils/theme'

const { isDarkMode } = useTheme()

const data = getData()
const router = useRouter()
const showDrawer = ref(false)

const notif = computed(()=>{
    return cekNotifikasi(data)
})

function tambahTarget() {
  router.push('/target')
}

function bukaSetting() {
  showDrawer.value = false
  router.push('/setting')
}

function bukaAi() {
  showDrawer.value = false
  router.push('/ai')
}

// Fungsi untuk memicu Native Push Notification (jika sudah jadi APK/PWA)
function mintaIzinNotif() {
  if (!("Notification" in window)) {
    showAlert("Browser ini tidak mendukung notifikasi sistem.", "Notifikasi", "info")
    return
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      new Notification("NabungAh", {
        body: "Notifikasi aktif! Pengingat menabung harian siap dikirim ke HP Anda.",
        icon: "/favicon.ico"
      })
      showAlert("Notifikasi berhasil diaktifkan!", "Notifikasi Aktif", "success")
    } else {
      showAlert("Izin notifikasi ditolak.", "Notifikasi Ditolak", "warning")
    }
  })
}

const totalTabungan = computed(() => {
  return data.targets.reduce((total, item) => total + item.saldo, 0)
})

const targetAktif = computed(() => {
  return data.targets.find(item => item.aktif) || null
})

const progress = computed(() => {
  if (!targetAktif.value) return 0

  return Math.min(
    100,
    Math.round(
      (targetAktif.value.saldo / targetAktif.value.target) * 100
    )
  )
})

const sisa = computed(() => {
  if (!targetAktif.value) return 0

  return targetAktif.value.target - targetAktif.value.saldo
})

const perHari = computed(() => {
  if (!targetAktif.value) return 0

  const sekarang = new Date()
  const deadline = new Date(targetAktif.value.deadline)

  const hari = Math.ceil(
    (deadline - sekarang) / (1000 * 60 * 60 * 24)
  )

  if (hari <= 0)
    return sisa.value

  return Math.ceil(sisa.value / hari)
})
</script>

<template>
  <div class="dashboard clean-theme" :class="{ dark: isDarkMode }">
    
    <!-- BACKGROUND EFEK GRADASI & CAHAYA MODERN -->
    <div class="bg-glow-effect">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="glow-orb orb-3"></div>
    </div>

    <!-- HEADER -->
    <div class="header">
      <div class="header-info">
        <img
          v-if="data.profile.foto"
          :src="data.profile.foto"
          class="avatar"
        >
        <div
          v-else
          class="avatar kosong"
        >
          {{ data.profile.nama ? data.profile.nama.substring(0,1).toUpperCase() : 'U' }}
        </div>

        <div class="header-text">
          <p class="greeting">Selamat datang,</p>
          <h2>{{ data.profile.nama || 'Pengguna' }}</h2>
        </div>
      </div>
      <div class="menu-btn" @click="showDrawer = true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>
    </div>

    <!-- DRAWER / SIDEBAR PROFIL DARI KANAN (DENGAN EFEK Kaca / Glassmorphism) -->
    <transition name="fade">
      <div v-if="showDrawer" class="drawer-overlay" @click="showDrawer = false"></div>
    </transition>

    <transition name="slide-drawer">
      <div v-if="showDrawer" class="drawer-panel" @click.stop>
        
        <!-- Efek Background dalam Drawer -->
        <div class="drawer-bg-glow"></div>

        <div class="drawer-header">
          <h3>Menu Profil</h3>
          <button class="close-btn" @click="showDrawer = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- AKUN PROFIL -->
        <div class="drawer-profile-content" @click="bukaSetting">
          <div class="drawer-avatar-wrapper">
            <img v-if="data.profile.foto" :src="data.profile.foto" class="drawer-avatar">
            <div v-else class="drawer-avatar-placeholder">
              {{ data.profile.nama ? data.profile.nama.substring(0,1).toUpperCase() : 'U' }}
            </div>
          </div>
          <div class="drawer-user-info">
            <h4>{{ data.profile.nama || 'Pengguna' }}</h4>
            <p>Ketuk untuk ke Pengaturan</p>
          </div>
          <div class="drawer-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- TOMBOL NABUNGAH AI -->
        <div class="drawer-ai-box" @click="bukaAi">
          <div class="drawer-ai-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 7 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="drawer-ai-text">
            <h5>NabungAH AI</h5>
            <p>Konsultasi & tips menabung cerdas</p>
          </div>
          <div class="drawer-arrow-ai">›</div>
        </div>

        <!-- Tombol Aktifkan Notifikasi HP dalam Drawer -->
        <div class="drawer-notif-box" @click="mintaIzinNotif">
          <div class="drawer-notif-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.33 21a1.94 1.94 0 0 0 3.34 0"/></svg>
          </div>
          <div class="drawer-notif-text">
            <h5>Aktifkan Notifikasi HP</h5>
            <p>Agar muncul di layar HP saat jadi APK</p>
          </div>
        </div>

      </div>
    </transition>

    <!-- NOTIFIKASI DI HALAMAN (DALAM APP) -->
    <div
      v-if="notif"
      class="notif-card-box"
      :class="notif.tipe"
    >
      <div class="notif-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div class="notif-message">
        <p>{{ notif.pesan }}</p>
      </div>
    </div>

    <!-- KARTU SALDO UTAMA -->
    <div class="card balance-card">
      <div class="balance-wrapper">
        <p class="balance-label">Total Tabungan</p>
        <div class="balance-amount-container">
          <span class="currency">Rp</span>
          <h2 class="balance-amount">{{ totalTabungan.toLocaleString('id-ID') }}</h2>
        </div>
      </div>
      <div class="card-pattern"></div>
    </div>

    <!-- KARTU TARGET AKTIF -->
    <div class="section-title">
      <h3>Target Finansial</h3>
    </div>

    <div class="card target-card">
      <template v-if="targetAktif">
        <div class="target-header">
          <div class="target-identity">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <div class="target-titles">
              <h3 class="target-name">{{ targetAktif.nama }}</h3>
              <p class="target-deadline">Tenggat: {{ targetAktif.deadline }}</p>
            </div>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-labels">
            <span class="progress-current">Rp{{ targetAktif.saldo.toLocaleString('id-ID') }}</span>
            <span class="progress-total">dari Rp{{ targetAktif.target.toLocaleString('id-ID') }}</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: progress + '%' }">
            </div>
          </div>
          <p class="progress-percentage">{{ progress }}% Tercapai</p>
        </div>

        <div class="stats-container">
          <div class="stat-box">
            <p class="stat-label">Sisa Kebutuhan</p>
            <p class="stat-value">Rp{{ sisa.toLocaleString('id-ID') }}</p>
          </div>
          <div class="stat-box highlight">
            <p class="stat-label">Nabung Harian</p>
            <p class="stat-value text-blue">Rp{{ perHari.toLocaleString('id-ID') }}</p>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="empty-state">
          <div class="empty-illustration">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <h3>Belum Ada Target</h3>
          <p>Tentukan tujuan keuanganmu dan pantau perkembangannya di sini.</p>
        </div>
      </template>
    </div>

    <!-- TOMBOL TAMBAH -->
    <button class="btn-primary" @click="tambahTarget">
      + Tambah Target Baru
    </button>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.dashboard {
  font-family: 'Nunito', sans-serif;
  padding: 24px;
  padding-bottom: 110px;
  background-color: #F8FAFC;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  color: #1E293B;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

/* --- BACKGROUND EFEK CAHAYA DINAMIS --- */
.bg-glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.18;
}

.orb-1 {
  width: 260px;
  height: 260px;
  background: #0061FF;
  top: -80px;
  left: -70px;
}

.orb-2 {
  width: 220px;
  height: 220px;
  background: #38BDF8;
  top: 60px;
  right: -60px;
}

.orb-3 {
  width: 180px;
  height: 180px;
  background: #818CF8;
  top: 220px;
  left: 100px;
}

/* --- DRAWER SIDEBAR DARI KANAN --- */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  z-index: 99;
}

.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 310px;
  background: #FFFFFF;
  z-index: 100;
  padding: 24px;
  box-shadow: -15px 0 35px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-bg-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  filter: blur(50px);
  opacity: 0.2;
  z-index: 0;
}

.drawer-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #F1F5F9;
  padding-bottom: 16px;
}

.drawer-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
}

.close-btn {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #64748B;
  transition: all 0.2s;
}

.close-btn:active {
  background: #F1F5F9;
}

.drawer-profile-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  background: #F8FAFC;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid #E2E8F0;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.drawer-profile-content:active {
  background: #EFF6FF;
  border-color: #0061FF;
}

.drawer-avatar-wrapper {
  flex-shrink: 0;
}

.drawer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0061FF;
}

.drawer-avatar-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #0061FF;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 800;
}

.drawer-user-info {
  flex: 1;
}

.drawer-user-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
}

.drawer-user-info p {
  margin: 0;
  font-size: 12px;
  color: #64748B;
  font-weight: 600;
}

.drawer-arrow {
  color: #94A3B8;
}

/* Tombol AI dalam Drawer */
.drawer-ai-box {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ECFDF5;
  padding: 14px 16px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid #A7F3D0;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.drawer-ai-box:active {
  background: #D1FAE5;
  transform: scale(0.98);
}

.drawer-ai-icon {
  width: 36px;
  height: 36px;
  background: #FFFFFF;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);
}

.drawer-ai-text {
  flex: 1;
}

.drawer-ai-text h5 {
  margin: 0 0 2px 0;
  font-size: 14px;
  font-weight: 800;
  color: #065F46;
}

.drawer-ai-text p {
  margin: 0;
  font-size: 11px;
  color: #047857;
  font-weight: 600;
}

.drawer-arrow-ai {
  font-size: 18px;
  font-weight: 700;
  color: #10B981;
}

/* Tombol Notifikasi dalam Drawer */
.drawer-notif-box {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #F0Fdf4;
  padding: 14px 16px;
  border-radius: 16px;
  cursor: pointer;
  border: 1px solid #BBF7D0;
  transition: all 0.2s;
}

.drawer-notif-box:active {
  background: #DCFCE7;
}

.drawer-notif-icon {
  width: 36px;
  height: 36px;
  background: #DCFCE7;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.drawer-notif-text h5 {
  margin: 0 0 2px 0;
  font-size: 14px;
  font-weight: 800;
  color: #166534;
}

.drawer-notif-text p {
  margin: 0;
  font-size: 11px;
  color: #15803D;
  font-weight: 600;
}

/* Transisi Drawer */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-drawer-enter-active, .slide-drawer-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-drawer-enter-from, .slide-drawer-leave-to {
  transform: translateX(100%);
}

/* --- HEADER --- */
.header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  object-fit: cover;
  background: #E0F2FE;
  color: #0284C7;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 97, 255, 0.15);
}

.avatar.kosong {
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  color: white;
}

.header-text .greeting {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 2px 0;
  font-weight: 600;
}

.header-text h2 {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: #0F172A;
}

.menu-btn {
  width: 42px;
  height: 42px;
  background: #FFFFFF;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #334155;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  border: 1px solid #E2E8F0;
  transition: all 0.2s;
}

.menu-btn:active {
  transform: scale(0.95);
  background: #F8FAFC;
}

/* --- NOTIFIKASI DI HALAMAN --- */
.notif-card-box {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.notif-message p {
  margin: 0;
  line-height: 1.4;
}

.info { 
  background: rgba(239, 246, 255, 0.9); 
  color: #1D4ED8; 
  border: 1px solid #BFDBFE; 
}
.info .notif-icon { background: #DBEAFE; color: #2563EB; }

.warning { 
  background: rgba(254, 252, 232, 0.9); 
  color: #B45309; 
  border: 1px solid #FEF08A; 
}
.warning .notif-icon { background: #FEF08A; color: #D97706; }

.success { 
  background: rgba(240, 253, 244, 0.9); 
  color: #15803D; 
  border: 1px solid #BBF7D0; 
}
.success .notif-icon { background: #DCFCE7; color: #16A34A; }

/* --- KARTU SALDO UTAMA --- */
.balance-card {
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, #0061FF 0%, #38BDF8 100%);
  border-radius: 24px;
  padding: 30px 24px;
  color: #FFFFFF;
  box-shadow: 0 14px 28px rgba(0, 97, 255, 0.25);
  margin-bottom: 26px;
  overflow: hidden;
}

.balance-wrapper {
  position: relative;
  z-index: 2;
}

.balance-label {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
}

.balance-amount-container {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  word-break: break-word;
}

.balance-amount-container .currency {
  font-size: 20px;
  font-weight: 700;
  margin-top: 4px;
  opacity: 0.85;
}

.balance-amount {
  font-size: 34px;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: #FFFFFF;
}

.card-pattern {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 160px;
  background-image: radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, transparent 65%);
  border-radius: 0 24px 24px 0;
  z-index: 1;
}

/* --- KARTU TARGET AKTIF --- */
.section-title {
  position: relative;
  z-index: 1;
  margin-bottom: 16px;
}

.section-title h3 {
  font-size: 17px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
}

.target-card {
  position: relative;
  z-index: 1;
  background: #FFFFFF;
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #E2E8F0;
}

.target-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #E2E8F0;
}

.target-identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.content-wrapper {
  max-width: 100%;
  height: 46px;
  background: #F0F9FF;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #BAE6FD;
}

.target-name {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 2px 0;
}

.target-deadline {
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
  margin: 0;
}

/* --- PROGRESS BAR --- */
.progress-section {
  margin-bottom: 22px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}

.progress-current {
  font-size: 20px;
  font-weight: 800;
  color: #0F172A;
}

.progress-total {
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
}

.progress-track {
  width: 100%;
  height: 10px;
  background: #F1F5F9;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0061FF 0%, #38BDF8 100%);
  border-radius: 10px;
  transition: width 1s ease-in-out;
}

.progress-percentage {
  font-size: 13px;
  color: #64748B;
  font-weight: 700;
  text-align: right;
  margin: 8px 0 0 0;
}

/* --- STATISTIK --- */
.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.stat-box {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 16px;
  border: 1px solid #F1F5F9;
}

.stat-box.highlight {
  background: #F0F9FF;
  border: 1px solid #BAE6FD;
}

.stat-label {
  font-size: 12px;
  color: #64748B;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
}

.text-blue {
  color: #0284C7;
}

/* --- EMPTY STATE --- */
.empty-state {
  text-align: center;
  padding: 24px 0;
}

.empty-illustration {
  width: 60px;
  height: 60px;
  background: #F8FAFC;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 16px auto;
  border: 1px solid #E2E8F0;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #64748B;
  margin: 0;
  line-height: 1.5;
}

/* --- TOMBOL UTAMA --- */
.btn-primary {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #0061FF 0%, #38BDF8 100%);
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0, 97, 255, 0.25);
  transition: all 0.2s ease;
  margin-top: 14px;
}

.btn-primary:active {
  transform: scale(0.98);
  box-shadow: 0 4px 10px rgba(0, 97, 255, 0.2);
}

/* ============ DARK MODE ============ */
.dashboard.dark {
  background-color: #000000;
  color: #ffffff;
}

.dashboard.dark .target-card,
.dashboard.dark .card,
.dashboard.dark .empty-state {
  background-color: #121212;
  background: #121212;
  border-color: #27272a;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.dashboard.dark .drawer-panel {
  background: #0a0a0a;
  box-shadow: -15px 0 35px rgba(0, 0, 0, 0.5);
}

.dashboard.dark .drawer-header {
  border-bottom-color: #27272a;
}

.dashboard.dark .drawer-profile-content {
  background: #121212;
  border-color: #27272a;
}

.dashboard.dark .stat-box {
  background-color: #18181b;
  background: #18181b;
  border-color: #27272a;
  color: #ffffff;
}

.dashboard.dark .menu-btn,
.dashboard.dark .close-btn {
  background: #18181b;
  border-color: #27272a;
  color: #ffffff;
}

.dashboard.dark .header-text h2,
.dashboard.dark .target-name,
.dashboard.dark .stat-value,
.dashboard.dark .section-title h3,
.dashboard.dark .drawer-header h3,
.dashboard.dark .drawer-user-info h4,
.dashboard.dark .empty-state h3 {
  color: #ffffff;
}

.dashboard.dark .greeting,
.dashboard.dark .target-deadline,
.dashboard.dark .stat-label,
.dashboard.dark .empty-state p,
.dashboard.dark .drawer-user-info p {
  color: #a1a1aa;
}

.dashboard.dark .bg-glow-effect {
  opacity: 0.3;
}

.dashboard.dark .drawer-ai-box {
  background: #052e16;
  border-color: #14532d;
}

.dashboard.dark .drawer-notif-box {
  background: #052e16;
  border-color: #14532d;
}

.dashboard.dark .drawer-ai-icon {
  background: #18181b;
}

.dashboard.dark .avatar {
  background: #1e3a5f;
}
</style>
