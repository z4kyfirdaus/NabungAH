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
    alert('Masukkan nominal terlebih dahulu')
    return
  }

  const jumlah = Number(nominal.value)

  if (jenis.value === 'masuk') {
    // Menabung: Saldo target bertambah
    targetAktif.value.saldo += jumlah
  } else {
    // Penarikan/Pengeluaran: Saldo target berkurang
    if (jumlah > targetAktif.value.saldo) {
      alert('Saldo pada target aktif tidak mencukupi')
      return
    }
    targetAktif.value.saldo -= jumlah
  }

  // Simpan ke riwayat transaksi terpusat (hanya terikat target)
  if (!data.transaksi) data.transaksi = []
  data.transaksi.unshift({
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

  alert('Transaksi berhasil disimpan!')
}

const transaksiTarget = computed(() => {
  if (!targetAktif.value || !data.transaksi) return []
  return data.transaksi.filter(item => item.targetId === targetAktif.value.id)
})
</script>

<template>
  <div class="page clean-theme">
    <div class="content-wrapper">
      
      <!-- HEADER -->
      <div class="header">
        <div class="header-title-wrapper">
          <div class="header-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h2>Transaksi Keuangan</h2>
        </div>
        <p>Catat pemasukan atau pengeluaran tabungan targetmu</p>
      </div>

      <!-- KARTU TARGET AKTIF -->
      <div v-if="targetAktif" class="card active-target-card">
        <div class="target-badge">Target Aktif</div>
        <h3 class="target-title">Target: {{ targetAktif.nama }}</h3>
        <p class="balance-label">Saldo Saat Ini</p>
        <div class="balance-amount-container">
          <span class="currency">Rp</span>
          <h2 class="balance-amount">{{ targetAktif.saldo.toLocaleString('id-ID') }}</h2>
        </div>
      </div>

      <div v-else class="card empty-target-card">
        <div class="empty-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        </div>
        <h3>Belum Ada Target Aktif</h3>
        <p>Silakan aktifkan salah satu target terlebih dahulu pada menu Target.</p>
      </div>

      <!-- FORM TRANSAKSI -->
      <div class="card form-card">
        <h3 class="section-title">Form Input Transaksi</h3>

        <div class="input-group">
          <label>Jenis Transaksi</label>
          <select v-model="jenis">
            <option value="masuk">Menabung (Pemasukan ke Target)</option>
            <option value="keluar">Pengeluaran (Penarikan dari Target)</option>
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
            placeholder="Contoh: Menyisihkan uang saku harian"
          >
        </div>

        <button class="btn-primary" @click="simpanTransaksi">
          Simpan Transaksi
        </button>
      </div>

      <div class="divider"></div>

      <!-- RIWAYAT TRANSAKSI -->
      <div class="list-header">
        <h3>Riwayat Transaksi Target</h3>
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
            <div class="history-type-info">
              <div class="trx-icon-box" :class="trx.jenis === 'masuk' ? 'bg-green-soft' : 'bg-red-soft'">
                <svg v-if="trx.jenis === 'masuk'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              </div>
              <strong :class="trx.jenis === 'masuk' ? 'text-green' : 'text-red'">
                {{ trx.jenis === 'masuk' ? 'Menabung' : 'Penarikan' }}
              </strong>
            </div>
            <strong class="nominal-text">
              {{ trx.jenis === 'masuk' ? '+' : '-' }}Rp{{ Number(trx.nominal || 0).toLocaleString('id-ID') }}
            </strong>
          </div>

          <div class="history-details">
            <p class="history-catatan">{{ trx.catatan || 'Tidak ada catatan' }}</p>
          </div>

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
  color: #FFFFFF;
}

.empty-target-card {
  text-align: center;
  padding: 30px 20px;
  border: 1px dashed #CBD5E1;
}

.empty-icon-box {
  width: 50px;
  height: 50px;
  background: #FEF3C7;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 12px auto;
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
  margin-bottom: 10px;
}

.history-type-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trx-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-green-soft { background: #DCFCE7; }
.bg-red-soft { background: #FEE2E2; }

.text-green {
  color: #059669;
  font-weight: 800;
  font-size: 14px;
}

.text-red {
  color: #DC2626;
  font-weight: 800;
  font-size: 14px;
}

.nominal-text {
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
}

.history-details {
  background: #F8FAFC;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.history-catatan {
  margin: 0;
  font-size: 13px;
  color: #64748B;
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