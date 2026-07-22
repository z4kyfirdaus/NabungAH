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

<div class="page">

<h1>📊 Statistik</h1>

<div class="card">
<p>Total Tabungan</p>
<h2>Rp{{ totalSaldo.toLocaleString('id-ID') }}</h2>
</div>

<div class="card">
<p>Total Menabung</p>
<h2>Rp{{ totalMasuk.toLocaleString('id-ID') }}</h2>
</div>

<div class="card">
<p>Total Pengeluaran</p>
<h2>Rp{{ totalKeluar.toLocaleString('id-ID') }}</h2>
</div>

<div class="card">
<p>Jumlah Target</p>
<h2>{{ jumlahTarget }}</h2>
</div>

<div class="card">
<p>Transaksi Hari Ini</p>
<h2>{{ transaksiHariIni }}</h2>
</div>

</div>

</template>

<style scoped>

.page{
padding:20px;
padding-bottom:90px;
background:#f5f5f5;
min-height:100vh;
}

.card{
background:white;
padding:20px;
margin-bottom:18px;
border-radius:15px;
box-shadow:0 5px 15px rgba(0,0,0,.08);
}

.card p{
margin:0;
color:#666;
}

.card h2{
margin-top:10px;
color:#22c55e;
}

</style>