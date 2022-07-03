import { createRouter, createWebHistory } from 'vue-router'
import { getRoomCode } from '@/lib/browserStorage'
import roomExists from '@/lib/roomExists';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'lobby',
      component: () => import('../views/LobbyView.vue')
    },
  ]
})

export default router
