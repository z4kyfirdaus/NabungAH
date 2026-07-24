const KEY = "nabungah-data"

export function getData() {

  const data = localStorage.getItem(KEY)

  let result

  if (!data) {

    result = {
      profile: {
        nama: "",
        foto: ""
      },
      targets: [],
      wallet:[],
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
    if (!result.transaksi) result.transaksi = []
if (!result.targets) result.targets = []
  }

  return result
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}