import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from '../firebase/auth';

// Import Halaman Auth
import LoginView from '../pages/auth/LoginView.vue';
import RegisterView from '../pages/auth/RegisterView.vue';
import ForgotPasswordView from '../pages/auth/ForgotPasswordView.vue';

// Import Halaman Utama
import Dashboard from '../pages/Dashboard.vue';
import Target from '../pages/Target.vue';
import Transaksi from '../pages/Transaksi.vue';
import Statistik from '../pages/Statistik.vue';
import Setting from '../pages/Setting.vue';
import Wallet from '../pages/Wallet.vue';

import AiAssistant from '../pages/AiAssistant.vue';
const routes = [
  // Redirect Halaman Utama
  { path: '/', redirect: '/dashboard' },

  // Route Autentikasi (Hanya bisa diakses jika BELUM login)
  { path: '/login', name: 'Login', component: LoginView, meta: { requiresGuest: true } },
  { path: '/register', name: 'Register', component: RegisterView, meta: { requiresGuest: true } },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView, meta: { requiresGuest: true } },

  // Route Aplikasi Utama (Hanya bisa diakses jika SUDAH login)
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/target', name: 'Target', component: Target, meta: { requiresAuth: true } },
  { path: '/transaksi', name: 'Transaksi', component: Transaksi, meta: { requiresAuth: true } },
  { path: '/statistik', name: 'Statistik', component: Statistik, meta: { requiresAuth: true } },
  { path: '/setting', name: 'Setting', component: Setting, meta: { requiresAuth: true } },
  { path: '/wallet', name: 'Wallet', component: Wallet, meta: { requiresAuth: true } },
  { 
  path: '/ai', 
  name: 'AiAssistant', 
  component: AiAssistant, 
  meta: { requiresAuth: true } 
}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Route Guard untuk memeriksa status login
router.beforeEach(async (to, from, next) => {
  try {
    const currentUser = await getCurrentUser();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

    if (requiresAuth && !currentUser) {
      next('/login');
    } else if (requiresGuest && currentUser) {
      next('/dashboard');
    } else {
      next();
    }
  } catch (error) {
    console.error("Error pada Route Guard:", error);
    next('/login');
  }
});

export default router;
