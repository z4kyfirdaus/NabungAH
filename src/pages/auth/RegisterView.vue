<template>
  <div class="auth-wrapper" :class="{ dark: isDarkMode }">
    <div class="auth-card">
      <div class="brand-header">
        <div class="logo-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="16" y1="11" x2="22" y2="11"/>
          </svg>
        </div>
        <h2>Buat Akun Baru</h2>
        <p>Mulai perjalanan finansialmu bersama NabungAH</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="nama@email.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Minimal 6 karakter" 
            required 
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Mendaftarkan...' : 'Daftar Akun' }}
        </button>
      </form>

      <div class="divider">
        <span>atau</span>
      </div>

      <button @click="handleGoogleLogin" class="btn-google" :disabled="loading || googleLoading">
        <svg v-if="!googleLoading" class="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        {{ googleLoading ? 'Memproses Google Login...' : 'Daftar dengan Google' }}
      </button>

      <p class="auth-footer">
        Sudah punya akun? <router-link to="/login">Masuk di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser, loginWithGoogle } from '../../firebase/auth';
import { showAlert } from '../../utils/modal';
import { useTheme } from '../../utils/theme';

const { isDarkMode } = useTheme();

const email = ref('');
const password = ref('');
const loading = ref(false);
const googleLoading = ref(false);
const router = useRouter();

const handleRegister = async () => {
  loading.value = true;
  try {
    await registerUser(email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    showAlert(error.message || 'Gagal mendaftar akun baru.', 'Pendaftaran Gagal', 'error');
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  if (googleLoading.value || loading.value) return;
  googleLoading.value = true;
  try {
    await loginWithGoogle();
    router.push('/dashboard');
  } catch (error) {
    if (
      error.code === 'auth/cancelled-popup-request' || 
      error.code === 'auth/popup-closed-by-user'
    ) {
      console.warn('Google login popup dibatalkan atau ditutup:', error.code);
    } else if (error.code === 'auth/popup-blocked') {
      showAlert('Popup diblokir oleh browser. Mohon izinkan popup untuk situs ini.', 'Popup Diblokir', 'warning');
    } else if (error.code === 'auth/unauthorized-domain') {
      showAlert('Domain ini belum diizinkan di Firebase Console (Authorized Domains).', 'Domain Tidak Diizinkan', 'error');
    } else {
      showAlert(error.message || 'Gagal daftar dengan Google', 'Gagal Pendaftaran', 'error');
    }
  } finally {
    googleLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap');

.auth-wrapper {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f9;
  padding: 20px;
}

.auth-card {
  background: #ffffff;
  width: 100%;
  max-width: 100%;
  border-radius: 20px;
  padding: 32px 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.brand-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo-badge {
  width: 56px;
  height: 56px;
  background-color: #E0F2FE;
  color: #0061FF;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.badge-icon {
  width: 28px;
  height: 28px;
}

.brand-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.brand-header p {
  margin: 6px 0 0;
  font-size: 14px;
  color: #64748b;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #0061FF;
}

.btn-primary {
  background: linear-gradient(135deg, #0061FF 0%, #38BDF8 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 10px;
  color: #94a3b8;
  font-size: 12px;
}

.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #ffffff;
  border: 1.5px solid #e2e8f0;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-google:hover {
  background-color: #f8fafc;
}

.btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  width: 18px;
  height: 18px;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: #64748b;
}

.auth-footer a {
  color: #0061FF;
  text-decoration: none;
  font-weight: 600;
}

/* ============ DARK MODE ============ */
.auth-wrapper.dark {
  background-color: #000000;
  color: #ffffff;
}

.auth-wrapper.dark .auth-card {
  background-color: #121212;
  border: 1px solid #27272a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.auth-wrapper.dark .logo-badge {
  background-color: #1a1a2e;
}

.auth-wrapper.dark .brand-header h2 {
  color: #ffffff;
}

.auth-wrapper.dark .brand-header p,
.auth-wrapper.dark .form-group label,
.auth-wrapper.dark .auth-footer {
  color: #a1a1aa;
}

.auth-wrapper.dark .form-group input {
  background-color: #18181b;
  border-color: #27272a;
  color: #ffffff;
}

.auth-wrapper.dark .form-group input:focus {
  border-color: #0061FF;
}

.auth-wrapper.dark .divider::before, 
.auth-wrapper.dark .divider::after {
  border-color: #27272a;
}

.auth-wrapper.dark .btn-google {
  background-color: #18181b;
  border-color: #27272a;
  color: #ffffff;
}

.auth-wrapper.dark .btn-google:hover {
  background-color: #27272a;
}
</style>
