<script setup>
import { ref } from 'vue'
import { getData, saveData } from '../data/storage'

const nama = ref('')
const target = ref('')
const saldo = ref('')
const deadline = ref('')
const foto = ref('')

const data = getData()

function pilihFoto(e){
  const file = e.target.files[0]
  if(!file) return

  const reader = new FileReader()
  reader.onload = () => {
    foto.value = reader.result
  }
  reader.readAsDataURL(file)
}

function resetForm() {
  nama.value = ''
  target.value = ''
  saldo.value = ''
  deadline.value = ''
  foto.value = ''
}

function simpan() {
  if (!nama.value || !target.value || !deadline.value) {
    alert('Lengkapi data')
    return
  }

  data.targets.push({
    id: Date.now(),
    foto: foto.value,
    nama: nama.value,
    target: Number(target.value),
    saldo: Number(saldo.value || 0),
    deadline: deadline.value,
    aktif: data.targets.length === 0
  })

  saveData(data)
  alert('Target berhasil dibuat')
  resetForm()
}

function jadikanAktif(id){
  data.targets.forEach(item => {
    item.aktif = item.id === id
  })
  saveData(data)
  alert("Target aktif berhasil diubah")
}

function hapusTarget(id) {
  if (!confirm("Yakin ingin menghapus target beserta semua transaksinya?")) {
    return
  }

  // Hapus target
  data.targets = data.targets.filter(item => item.id !== id)

  // Hapus transaksi milik target tersebut
  data.transaksi = data.transaksi.filter(
    trx => trx.targetId !== id
  )

  saveData(data)
  alert("Target berhasil dihapus")
}

// FUNGSI TARIK SALDO / PENCAIRAN KE E-WALLET
function cairkanTarget(targetItem) {
  if (targetItem.saldo <= 0) {
    alert("Belum ada saldo terkumpul di target ini yang bisa ditarik!")
    return
  }

  if (!data.wallets || data.wallets.length === 0) {
    alert("Kamu belum punya e-wallet atau bank di menu Wallet untuk menerima pencairan dana!")
    return
  }

  // Pilih e-wallet / bank tujuan
  let listWarta = "Pilih E-Wallet / Bank untuk menerima pencairan dana:\n"
  data.wallets.forEach((w, index) => {
    listWarta += `${index + 1}. ${w.nama} (Saldo: Rp${w.saldo.toLocaleString('id-ID')})\n`
  })

  const pilihan = prompt(listWarta + "\nMasukkan nomor pilihan e-wallet:")
  if (!pilihan) return

  const indexWallet = Number(pilihan) - 1
  if (isNaN(indexWallet) || !data.wallets[indexWallet]) {
    alert("Pilihan e-wallet tidak valid!")
    return
  }

  const walletTujuan = data.wallets[indexWallet]
  const jumlahCair = targetItem.saldo

  // 1. Tambahkan saldo ke e-wallet/bank pilihan
  walletTujuan.saldo += jumlahCair

  // 2. Catat ke riwayat transaksi
  if (!data.transaksi) data.transaksi = []
  data.transaksi.unshift({
    id: Date.now(),
    tipe: 'tarik',
    keterangan: `Pencairan target "${targetItem.nama}" ke ${walletTujuan.nama}`,
    jumlah: jumlahCair,
    targetId: targetItem.id,
    tanggal: new Date().toLocaleDateString('id-ID')
  })

  // 3. Reset saldo target menjadi 0
  targetItem.saldo = 0

  saveData(data)
  alert(`Berhasil! Dana sebesar Rp${jumlahCair.toLocaleString('id-ID')} telah dikembalikan ke ${walletTujuan.nama}.`)
}
</script>

