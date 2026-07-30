<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="brand-header">
        <div class="logo-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V7"/>
            <path d="M18 12h.01"/>
          </svg>
        </div>
        <h2>NabungAH</h2>
        <p>Masuk untuk mengelola keuanganmu</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
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
            placeholder="••••••••" 
            required 
          />
        </div>

        <div class="forgot-link">
          <router-link to="/forgot-password">Lupa Password?</router-link>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <div class="divider">
        <span>atau</span>
      </div>

      <button @click="handleGoogleLogin" class="btn-google">
        <svg class="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        Masuk dengan Google
      </button>

      <p class="auth-footer">
        Belum punya akun? <router-link to="/register">Daftar sekarang</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser, loginWithGoogle } from '../../firebase/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    await loginUser(email.value, password.value);
    router.push('/dashboard');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle();
    router.push('/dashboard');
  } catch (error) {
    alert(error.message);
  }
};
</script>

<style scoped>
.auth-wrapper {
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
  max-width: 400px;
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
  background-color: #ecfdf5;
  color: #10b981;
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
  border-color: #10b981;
}

.forgot-link {
  text-align: right;
  margin-top: -4px;
}

.forgot-link a {
  font-size: 12px;
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
}

.btn-primary {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #059669;
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
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
}
</style>
