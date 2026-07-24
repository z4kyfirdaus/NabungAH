<script setup>
import { ref, onMounted, computed } from 'vue'
import { getData, saveData } from '../data/storage'

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

function tambahWallet() {
  const nama = prompt("Masukkan Nama Wallet / Bank (Contoh: BCA, OVO, Cash):")
  if (!nama) return

  const inputSaldo = prompt("Masukkan Saldo Awal:")
  const saldo = Number(inputSaldo) || 0

  wallets.value.push({
    id: Date.now(),
    nama,
    saldo,
    warna: "#007AFF"
  })

  saveData(appData)
  loadWallet()
}

function topUpSaldo() {
  if (wallets.value.length === 0) {
    alert("Belum ada wallet atau bank! Silakan buat wallet terlebih dahulu.")
    return
  }

  let listWarta = "Pilih Wallet / Bank untuk ditambah saldonya:\n"
  wallets.value.forEach((w, index) => {
    listWarta += `${index + 1}. ${w.nama} (Saldo: ${formatRupiah(w.saldo)})\n`
  })

  const pilihan = prompt(listWarta + "\nMasukkan nomor pilihan wallet:")
  if (!pilihan) return

  const indexWallet = Number(pilihan) - 1
  if (isNaN(indexWallet) || !wallets.value[indexWallet]) {
    alert("Pilihan tidak valid!")
    return
  }

  const inputTambah = prompt(`Masukkan jumlah nominal yang ingin ditambahkan ke ${wallets.value[indexWallet].nama}:`)
  const nominalTambah = Number(inputTambah)

  if (isNaN(nominalTambah) || nominalTambah <= 0) {
    alert("Nominal tidak valid!")
    return
  }

  wallets.value[indexWallet].saldo += nominalTambah

  if (!appData.transaksi) appData.transaksi = []
  appData.transaksi.unshift({
    id: Date.now(),
    tipe: 'topup',
    keterangan: `Top up saldo ${wallets.value[indexWallet].nama}`,
    jumlah: nominalTambah,
    tanggal: new Date().toLocaleDateString('id-ID')
  })

  saveData(appData)
  loadWallet()
  alert(`Berhasil menambahkan saldo ke ${wallets.value[indexWallet].nama}!`)
}

function tarikWallet() {
  if (wallets.value.length === 0) {
    alert("Belum ada wallet atau bank yang tersedia.")
    return
  }

  let listWarta = "Pilih Wallet / Bank yang ingin ditarik seluruh saldonya:\n"
  wallets.value.forEach((w, index) => {
    listWarta += `${index + 1}. ${w.nama} (Saldo: ${formatRupiah(w.saldo)})\n`
  })

  const pilihan = prompt(listWarta + "\nMasukkan nomor pilihan wallet:")
  if (!pilihan) return

  const indexWallet = Number(pilihan) - 1
  if (isNaN(indexWallet) || !wallets.value[indexWallet]) {
    alert("Pilihan tidak valid!")
    return
  }

  const targetWallet = wallets.value[indexWallet]
  if (targetWallet.saldo <= 0) {
    alert("Saldo di wallet ini sudah 0!")
    return
  }

  const jumlahDitarik = targetWallet.saldo
  const konfirmasi = confirm(`Tarik seluruh saldo ${targetWallet.nama} sebesar ${formatRupiah(jumlahDitarik)}? Saldo akan menjadi Rp0.`)
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
  alert(`Berhasil menarik saldo dari ${targetWallet.nama}. Saldo sekarang menjadi Rp0.`)
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
  <div class="wallet-page">
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
  max-width: 480px;
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
</style>e