<template>
  <div class="page clean-theme">
    
    <!-- HEADER -->
    <div class="header">
      <div class="header-title-wrapper">
        <div class="header-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        </div>
        <h2>Kelola Target</h2>
      </div>
      <p>Rencanakan dan wujudkan impianmu di sini</p>
    </div>

    <!-- FORM TAMBAH TARGET -->
    <div class="card form-card">
      <h3 class="section-title">Buat Target Baru</h3>

      <!-- CUSTOM UPLOAD FOTO (Mencegah Foto Terpotong) -->
      <label class="upload-area">
        <input
          type="file"
          accept="image/*"
          @change="pilihFoto"
          hidden
        >
        <div v-if="foto" class="preview-container">
          <img :src="foto" class="foto-preview">
          <div class="change-foto-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            Ganti Foto
          </div>
        </div>
        <div v-else class="upload-placeholder">
          <div class="upload-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <span>Unggah Foto Impian (Opsional)</span>
          <small>Ketuk untuk memilih dari galeri</small>
        </div>
      </label>

      <!-- INPUT FORM -->
      <div class="input-group">
        <label>Nama Target</label>
        <input v-model="nama" placeholder="Contoh: Beli Sepeda Motor">
      </div>

      <div class="input-row">
        <div class="input-group">
          <label>Target (Rp)</label>
          <input v-model="target" type="number" placeholder="0">
        </div>
        <div class="input-group">
          <label>Saldo Awal (Rp)</label>
          <input v-model="saldo" type="number" placeholder="0">
        </div>
      </div>

      <div class="input-group">
        <label>Tenggat Waktu (Deadline)</label>
        <input v-model="deadline" type="date">
      </div>

      <button class="btn-primary" @click="simpan">
        Simpan Target
      </button>
    </div>

    <div class="divider"></div>

    <!-- DAFTAR TARGET -->
    <div class="list-header">
      <h3>Daftar Target Kamu</h3>
      <span class="badge-count" v-if="data.targets.length">{{ data.targets.length }} Target</span>
    </div>

    <div v-if="!data.targets.length" class="empty-state">
      <div class="empty-icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      </div>
      <p>Belum ada target yang dibuat.</p>
    </div>

    <div class="target-list">
      <div
        v-for="item in data.targets"
        :key="item.id"
        class="card target-item"
        :class="{ 'is-active': item.aktif }"
      >
        
        <!-- WADAH FOTO TARGET (Full Utuh Tanpa Terpotong) -->
        <div v-if="item.foto" class="foto-container">
          <img :src="item.foto" class="foto-target">
        </div>

        <div class="target-info">
          <div class="target-head">
            <div class="target-title-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              <h3 class="target-name">{{ item.nama }}</h3>
            </div>
            <span v-if="item.aktif" class="status-badge active-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Aktif
            </span>
          </div>

          <!-- GRID STATISTIK -->
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-label">Target Nominal</span>
              <span class="stat-value">Rp{{ item.target.toLocaleString('id-ID') }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Saldo Saat Ini</span>
              <span class="stat-value text-blue">Rp{{ item.saldo.toLocaleString('id-ID') }}</span>
            </div>
            <div class="stat-box full-width">
              <span class="stat-label">Tenggat Waktu</span>
              <span class="stat-value">{{ item.deadline }}</span>
            </div>
          </div>

          <!-- TOMBOL AKSI -->
          <div class="action-buttons">
            <button
              v-if="!item.aktif"
              class="btn-outline-blue"
              @click="jadikanAktif(item.id)">
              Jadikan Aktif
            </button>
            <button
              class="btn-outline-orange"
              @click="cairkanTarget(item)"
              :disabled="item.saldo <= 0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Tarik Saldo
            </button>
            <button
              class="btn-outline-red"
              @click="hapusTarget(item.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Hapus
            </button>
          </div>
        </div>

      </div>
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
  padding: 24px;
  padding-bottom: 100px;
  background-color: #F4F7F9;
  min-height: 100vh;
  max-width: 480px;
  margin: 0 auto;
  color: #1E293B;
}

/* --- HEADER --- */
.header {
  margin-bottom: 24px;
}

.header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.header-icon-box {
  width: 36px;
  height: 36px;
  background: #E0F2FE;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header h2 {
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  color: #0F172A;
}

