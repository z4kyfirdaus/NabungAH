<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      <router-link to="/" class="nav-item" title="Beranda">
        <span class="nav-icon">🏠</span>
      </router-link>

      <router-link to="/target" class="nav-item" title="Target">
        <span class="nav-icon">🎯</span>
      </router-link>

      <router-link to="/transaksi" class="nav-item" title="Transaksi">
        <span class="nav-icon">💸</span>
      </router-link>

      <router-link to="/statistik" class="nav-item" title="Statistik">
        <span class="nav-icon">📊</span>
      </router-link>

      <router-link to="/setting" class="nav-item" title="Pengaturan">
        <span class="nav-icon">⚙️</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(241, 245, 249, 0.8);
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  font-family: 'Nunito', sans-serif;
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 480px;
  padding: 0 16px;
}

.nav-item {
  text-decoration: none;
  font-size: 22px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-item:active {
  transform: scale(0.9);
}

/* --- KETIKA MENU DIPILIH (AKTIF) --- */
.router-link-active {
  background: linear-gradient(135deg, #0061FF 0%, #60EFFF 100%);
  box-shadow: 0 6px 16px rgba(0, 97, 255, 0.3);
  transform: translateY(-4px);
}

/* Memperjelas warna ikon saat aktif */
.router-link-active .nav-icon {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
}
</style>