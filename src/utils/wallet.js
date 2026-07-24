import { getData, saveData } from "../data/storage"

// Mengambil semua wallet
export function getWallet() {
  const data = getData()
  return data.wallet
}

// Menambahkan wallet baru
export function addWallet(wallet) {
  const data = getData()

  data.wallet.push({
    id: Date.now(),
    nama: wallet.nama,
    saldo: Number(wallet.saldo),
    icon: wallet.icon,
    warna: wallet.warna
  })

  saveData(data)
}

// Menghapus wallet
export function deleteWallet(id) {
  const data = getData()

  data.wallet = data.wallet.filter(item => item.id !== id)

  saveData(data)
}

// Mengupdate wallet
export function updateWallet(walletBaru) {
  const data = getData()

  const index = data.wallet.findIndex(
    item => item.id === walletBaru.id
  )

  if (index !== -1) {
    data.wallet[index] = walletBaru
    saveData(data)
  }
}