.header p {
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

/* --- CARDS --- */
.card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F5F9;
}

/* --- FORM STYLES --- */
.form-card {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 20px 0;
  color: #0F172A;
}

/* Custom Upload Area */
.upload-area {
  display: block;
  width: 100%;
  border: 2px dashed #CBD5E1;
  border-radius: 16px;
  margin-bottom: 20px;
  cursor: pointer;
  overflow: hidden;
  background: #F8FAFC;
  transition: all 0.2s ease;
}

.upload-area:active {
  background: #EFF6FF;
  border-color: #0061FF;
}

.upload-placeholder {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #64748B;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
}

.upload-placeholder small {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 500;
}

.upload-icon-box {
  width: 48px;
  height: 48px;
  background: #E0F2FE;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}

/* Preview Foto Form (Agar Tidak Terpotong) */
.preview-container {
  position: relative;
  width: 100%;
  padding: 16px;
  background: #F8FAFC;
  display: flex;
  justify-content: center;
  align-items: center;
}

.foto-preview {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 12px;
}

.change-foto-badge {
  position: absolute;
  bottom: 24px;
  background: rgba(15, 23, 42, 0.75);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Form Inputs */
.input-group {
  margin-bottom: 16px;
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-row .input-group {
  flex: 1;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
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

/* Button Primary */
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
  margin-top: 8px;
  box-shadow: 0 8px 20px rgba(0, 97, 255, 0.2);
  transition: transform 0.2s ease;
}

.btn-primary:active {
  transform: scale(0.98);
}

/* --- DIVIDER --- */
.divider {
  height: 1px;
  background: #E2E8F0;
  margin: 32px 0;
}

/* --- LIST TARGET --- */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-header h3 {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.badge-count {
  background: #E0F2FE;
  color: #0284C7;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #FFFFFF;
  border-radius: 20px;
  border: 1px dashed #CBD5E1;
}

.empty-icon-box {
  width: 50px;
  height: 50px;
  background: #F1F5F9;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 12px auto;
}

.empty-state p {
  color: #64748B;
  font-size: 14px;
  margin: 0;
}

/* Target Item Card */
.target-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.target-item {
  padding: 0;
  overflow: hidden;
  transition: border-color 0.3s;
}

.target-item.is-active {
  border: 2px solid #0061FF;
}

/* Wadah & Foto Target di List (Mencegah Foto Terpotong) */
.foto-container {
  width: 100%;
  background: #F8FAFC;
  border-bottom: 1px solid #F1F5F9;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.foto-target {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 12px;
}

.target-info {
  padding: 20px;
}

.target-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 8px;
}

.target-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.target-name {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: #0F172A;
  word-break: break-word;
}

.status-badge {
  font-size: 12px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.active-badge {
  background: #DCFCE7;
  color: #166534;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: #F8FAFC;
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 20px;
}

.full-width {
  grid-column: span 2;
  border-top: 1px dashed #E2E8F0;
  padding-top: 12px;
  margin-top: 2px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748B;
  font-weight: 700;
}

.stat-value {
  font-size: 15px;
  font-weight: 800;
  color: #1E293B;
  word-break: break-word;
}

.text-blue {
  color: #0061FF;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-outline-blue, .btn-outline-orange, .btn-outline-red {
  flex: 1;
  padding: 12px 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.btn-outline-blue {
  border: 1px solid #0061FF;
  color: #0061FF;
}

.btn-outline-blue:active {
  background: #EFF6FF;
}

.btn-outline-orange {
  border: 1px solid #F59E0B;
  color: #D97706;
}

.btn-outline-orange:active {
  background: #FEF3C7;
}

.btn-outline-orange:disabled {
  border-color: #E2E8F0;
  color: #94A3B8;
  cursor: not-allowed;
}

.btn-outline-red {
  border: 1px solid #EF4444;
  color: #EF4444;
}

.btn-outline-red:active {
  background: #FEF2F2;
}
</style>