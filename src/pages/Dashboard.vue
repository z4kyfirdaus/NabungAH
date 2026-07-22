<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getData } from '../data/storage'
import { cekNotifikasi } from '../utils/notification'

const data = getData()

const router = useRouter()

const notif = computed(()=>{
    return cekNotifikasi(data)
})

function tambahTarget() {
  router.push('/target')
}

const totalTabungan = computed(() => {
  return data.targets.reduce((total, item) => total + item.saldo, 0)
})

const targetAktif = computed(() => {
  return data.targets.find(item => item.aktif) || null
})

const progress = computed(() => {
  if (!targetAktif.value) return 0

  return Math.min(
    100,
    Math.round(
      (targetAktif.value.saldo / targetAktif.value.target) * 100
    )
  )
})

const sisa = computed(() => {
  if (!targetAktif.value) return 0

  return targetAktif.value.target - targetAktif.value.saldo
})

const perHari = computed(() => {

  if (!targetAktif.value) return 0

  const sekarang = new Date()

  const deadline = new Date(targetAktif.value.deadline)

  const hari = Math.ceil(
    (deadline - sekarang) / (1000 * 60 * 60 * 24)
  )

  if (hari <= 0)
    return sisa.value

  return Math.ceil(sisa.value / hari)
})

function hapusTarget(id) {
  const index = data.targets.findIndex(item => item.id === id)

  if (index !== -1) {
    data.targets.splice(index, 1)
    saveData(data)
  }
}
</script>

<template>
  <div class="dashboard">
    
<div class="header">

<img
v-if="data.profile.foto"
:src="data.profile.foto"
class="avatar">

<div
v-else
class="avatar kosong">

{{ data.profile.nama
? data.profile.nama.substring(0,1).toUpperCase()
: '👤' }}

</div>

<div>

<h2>

Halo,
{{ data.profile.nama || 'Pengguna' }}

👋

</h2>

<p>

Selamat datang di NabungAH

</p>

</div>

</div>

    <h1>💰 NabungAH</h1>
    
<div
v-if="notif"
class="notif"
:class="notif.tipe">

{{ notif.pesan }}

</div>

    <div class="card">
      <p>Total Tabungan</p>

      <h2>
        Rp{{ totalTabungan.toLocaleString('id-ID') }}
      </h2>
    </div>

    <div class="card">

      <p>Target Aktif</p>

      <template v-if="targetAktif">

        <h3>{{ targetAktif.nama }}</h3>

        <p>
          Target :
          Rp{{ targetAktif.target.toLocaleString('id-ID') }}
        </p>

        <p>
          Saldo :
          Rp{{ targetAktif.saldo.toLocaleString('id-ID') }}
        </p>

        <p>
          Deadline :
          {{ targetAktif.deadline }}
        </p>
        
        <p>
  Harus Nabung / Hari
</p>

<h3>
  Rp{{ perHari.toLocaleString('id-ID') }}
</h3>

<div class="progress">

  <div
    class="fill"
    :style="{ width: progress + '%' }">
  </div>

</div>

<p>Progress {{ progress }}%</p>

<p>
  Sisa :
  Rp{{ sisa.toLocaleString('id-ID') }}
</p>

      </template>

      <template v-else>

        <h3>Belum Ada Target</h3>

      </template>

    </div>

    <button @click="tambahTarget">
      + Tambah Target
    </button>

  </div>
</template>

<style scoped>

.dashboard{
  padding:20px;
  padding-bottom:90px;
  background:#f5f5f5;
  min-height:100vh;
}

h1{
  text-align:center;
  color:#22c55e;
  margin-bottom:25px;
}

.card{
  background:white;
  padding:20px;
  border-radius:15px;
  margin-bottom:20px;
  box-shadow:0 5px 15px rgba(0,0,0,.08);
}

.card p{
  margin:8px 0;
}

.card h2{
  margin-top:10px;
  font-size:34px;
}

.card h3{
  margin-top:10px;
}

button{
  width:100%;
  padding:15px;
  border:none;
  border-radius:12px;
  background:#22c55e;
  color:white;
  font-size:18px;
  cursor:pointer;
}

button:hover{
  background:#16a34a;
}

.progress{
  width:100%;
  height:12px;
  background:#ddd;
  border-radius:50px;
  overflow:hidden;
  margin:15px 0;
}

.fill{
  height:100%;
  background:#22c55e;
  transition:.3s;
}

.notif{

padding:15px;

border-radius:12px;

margin-bottom:20px;

font-weight:bold;

}

.info{

background:#dbeafe;

color:#1d4ed8;

}

.warning{

background:#fef3c7;

color:#92400e;

}

.success{

background:#dcfce7;

color:#166534;

}

.header{

display:flex;

align-items:center;

gap:15px;

margin-bottom:25px;

}

.avatar{

width:60px;

height:60px;

border-radius:50%;

object-fit:cover;

background:#22c55e;

color:white;

display:flex;

justify-content:center;

align-items:center;

font-size:28px;

font-weight:bold;

}
</style>