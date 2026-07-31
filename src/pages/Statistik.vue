<script setup>
import { computed } from 'vue'
import { getData } from '../data/storage'
import { useTheme } from '../utils/theme'

const { isDarkMode } = useTheme()
const data = getData()

const totalMasuk = computed(() => {
  if (!data.transaksi) return 0
  return data.transaksi
    .filter(t => t.tipe === 'tabung' || t.tipe === 'topup')
    .reduce((a, b) => a + Number(b.jumlah || 0), 0)
})

const totalKeluar = computed(() => {
  if (!data.transaksi) return 0
  return data.transaksi
    .filter(t => t.tipe === 'tarik' || t.tipe === 'tarik_wallet')
    .reduce((a, b) => a + Number(b.jumlah || 0), 0)
})

const totalSaldo = computed(() => {
  if (!data.targets) return 0
  return data.targets.reduce((a, b) => a + Number(b.saldo || 0), 0)
})

const jumlahTarget = computed(() => {
  return data.targets ? data.targets.length : 0
})

const transaksiHariIni = computed(() => {
  if (!data.transaksi) return 0
  const hariIni = new Date().toLocaleDateString('id-ID')
  return data.transaksi.filter(t => t.tanggal === hariIni).length
})
</script>

<template>
  <div class="page clean-theme" :class="{ dark: isDarkMode }">
    <div class="content-wrapper">
      
      <!-- HEADER -->
      <div class="header">
  <div class="header-title-wrapper">
    <div class="header-icon-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
    </div>
    <h2>Statistik Keuangan</h2>
  </div>
  <p>Ringkasan, analitik, dan riwayat aliran dana secara transparan</p>
</div>

      <!-- KARTU UTAMA (TOTAL TABUNGAN) -->
      <div class="card main-stat-card">
        <p class="stat-label-light">Total Seluruh Tabungan</p>
        <div class="stat-amount-container">
          <span class="currency">Rp</span>
          <h2 class="stat-amount-light">{{ totalSaldo.toLocaleString('id-ID') }}</h2>
        </div>
      </div>

      <!-- GRID STATISTIK LAINNYA -->
      <div class="stats-grid">
        
        <!-- Total Pemasukan / Menabung -->
        <div class="card stat-item-card">
          <div class="icon-box green-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <p class="stat-label">Total Masuk & Top Up</p>
          <h2 class="stat-value text-green">Rp{{ totalMasuk.toLocaleString('id-ID') }}</h2>
        </div>

        <!-- Total Penarikan / Pengeluaran -->
        <div class="card stat-item-card">
          <div class="icon-box red-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </div>
          <p class="stat-label">Total Penarikan Dana</p>
          <h2 class="stat-value text-red">Rp{{ totalKeluar.toLocaleString('id-ID') }}</h2>
        </div>

        <!-- Jumlah Target -->
        <div class="card stat-item-card">
          <div class="icon-box blue-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <p class="stat-label">Jumlah Target</p>
          <h2 class="stat-value text-blue">{{ jumlahTarget }} Target</h2>
        </div>

        <!-- Transaksi Hari Ini -->
        <div class="card stat-item-card">
          <div class="icon-box purple-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          </div>
          <p class="stat-label">Transaksi Hari Ini</p>
          <h2 class="stat-value text-purple">{{ transaksiHariIni }} Aktivitas</h2>
        </div>

      </div>

      <!-- RIWAYAT ALIRAN DANA & WALLET TERKAIT -->
      <div class="history-section">
        <h3 class="section-title">Riwayat Aliran & Penarikan Saldo</h3>

        <div v-if="data.transaksi && data.transaksi.length > 0" class="history-list">
          <div v-for="trx in data.transaksi" :key="trx.id" class="card history-card">
            <div class="history-left">
              <div class="history-icon" :class="trx.tipe === 'tabung' || trx.tipe === 'topup' ? 'bg-green-soft' : 'bg-red-soft'">
                <svg v-if="trx.tipe === 'tabung' || trx.tipe === 'topup'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="19" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
              </div>
              <div>
                <h4 class="history-title">{{ trx.keterangan }}</h4>
                <p class="history-date">{{ trx.tanggal }}</p>
              </div>
            </div>
            <div class="history-right" :class="trx.tipe === 'tabung' || trx.tipe === 'topup' ? 'text-green' : 'text-red'">
              {{ trx.tipe === 'tabung' || trx.tipe === 'topup' ? '+' : '-' }}Rp{{ Number(trx.jumlah || 0).toLocaleString('id-ID') }}
            </div>
          </div>
        </div>

        <div v-else class="card empty-history">
          <p>Belum ada riwayat aliran dana atau penarikan tercatat.</p>
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
  max-width: 100%;
  padding: 24px;
  padding-bottom: 140px; 
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
  padding: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F5F9;
}

/* --- KARTU UTAMA --- */
.main-stat-card {
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  color: white;
  box-shadow: 0 12px 24px rgba(0, 97, 255, 0.2);
  border: none;
  margin-bottom: 20px;
  padding: 24px;
}

.stat-label-light {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
}

.stat-amount-container {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  word-break: break-word;
}

.stat-amount-container .currency {
  font-size: 18px;
  font-weight: 700;
  margin-top: 3px;
  opacity: 0.8;
}

.stat-amount-light {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
  color: #FFFFFF;
}

/* --- GRID STATISTIK Kecil --- */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.stat-item-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.green-bg { background: #DCFCE7; }
.red-bg { background: #FEE2E2; }
.blue-bg { background: #E0F2FE; }
.purple-bg { background: #F3E8FF; }

.stat-label {
  margin: 0 0 6px 0;
  color: #64748B;
  font-size: 13px;
  font-weight: 700;
}

.stat-value {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  word-break: break-word;
  line-height: 1.2;
}

.text-green { color: #059669; }
.text-red { color: #DC2626; }
.text-blue { color: #0061FF; }
.text-purple { color: #7C3AED; }

/* --- RIWAYAT SECTION --- */
.section-title {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 16px 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.history-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.bg-green-soft { background: #DCFCE7; }
.bg-red-soft { background: #FEE2E2; }

.history-title {
  font-size: 14px;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 2px 0;
  word-break: break-word;
}

.history-date {
  font-size: 12px;
  color: #94A3B8;
  margin: 0;
  font-weight: 600;
}

.history-right {
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
}

.empty-history {
  text-align: center;
  color: #64748B;
  font-size: 14px;
  font-weight: 600;
  padding: 30px;
}

/* ============ DARK MODE ============ */
.page.dark {
  background-color: #000000;
  color: #ffffff;
}

.page.dark .card,
.page.dark .stat-item-card,
.page.dark .history-card,
.page.dark .empty-history {
  background-color: #121212;
  background: #121212;
  border-color: #27272a;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.page.dark .main-stat-card {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
}

.page.dark .header-icon-box {
  background: #1a1a2e;
}

.page.dark .header h2,
.page.dark .section-title,
.page.dark .history-title {
  color: #ffffff;
}

.page.dark .header p,
.page.dark .stat-label,
.page.dark .history-date {
  color: #a1a1aa;
}

.page.dark .icon-box.green-bg,
.page.dark .history-icon.bg-green-soft {
  background-color: #064e3b;
}

.page.dark .icon-box.red-bg,
.page.dark .history-icon.bg-red-soft {
  background-color: #7f1d1d;
}

.page.dark .icon-box.blue-bg {
  background-color: #1e3a8a;
}

.page.dark .icon-box.purple-bg {
  background-color: #4c1d95;
}
</style>