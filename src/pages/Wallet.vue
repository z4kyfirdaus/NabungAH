<script setup>
import { ref, onMounted, computed } from 'vue'
import { getData, saveData } from '../data/storage'
import { showAlert, showConfirm, showPrompt, showSelect } from '../utils/modal'
import { useTheme } from '../utils/theme'

const { isDarkMode } = useTheme()

const appData = getData()
const wallets = ref([])

function loadWallet() {
  if (!appData.wallets) {
    appData.wallets = []
  }
  wallets.value = appData.wallets
}

const totalSaldo = computed(() => {
  return wallets.value.reduce((total, item) => total + Number(item.saldo || 0), 0)
})

async function tambahWallet() {
  const nama = await showPrompt({
    title: 'Buat Wallet / Bank Baru',
    message: 'Masukkan Nama Wallet atau Bank (Contoh: BCA, OVO, Cash, Mandiri):',
    placeholder: 'Nama Wallet / Bank'
  })
  if (!nama) return

  const inputSaldo = await showPrompt({
    title: 'Saldo Awal',
    message: `Masukkan saldo awal untuk ${nama}:`,
    placeholder: '0',
    inputType: 'number'
  })
  if (inputSaldo === null) return
  const saldo = Number(inputSaldo) || 0

  wallets.value.push({
    id: Date.now(),
    nama,
    saldo,
    warna: "#007AFF"
  })

  saveData(appData)
  loadWallet()
  showAlert(`Wallet "${nama}" berhasil ditambahkan!`, "Berhasil", "success")
}

async function topUpSaldo() {
  if (wallets.value.length === 0) {
    showAlert("Belum ada wallet atau bank! Silakan buat wallet terlebih dahulu.", "Wallet Kosong", "warning")
    return
  }

  const walletOptions = wallets.value.map(w => ({
    label: `${w.nama} - Saldo: ${formatRupiah(w.saldo)}`,
    value: w.id
  }))

  const selectedWalletId = await showSelect({
    title: 'Top Up Saldo',
    message: 'Pilih Wallet / Bank yang ingin ditambah saldonya:',
    options: walletOptions
  })
  if (!selectedWalletId) return

  const targetWallet = wallets.value.find(w => w.id === selectedWalletId)
  if (!targetWallet) return

  const inputTambah = await showPrompt({
    title: 'Nominal Top Up',
    message: `Masukkan nominal saldo yang ingin ditambah ke ${targetWallet.nama}:`,
    placeholder: '0',
    inputType: 'number'
  })
  if (!inputTambah) return

  const nominalTambah = Number(inputTambah)
  if (isNaN(nominalTambah) || nominalTambah <= 0) {
    showAlert("Nominal top up tidak valid!", "Gagal", "error")
    return
  }

  targetWallet.saldo += nominalTambah

  if (!appData.transaksi) appData.transaksi = []
  appData.transaksi.unshift({
    id: Date.now(),
    tipe: 'topup',
    keterangan: `Top up saldo ${targetWallet.nama}`,
    jumlah: nominalTambah,
    tanggal: new Date().toLocaleDateString('id-ID')
  })

  saveData(appData)
  loadWallet()
  showAlert(`Berhasil menambahkan saldo Rp${nominalTambah.toLocaleString('id-ID')} ke ${targetWallet.nama}!`, "Top Up Sukses", "success")
}

