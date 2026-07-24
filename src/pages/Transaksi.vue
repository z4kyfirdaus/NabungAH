<script setup>
import { ref, computed } from 'vue'
import { getData, saveData } from '../data/storage'

const data = getData()

const jenis = ref('masuk')
const nominal = ref('')
const catatan = ref('')

const targetAktif = computed(() =>
  data.targets.find(item => item.aktif)
)

function simpanTransaksi() {

  if (!targetAktif.value) {
    alert('Belum ada target aktif')
    return
  }

  if (!nominal.value) {
    alert('Masukkan nominal')
    return
  }

  const jumlah = Number(nominal.value)

  if (jenis.value === 'masuk') {
    targetAktif.value.saldo += jumlah
  } else {

    if (jumlah > targetAktif.value.saldo) {
      alert('Saldo tidak cukup')
      return
    }

    targetAktif.value.saldo -= jumlah
  }

  data.transaksi.push({
    id: Date.now(),
    targetId: targetAktif.value.id,
    jenis: jenis.value,
    nominal: jumlah,
    catatan: catatan.value,
    tanggal: new Date().toLocaleDateString('id-ID')
  })

  saveData(data)

  nominal.value = ''
  catatan.value = ''

  alert('Transaksi berhasil')
}

const transaksiTarget = computed(() => {

  if (!targetAktif.value) return []

  return data.transaksi
    .filter(item => item.targetId === targetAktif.value.id)
    .sort((a,b)=> b.id-a.id)

})
</script>

<template>
  <div class="page clean-theme">
    
    <div class="content-wrapper">
      
      <!-- HEADER -->
      <div class="header">
        <h2>💸 Transaksi Keuangan</h2>
        <p>Catat pemasukan atau pengeluaran target aktifmu</p>
      </div>

      <!-- KARTU TARGET AKTIF -->
      <div v-if="targetAktif" class="card active-target-card">
        <div class="target-badge">Target Aktif</div>
        <h3 class="target-title">🎯 {{ targetAktif.nama }}</h3>
        <p class="balance-label">Saldo Saat Ini</p>
        <div class="balance-amount-container">
          <span class="currency">Rp</span>
          <h2 class="balance-amount">{{ targetAktif.saldo.toLocaleString('id-ID') }}</h2>
        </div>
      </div>

      <div v-else class="card empty-target-card">
        <div class="empty-icon">⚠️</div>
        <h3>Belum Ada Target Aktif</h3>
        <p>Silakan aktifkan salah satu target terlebih dahulu pada menu Target.</p>
      </div>

      <!-- FORM TRANSAKSI -->
      <div class="card form-card">
        <h3 class="section-title">Form Input Transaksi</h3>

        <div class="input-group">
          <label>Jenis Transaksi</label>
          <select v-model="jenis">
            <option value="masuk">➕ Menabung (Pemasukan)</option>
            <option value="keluar">➖ Pengeluaran (Penarikan)</option>
          </select>
        </div>

        <div class="input-group">
          <label>Nominal (Rp)</label>
          <input
            type="number"
            v-model="nominal"
            placeholder="0"
          >
        </div>

        <div class="input-group">
          <label>Catatan (Opsional)</label>
          <input
            v-model="catatan"
            placeholder="Contoh: Menyisihkan uang jajan"
          >
        </div>

        <button class="btn-primary" @click="simpanTransaksi">
          Simpan Transaksi
        </button>
      </div>

      <div class="divider"></div>

      <!-- RIWAYAT TRANSAKSI -->
      <div class="list-header">
        <h3>📜 Riwayat Transaksi</h3>
        <span class="badge-count" v-if="transaksiTarget.length">{{ transaksiTarget.length }} Catatan</span>
      </div>

      <p v-if="transaksiTarget.length === 0" class="empty-history">
        Belum ada riwayat transaksi untuk target ini.
      </p>

      <div class="history-list">
        <div
          v-for="trx in transaksiTarget"
          :key="trx.id"
          class="history-card"
          :class="trx.jenis === 'masuk' ? 'border-green' : 'border-red'"
        >
          <div class="row">
            <strong :class="trx.jenis === 'masuk' ? 'text-green' : 'text-red'">
              {{ trx.jenis === 'masuk' ? '🟢 Menabung' : '🔴 Pengeluaran' }}
            </strong>
            <strong class="nominal-text">
              {{ trx.jenis === 'masuk' ? '+' : '-' }}Rp{{ trx.nominal.toLocaleString('id-ID') }}
            </strong>
          </div>

          <p class="history-catatan">{{ trx.catatan || 'Tidak ada catatan' }}</p>

          <div class="history-footer">
            <small>{{ trx.tanggal }}</small>
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
  min-height: 100vh;
  background-color: #F4F7F9;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 480px;
  padding: 24px;
  /* PADDING BAWAH DIPERBESAR SUPAYA TIDAK TERTUTUP NAVBAR */
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

/* --- GLOBAL CARDS --- */
.card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F5F9;
  margin-bottom: 24px;
}

/* --- KARTU TARGET AKTIF --- */
.active-target-card {
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  color: white;
  box-shadow: 0 12px 24px rgba(0, 97, 255, 0.2);
  border: none;
  position: relative;
  overflow: hidden;
}

.target-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
  backdrop-filter: blur(4px);
}

.target-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 12px 0;
  word-break: break-word;
}

.balance-label {
  font-size: 13px;
  opacity: 0.9;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.balance-amount-container {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  word-break: break-word;
}

.balance-amount-container .currency {
  font-size: 18px;
  font-weight: 700;
  margin-top: 3px;
  opacity: 0.8;
}

.balance-amount {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

.empty-target-card {
  text-align: center;
  padding: 30px 20px;
  border: 1px dashed #CBD5E1;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.empty-target-card h3 {
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 6px 0;
}

.empty-target-card p {
  font-size: 13px;
  color: #64748B;
  margin: 0;
}

/* --- FORM STYLES --- */
.form-card {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 18px 0;
  color: #0F172A;
}

.input-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
}

select,
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

select:focus,
input:focus {
  outline: none;
  border-color: #0061FF;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(0, 97, 255, 0.1);
}

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
  margin: 28px 0;
}

/* --- RIWAYAT TRANSAKSI --- */
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
  color: #0F172A;
}

.badge-count {
  background: #E0F2FE;
  color: #0284C7;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.empty-history {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  color: #64748B;
  font-size: 14px;
  border: 1px dashed #CBD5E1;
  margin: 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  background: #FFFFFF;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F5F9;
  border-left-width: 5px;
  transition: transform 0.2s ease;
}

.history-card:hover {
  transform: translateY(-2px);
}

.border-green {
  border-left-color: #10B981;
}

.border-red {
  border-left-color: #EF4444;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.text-green {
  color: #059669;
  font-weight: 800;
}

.text-red {
  color: #DC2626;
  font-weight: 800;
}

.nominal-text {
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
}

.history-catatan {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #475569;
  word-break: break-word;
}

.history-footer {
  display: flex;
  justify-content: flex-end;
}

small {
  color: #94A3B8;
  font-size: 12px;
  font-weight: 600;
}
</style>