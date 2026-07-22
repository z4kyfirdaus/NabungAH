<template>
  <nav class="bottom-nav">

    <router-link to="/">🏠</router-link>

    <router-link to="/target">🎯</router-link>

    <router-link to="/transaksi">💸</router-link>

    <router-link to="/statistik">📊</router-link>

    <router-link to="/setting">⚙️</router-link>

  </nav>
</template>

<style scoped>

.bottom-nav{

position:fixed;

bottom:0;

left:0;

width:100%;

height:65px;

display:flex;

justify-content:space-around;

align-items:center;

background:white;

box-shadow:0 -3px 10px rgba(0,0,0,.1);

}

a{

text-decoration:none;

font-size:25px;

}

.router-link-active{

color:#22c55e;

}

</style>