<script setup>
import { ref } from 'vue'
import { getData, saveData } from '../data/storage'

const nama = ref('')
const target = ref('')
const saldo = ref('')
const deadline = ref('')
const foto = ref('')

const data = getData()

function pilihFoto(e){

  const file = e.target.files[0]

  if(!file) return

  const reader = new FileReader()

  reader.onload=()=>{

      foto.value = reader.result

  }

  reader.readAsDataURL(file)

}

function resetForm() {
  nama.value = ''
  target.value = ''
  saldo.value = ''
  deadline.value = ''
  foto.value = ''
}

function simpan() {

  if (!nama.value || !target.value || !deadline.value) {
    alert('Lengkapi data')
    return
  }

 data.targets.push({

id:Date.now(),

foto:foto.value,

nama:nama.value,

target:Number(target.value),

saldo:Number(saldo.value||0),

deadline:deadline.value,

aktif:data.targets.length===0

})

  saveData(data)

  alert('Target berhasil dibuat')

  resetForm()
}

function jadikanAktif(id){

  data.targets.forEach(item=>{
    item.aktif = item.id === id
  })

  saveData(data)

  alert("Target aktif berhasil diubah")

}

function hapusTarget(id) {

  if (!confirm("Yakin ingin menghapus target beserta semua transaksinya?")) {
    return
  }

  // Hapus target
  data.targets = data.targets.filter(item => item.id !== id)

  // Hapus transaksi milik target tersebut
  data.transaksi = data.transaksi.filter(
    trx => trx.targetId !== id
  )

  saveData(data)

  alert("Target berhasil dihapus")

}
</script>

<template>

<div class="page">

<h1>🎯 Target Tabungan</h1>

<label>Foto Target</label>

<input
type="file"
accept="image/*"
@change="pilihFoto">

<input
v-model="nama"
placeholder="Nama Target">

<input
v-model="target"
type="number"
placeholder="Nominal Target">

<input
v-model="saldo"
type="number"
placeholder="Saldo Awal">

<input
v-model="deadline"
type="date">

<button @click="simpan">
Simpan Target
</button>

<hr>

<h2 v-if="data.targets.length">
Daftar Target
</h2>

<p v-else>
Belum ada target.
</p>

<div
v-for="item in data.targets"
:key="item.id"
class="card">

<img
v-if="item.foto"
:src="item.foto"
class="foto">

<h3>🎯 {{ item.nama }}</h3>

<p>
Target
</p>

<strong>
Rp{{ item.target.toLocaleString('id-ID') }}
</strong>

<p>
Saldo
Rp{{ item.saldo.toLocaleString() }}
</p>

<p v-if="item.aktif">
✅ Target Aktif
</p>

<button
v-else
@click="jadikanAktif(item.id)">
Jadikan Aktif
</button>

<strong>
Rp{{ item.saldo.toLocaleString('id-ID') }}
</strong>

<p>
Deadline
</p>

<strong>
{{ item.deadline }}
</strong>

<button
class="hapus"
@click="hapusTarget(item.id)">
🗑 Hapus
</button>

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

input{
width:100%;
padding:14px;
margin:10px 0;
border-radius:12px;
border:1px solid #ddd;
font-size:16px;
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
cursor:pointer;
margin-top:10px;
}

.card{
margin-top:20px;
padding:18px;
background:white;
border-radius:15px;
box-shadow:0 5px 15px rgba(0,0,0,.08);
}

.card h3{
margin-bottom:15px;
}

.card p{
margin:8px 0 4px;
color:#666;
}

.hapus{
margin-top:20px;
background:#ef4444;
}

.hapus:hover{
background:#dc2626;
}

.foto{

width:100%;

max-height:220px;

object-fit:contain;

border-radius:12px;

margin-bottom:15px;
background:#f5f5f5;
}
</style>