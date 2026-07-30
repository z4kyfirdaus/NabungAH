import { auth } from '../firebase/config'

// Fungsi untuk mengambil kunci unik berdasarkan UID user yang sedang login
function getStorageKey() {
  const user = auth.currentUser
  return user ? `nabungah_data_${user.uid}` : 'nabungah_data_guest'
}

export function getData() {
  const KEY = getStorageKey()
  const data = localStorage.getItem(KEY)

  let result

  if (!data) {
    const user = auth.currentUser
    
    // Jika user baru pertama kali login, otomatis ambil nama & foto bawaan Firebase (misal dari Google)
    result = {
      profile: {
        nama: user?.displayName || "",
        foto: user?.photoURL || ""
      },
      targets: [],
      wallets: [],
      transaksi: []
    }
  } else {
    result = JSON.parse(data)

    // Tambahkan profile jika data lama belum punya
    if (!result.profile) {
      result.profile = {
        nama: "",
        foto: ""
      }
    }

    if (!result.targets) result.targets = []
    if (!result.wallets) result.wallets = []
    if (!result.transaksi) result.transaksi = []
  }

  return result
}

export function saveData(data) {
  const KEY = getStorageKey()
  localStorage.setItem(KEY, JSON.stringify(data))
}
