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

  reader.onload=()=>{

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

id:Date.now(),

foto:foto.value,

nama:nama.value,

target:Number(target.value),

saldo:Number(saldo.value||0),

deadline:deadline.value,

aktif:data.targets.length===0

})

  saveData(data)

  alert('Target berhasil dibuat')

  resetForm()
}

function jadikanAktif(id){

  data.targets.forEach(item=>{
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
</script>

<template>
  <div class="page clean-theme">
    
    <!-- HEADER -->
    <div class="header">
      <h2>🎯 Kelola Target</h2>
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
          <div class="change-foto-badge">📷 Ganti Foto</div>
        </div>
        <div v-else class="upload-placeholder">
          <span class="upload-icon">🖼️</span>
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
      <div class="empty-icon">📁</div>
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
            <h3 class="target-name">🎯 {{ item.nama }}</h3>
            <span v-if="item.aktif" class="status-badge active-badge">✅ Aktif</span>
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
              class="btn-outline-red"
              @click="hapusTarget(item.id)">
              🗑️ Hapus
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

.upload-icon {
  font-size: 32px;
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
  object-fit: contain; /* Memastikan seluruh foto terlihat utuh */
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

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
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
  object-fit: contain; /* Seluruh foto ditampilkan utuh tanpa terpotong */
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
  gap: 10px;
}

.btn-outline-blue, .btn-outline-red {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s ease;
}

.btn-outline-blue {
  border: 1px solid #0061FF;
  color: #0061FF;
}

.btn-outline-blue:active {
  background: #EFF6FF;
}

.btn-outline-red {
  border: 1px solid #EF4444;
  color: #EF4444;
}

.btn-outline-red:active {
  background: #FEF2F2;
}
</style>