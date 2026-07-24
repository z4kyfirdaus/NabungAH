<template>
  <nav class="bottom-nav">
    <div class="nav-container">
      
      <!-- Beranda -->
      <router-link to="/" class="nav-item" title="Beranda">
        <div class="nav-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
      </router-link>

      <!-- Target -->
      <router-link to="/target" class="nav-item" title="Target">
        <div class="nav-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        </div>
      </router-link>

      <!-- Transaksi -->
      <router-link to="/transaksi" class="nav-item" title="Transaksi">
        <div class="nav-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </router-link>

      <!-- Statistik -->
      <router-link to="/statistik" class="nav-item" title="Statistik">
        <div class="nav-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
        </div>
      </router-link>

      <!-- Wallet -->
      <router-link to="/wallet" class="nav-item" title="Wallet">
        <div class="nav-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
      </router-link>

      <!-- Pengaturan -->
      <router-link to="/setting" class="nav-item" title="Pengaturan">
        <div class="nav-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
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
  height: 78px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFFFFF; /* Putih biasa rata */
  border-top: 1px solid #E2E8F0;
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.04);
  z-index: 1000;
  font-family: 'Nunito', sans-serif;
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  max-width: 480px;
  padding: 0 12px;
}

.nav-item {
  text-decoration: none;
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748B;
  position: relative;
}

.nav-icon-box {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.nav-item:active {
  transform: scale(0.9);
}

/* --- KETIKA MENU DIPILIH: WARNA BIRU MEMBENTUK LENGKUNGAN SEPERTI GUNUNG/U --- */
.router-link-active {
  background: linear-gradient(135deg, #0061FF 0%, #38BDF8 100%);
  color: #FFFFFF !important;
  box-shadow: 0 8px 20px rgba(0, 97, 255, 0.35);
  transform: translateY(-10px);
  /* Membuat bentuk border melengkung indah seperti kubah/gunung */
  border-radius: 50px 50px 18px 18px; 
  height: 52px;
}

.router-link-active .nav-icon-box {
  transform: scale(1.15);
}
</style>