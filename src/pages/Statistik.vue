<script setup>
import { computed } from 'vue'
import { getData } from '../data/storage'

const data = getData()

const totalMasuk = computed(() =>
  data.transaksi
    .filter(t => t.jenis === 'masuk')
    .reduce((a, b) => a + b.nominal, 0)
)

const totalKeluar = computed(() =>
  data.transaksi
    .filter(t => t.jenis === 'keluar')
    .reduce((a, b) => a + b.nominal, 0)
)

const totalSaldo = computed(() =>
  data.targets.reduce((a, b) => a + b.saldo, 0)
)

const jumlahTarget = computed(() =>
  data.targets.length
)

const transaksiHariIni = computed(() => {

  const hariIni = new Date().toLocaleDateString('id-ID')

  return data.transaksi.filter(
    t => t.tanggal === hariIni
  ).length

})
</script>

<template>
  <div class="page clean-theme">
    
    <div class="content-wrapper">
      
      <!-- HEADER -->
      <div class="header">
        <h2>📊 Statistik Keuangan</h2>
        <p>Ringkasan dan analitik seluruh aktivitas menabungmu</p>
      </div>

      <!-- KARTU UTAMA (TOTAL TABUNGAN) -->
      <div class="card main-stat-card">
        <p class="stat-label-light">Total Seluruh Tabungan</p>
        <div class="stat-amount-container">
          <span class="currency">Rp</span>
          <h2 class="stat-amount-light">{{ totalSaldo.toLocaleString('id-ID') }}</h2>
        </div>
      </div>

      <!-- GRID STATISTIK LAINNYA (BENTO STYLE) -->
      <div class="stats-grid">
        
        <!-- Total Menabung -->
        <div class="card stat-item-card">
          <div class="icon-box green-bg">📥</div>
          <p class="stat-label">Total Menabung</p>
          <h2 class="stat-value text-green">Rp{{ totalMasuk.toLocaleString('id-ID') }}</h2>
        </div>

        <!-- Total Pengeluaran -->
        <div class="card stat-item-card">
          <div class="icon-box red-bg">📤</div>
          <p class="stat-label">Total Pengeluaran</p>
          <h2 class="stat-value text-red">Rp{{ totalKeluar.toLocaleString('id-ID') }}</h2>
        </div>

        <!-- Jumlah Target -->
        <div class="card stat-item-card">
          <div class="icon-box blue-bg">🎯</div>
          <p class="stat-label">Jumlah Target</p>
          <h2 class="stat-value text-blue">{{ jumlahTarget }}</h2>
        </div>

        <!-- Transaksi Hari Ini -->
        <div class="card stat-item-card">
          <div class="icon-box purple-bg">📅</div>
          <p class="stat-label">Transaksi Hari Ini</p>
          <h2 class="stat-value text-purple">{{ transaksiHariIni }}</h2>
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
  /* Padding bawah diperbesar agar aman tidak tertutup navbar */
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
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.03);
  border: 1px solid #F1F5F9;
}

/* --- KARTU UTAMA (TOTAL TABUNGAN) --- */
.main-stat-card {
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  color: white;
  box-shadow: 0 12px 24px rgba(0, 97, 255, 0.2);
  border: none;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
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
}

/* --- GRID STATISTIK KECIL --- */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-item-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
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
  font-size: 18px;
  font-weight: 800;
  word-break: break-word;
  line-height: 1.2;
}

/* WARNA TEKS MASING-MASING KARTU */
.text-green { color: #059669; }
.text-red { color: #DC2626; }
.text-blue { color: #0061FF; }
.text-purple { color: #7C3AED; }
</style>