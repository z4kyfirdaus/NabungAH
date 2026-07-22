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

<div class="page">

<h1>💸 Transaksi</h1>

<div
v-if="targetAktif"
class="card">

<h3>{{ targetAktif.nama }}</h3>

<p>

Saldo Saat Ini

</p>

<h2>

Rp{{ targetAktif.saldo.toLocaleString('id-ID') }}

</h2>

</div>

<div v-else class="card">

Belum ada target aktif.

</div>

<select v-model="jenis">

<option value="masuk">

➕ Menabung

</option>

<option value="keluar">

➖ Pengeluaran

</option>

</select>

<input
type="number"
v-model="nominal"
placeholder="Nominal">

<input
v-model="catatan"
placeholder="Catatan">

<button
@click="simpanTransaksi">

Simpan Transaksi

</button>

<hr>

<h2>📜 Riwayat Transaksi</h2>

<p v-if="data.transaksi.length === 0">
Belum ada transaksi.
</p>

<div
  v-for="trx in transaksiTarget"
  :key="trx.id"
  class="history">

  <div class="row">

    <strong>
      {{ trx.jenis === 'masuk' ? '🟢 Menabung' : '🔴 Pengeluaran' }}
    </strong>

    <strong>
      Rp{{ trx.nominal.toLocaleString('id-ID') }}
    </strong>

  </div>

  <p>{{ trx.catatan || '-' }}</p>

  <small>{{ trx.tanggal }}</small>

</div>

</div>

</template>

<style scoped>

.page{
padding:20px;
padding-bottom:90px;
}

.card{
background:white;
padding:20px;
border-radius:15px;
margin-bottom:20px;
box-shadow:0 5px 15px rgba(0,0,0,.08);
}

select,
input{

width:100%;
padding:14px;
margin:10px 0;
border-radius:12px;
border:1px solid #ddd;
box-sizing:border-box;

}

button{

width:100%;
padding:15px;
background:#22c55e;
color:white;
border:none;
border-radius:12px;
font-size:17px;

}

.history{

background:white;
padding:15px;
margin-top:15px;
border-radius:15px;

box-shadow:0 5px 10px rgba(0,0,0,.08);

}

.row{

display:flex;

justify-content:space-between;

margin-bottom:8px;

}

small{

color:gray;

}
</style>