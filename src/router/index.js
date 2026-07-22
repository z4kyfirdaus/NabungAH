import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../pages/Dashboard.vue'
import Target from '../pages/Target.vue'
import Transaksi from '../pages/Transaksi.vue'
import Statistik from '../pages/Statistik.vue'
import Setting from '../pages/Setting.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Dashboard
    },
    {
      path: '/target',
      component: Target
    },
    {
      path: '/transaksi',
      component: Transaksi
    },
    {
      path: '/statistik',
      component: Statistik
    },
    {
      path: '/setting',
      component: Setting
    }
  ]
})

export default router