async function tarikWallet() {
  if (wallets.value.length === 0) {
    showAlert("Belum ada wallet atau bank yang tersedia.", "Wallet Kosong", "warning")
    return
  }

  const walletOptions = wallets.value.map(w => ({
    label: `${w.nama} - Saldo: ${formatRupiah(w.saldo)}`,
    value: w.id
  }))

  const selectedWalletId = await showSelect({
    title: 'Tarik Saldo Wallet',
    message: 'Pilih Wallet / Bank yang ingin ditarik seluruh saldonya:',
    options: walletOptions
  })
  if (!selectedWalletId) return

  const targetWallet = wallets.value.find(w => w.id === selectedWalletId)
  if (!targetWallet) return

  if (targetWallet.saldo <= 0) {
    showAlert("Saldo di wallet ini sudah Rp0!", "Saldo Kosong", "warning")
    return
  }

  const jumlahDitarik = targetWallet.saldo
  const konfirmasi = await showConfirm(`Tarik seluruh saldo ${targetWallet.nama} sebesar ${formatRupiah(jumlahDitarik)}? Saldo akan menjadi Rp0.`, "Konfirmasi Tarik Saldo", "Tarik Saldo", "Batal")
  if (!konfirmasi) return

  if (!appData.transaksi) appData.transaksi = []
  appData.transaksi.unshift({
    id: Date.now(),
    tipe: 'tarik_wallet',
    keterangan: `Tarik seluruh saldo ${targetWallet.nama}`,
    jumlah: jumlahDitarik,
    tanggal: new Date().toLocaleDateString('id-ID')
  })

  targetWallet.saldo = 0

  saveData(appData)
  loadWallet()
  showAlert(`Berhasil menarik saldo dari ${targetWallet.nama}. Saldo sekarang menjadi Rp0.`, "Tarik Saldo Sukses", "success")
}

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka)
}

onMounted(() => {
  loadWallet()
})
</script>

<template>
  <div class="wallet-page" :class="{ dark: isDarkMode }">
    <div class="content-wrapper">
      
      <!-- HEADER -->
      <div class="header">
        <div class="header-title-wrapper">
          <div class="header-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0061FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <h2>Wallet Saya</h2>
        </div>
        <p>Kelola rekening bank dan e-wallet digitalmu</p>
      </div>

      <!-- KARTU TOTAL SALDO -->
      <div class="card total-card">
        <span class="total-label">Total Keseluruhan Saldo</span>
        <h2>{{ formatRupiah(totalSaldo) }}</h2>
      </div>

      <!-- TOMBOL AKSI -->
      <div class="action-buttons">
        <button class="add-btn primary" @click="tambahWallet">
          Buat Baru
        </button>
        <button class="add-btn secondary" @click="topUpSaldo">
          Top Up
        </button>
        <button class="add-btn danger" @click="tarikWallet">
          Tarik Saldo
        </button>
      </div>

      <!-- DAFTAR WALLET -->
      <div v-if="wallets.length > 0">
        <div v-for="wallet in wallets" :key="wallet.id" class="card wallet-card">
          <div class="icon" :style="{ background: wallet.warna || '#007AFF' }">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          <div class="content">
            <h3>{{ wallet.nama }}</h3>
            <p>{{ formatRupiah(wallet.saldo) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Belum ada wallet atau bank yang ditambahkan.</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

.wallet-page {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  background-color: #F4F7F9;
}

.content-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px 20px 120px 20px;
}

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

.card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
  border: 1px solid #E5E5EA;
}

.total-card {
  background: linear-gradient(135deg, #007AFF, #0056b3) !important;
  color: white !important;
  border: none !important;
  margin-bottom: 20px;
}

.total-label {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
  display: block;
  margin-bottom: 6px;
}

.total-card h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #FFFFFF !important;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.add-btn {
  flex: 1;
  padding: 14px 8px;
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.add-btn.primary {
  background: #34C759;
}

.add-btn.secondary {
  background: #007AFF;
}

.add-btn.danger {
  background: #FF9500;
}

.add-btn:active {
  opacity: 0.8;
}

.wallet-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
}

.content {
  flex: 1;
}

.content h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
}

.content p {
  margin: 0;
  color: #007AFF;
  font-weight: 800;
  font-size: 15px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #8E8E93;
  font-weight: 600;
}

/* ============ DARK MODE ============ */
.wallet-page.dark {
  background-color: #000000;
  color: #ffffff;
}

.wallet-page.dark .card,
.wallet-page.dark .wallet-card {
  background-color: #121212;
  background: #121212;
  border-color: #27272a;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.wallet-page.dark .header-icon-box {
  background: #1a1a2e;
}

.wallet-page.dark .header h2,
.wallet-page.dark .content h3 {
  color: #ffffff;
}

.wallet-page.dark .header p,
.wallet-page.dark .empty-state {
  color: #a1a1aa;
}

.wallet-page.dark .action-btn {
  background: #18181b;
  border-color: #27272a;
  color: #60a5fa;
}
</style>