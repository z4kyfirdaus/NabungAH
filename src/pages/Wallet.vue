<template>

<div class="wallet-page">

<h1>💼 Wallet Saya</h1>

<div class="total-card">

<small>Total Saldo</small>

<h2>{{ formatRupiah(totalSaldo) }}</h2>

</div>

<button
class="add-btn"
@click="tambahWallet">

+ Tambah Wallet

</button>

<div
v-for="wallet in wallets"
:key="wallet.id"
class="wallet-card">

<div
class="icon"
:style="{background:wallet.warna}">

{{wallet.icon}}

</div>

<div class="content">

<h3>{{wallet.nama}}</h3>

<p>{{formatRupiah(wallet.saldo)}}</p>

</div>

</div>

</div>

</template>

<script setup>

import { ref,onMounted,computed } from "vue"

import { getWallet,addWallet } from "../utils/wallet"

const wallets = ref([])

function loadWallet(){

wallets.value = getWallet()

}

const totalSaldo = computed(()=>{

return wallets.value.reduce(

(total,item)=>total+item.saldo,

0

)

})

function tambahWallet(){

const nama = prompt("Nama Wallet")

if(!nama) return

const saldo = prompt("Saldo Awal")

addWallet({

nama,

saldo,

icon:"💵",

warna:"#3b82f6"

})

loadWallet()

}

function formatRupiah(angka){

return new Intl.NumberFormat(

"id-ID",

{

style:"currency",

currency:"IDR",

minimumFractionDigits:0

}

).format(angka)

}

onMounted(()=>{

loadWallet()

})

</script>

<style scoped>

.wallet-page{

padding:20px;

padding-bottom:100px;

background:#f5f7fb;

min-height:100vh;

}

.total-card{

background:#2563eb;

color:white;

padding:20px;

border-radius:15px;

margin-bottom:20px;

}

.add-btn{

width:100%;

padding:15px;

border:none;

border-radius:15px;

background:#22c55e;

color:white;

font-size:16px;

margin-bottom:20px;

}

.wallet-card{

display:flex;

align-items:center;

gap:15px;

padding:15px;

border-radius:15px;

background:white;

margin-bottom:15px;

box-shadow:0 4px 10px rgba(0,0,0,.08);

}

.icon{

width:50px;

height:50px;

display:flex;

justify-content:center;

align-items:center;

border-radius:50%;

font-size:24px;

color:white;

}

.content{

flex:1;

}

.content h3{

margin:0;

}

.content p{

margin-top:5px;

color:#2563eb;

font-weight:bold;

}

</style>