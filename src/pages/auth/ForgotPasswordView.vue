<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="brand-header">
        <div class="logo-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="7.5" cy="15.5" r="5.5"/>
            <path d="m21 2-9.6 9.6"/>
            <path d="m15.5 7.5 3 3"/>
          </svg>
        </div>
        <h2>Lupa Password?</h2>
        <p>Kami akan mengirimkan link reset ke email kamu</p>
      </div>

      <form @submit.prevent="handleReset" class="auth-form">
        <div class="form-group">
          <label>Email Terdaftar</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="nama@email.com" 
            required 
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Mengirim...' : 'Kirim Link Reset' }}
        </button>
      </form>

      <p class="auth-footer">
        Ingat password kamu? <router-link to="/login">Kembali ke Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { resetPassword } from '../../firebase/auth';

const email = ref('');
const loading = ref(false);

const handleReset = async () => {
  loading.value = true;
  try {
    await resetPassword(email.value);
    alert('Email pemulihan password telah dikirim! Silakan periksa kotak masuk email kamu.');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
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
