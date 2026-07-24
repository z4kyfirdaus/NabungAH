<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from '../data/storage'
import { cekNotifikasi } from '../utils/notification'

const data = getData()

const router = useRouter()

const notif = computed(()=>{
    return cekNotifikasi(data)
})

function tambahTarget() {
  router.push('/target')
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

function hapusTarget(id) {
  const index = data.targets.findIndex(item => item.id === id)

  if (index !== -1) {
    data.targets.splice(index, 1)
    saveData(data)
  }
}
</script>

<template>
  <div class="dashboard clean-theme">
    
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
          {{ data.profile.nama ? data.profile.nama.substring(0,1).toUpperCase() : '👋' }}
        </div>

        <div class="header-text">
          <p class="greeting">Selamat datang,</p>
          <h2>{{ data.profile.nama || 'Pengguna' }}</h2>
        </div>
      </div>
      <div class="menu-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>
    </div>

    <!-- NOTIFIKASI -->
    <div
      v-if="notif"
      class="notif"
      :class="notif.tipe"
    >
      {{ notif.pesan }}
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
      <!-- Pola dekorasi yang aman (tidak akan memotong teks) -->
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
            <div class="icon-wrapper">🎯</div>
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
          <div class="empty-illustration">💰</div>
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
/* Menggunakan font Nunito yang sangat rapi, membulat, dan mudah dibaca */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

.dashboard {
  font-family: 'Nunito', sans-serif;
  padding: 24px;
  padding-bottom: 100px;
  background-color: #F4F7F9; /* Abu-abu kebiruan sangat lembut */
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  color: #1E293B;
}

/* --- HEADER --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
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
  width: 40px;
  height: 40px;
  background: #FFFFFF;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #334155;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  cursor: pointer;
}

/* --- NOTIFIKASI --- */
.notif {
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 13px;
}
.info { background: #EFF6FF; color: #1D4ED8; border-left: 4px solid #3B82F6; }
.warning { background: #FFFBEB; color: #B45309; border-left: 4px solid #F59E0B; }
.success { background: #F0FDF4; color: #15803D; border-left: 4px solid #10B981; }

/* --- KARTU SALDO UTAMA --- */
.balance-card {
  position: relative;
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  border-radius: 24px;
  padding: 32px 24px;
  color: #FFFFFF;
  box-shadow: 0 12px 24px rgba(0, 97, 255, 0.2);
  margin-bottom: 28px;
  /* Dihapus overflow: hidden agar teks aman jika layarnya sangat sempit */
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

/* Struktur baru untuk angka agar sejajar dan tidak terpotong */
.balance-amount-container {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  word-break: break-word; /* Angka panjang akan turun ke bawah secara otomatis */
}

.balance-amount-container .currency {
  font-size: 20px;
  font-weight: 700;
  margin-top: 4px; /* Menyesuaikan posisi dengan angka */
  opacity: 0.8;
}

.balance-amount {
  font-size: 34px;
  font-weight: 800;
  margin: 0;
  line-height: 1.2; /* Line-height yang cukup agar ujung angka tidak terpotong */
  letter-spacing: -0.5px;
}

.card-pattern {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 150px;
  background-image: radial-gradient(circle at 100% 0%, rgba(255,255,255,0.15) 0%, transparent 60%);
  border-radius: 0 24px 24px 0;
  z-index: 1;
}

/* --- KARTU TARGET AKTIF --- */
.section-title {
  margin-bottom: 16px;
}

.section-title h3 {
  font-size: 17px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
}

.target-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F5F9;
}

.target-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #E2E8F0;
}

.target-identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icon-wrapper {
  width: 44px;
  height: 44px;
  background: #F8FAFC;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
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
  margin-bottom: 24px;
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
  background: linear-gradient(90deg, #0061FF 0%, #60EFFF 100%);
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
  gap: 16px;
}

.stat-box {
  padding: 16px;
  background: #F8FAFC;
  border-radius: 16px;
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
  font-size: 48px;
  margin-bottom: 16px;
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
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 16px;
  background: #0061FF;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 97, 255, 0.2);
  transition: all 0.2s ease;
}

.btn-primary:active {
  transform: scale(0.98);
  box-shadow: 0 4px 10px rgba(0, 97, 255, 0.2);
}
</style>