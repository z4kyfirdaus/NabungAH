<script setup>
import { ref } from 'vue'
import { getData, saveData } from '../data/storage'

const data = getData()

const nama = ref(data.profile.nama)
const foto = ref(data.profile.foto)

function pilihFoto(e) {
  const file = e.target.files[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    foto.value = reader.result
  }

  reader.readAsDataURL(file)
}

function simpanProfil() {
  data.profile.nama = nama.value
  data.profile.foto = foto.value

  saveData(data)

  alert('Profil berhasil disimpan')
}

function resetData() {
  if (confirm('Yakin ingin menghapus semua data?')) {
    localStorage.clear()
    location.reload()
  }
}
</script>

<template>

<div class="page">

<h1 class="title">
⚙️ Pengaturan
</h1>

<div class="card profil">

<img
v-if="foto"
:src="foto"
class="avatar">

<div
v-else
class="avatar kosong">

{{ nama ? nama.substring(0,1).toUpperCase() : '👤' }}

</div>

<h2 class="nama">

{{ nama || 'Pengguna' }}

</h2>

<input
id="foto"

type="file"

accept="image/*"

hidden

@change="pilihFoto">

<label
for="foto"
class="upload">

📷 Ganti Foto

</label>

<input
v-model="nama"
placeholder="Nama Anda">

<button
class="simpan"
@click="simpanProfil">

Simpan Profil

</button>

</div>

<div class="card">

<div class="menu">

<div class="item">

👤 Edit Profil

</div>

<div class="item">

🌙 Tema

<span class="coming">
Segera
</span>

</div>

<div class="item">

📦 Backup Data

<span class="coming">
Segera
</span>

</div>

<div class="item">

ℹ️ Tentang NabungAH

</div>

</div>

</div>

<div class="card">

<button
class="reset"
@click="resetData">

🗑 Reset Semua Data

</button>

</div>

<p class="versi">

NabungAH v1.0.0

</p>

</div>

</template>

<style scoped>

.page{

padding:20px;
padding-bottom:90px;
background:#f5f5f5;
min-height:100vh;

}

.title{

font-size:32px;
font-weight:700;
margin-bottom:20px;

}

.card{

background:white;
border-radius:20px;
padding:22px;
margin-bottom:20px;
box-shadow:0 10px 25px rgba(0,0,0,.08);

}

.profil{

text-align:center;

}

.avatar{

width:130px;
height:130px;
border-radius:50%;
object-fit:cover;
margin:auto;
border:5px solid #22c55e;
box-shadow:0 10px 20px rgba(0,0,0,.15);

}

.kosong{

display:flex;
justify-content:center;
align-items:center;
background:#22c55e;
color:white;
font-size:50px;
font-weight:bold;

}

.nama{

margin-top:18px;
margin-bottom:20px;

}

.upload{

display:inline-block;
padding:12px 18px;
background:#22c55e;
color:white;
border-radius:12px;
font-weight:bold;
cursor:pointer;
margin-bottom:20px;

}

input{

width:100%;
padding:14px;
border-radius:12px;
border:1px solid #ddd;
font-size:16px;
box-sizing:border-box;

}

.simpan{

margin-top:18px;
width:100%;
padding:15px;
border:none;
border-radius:12px;
background:#22c55e;
color:white;
font-size:17px;
font-weight:bold;

}

.menu{

display:flex;
flex-direction:column;

}

.item{

display:flex;
justify-content:space-between;
align-items:center;
padding:18px 0;
border-bottom:1px solid #eee;
font-size:17px;

}

.item:last-child{

border-bottom:none;

}

.coming{

font-size:12px;
background:#22c55e;
color:white;
padding:4px 10px;
border-radius:20px;

}

.reset{

width:100%;
padding:15px;
background:#ef4444;
border:none;
border-radius:12px;
color:white;
font-size:17px;
font-weight:bold;

}

.versi{

text-align:center;
color:#888;
font-size:14px;
margin-top:10px;

}

</style>