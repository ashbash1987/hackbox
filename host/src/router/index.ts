import { createRouter, createWebHistory } from 'vue-router'
import { authorizedToHost } from '@/lib/rooms';
import { getUserId } from '@/lib/browserStorage';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'lobby',
      component: () => import('../views/LobbyView.vue')
    },
    {
      path: '/:roomCode',
      name: 'room',
      component: () => import('../views/HostView.vue'),
      beforeEnter: async (to) => {
        const userId = getUserId();
        const roomCode = to.params.roomCode as string;
        if (!(await authorizedToHost(userId, roomCode))) {
          alert("You are not the host of this room.");
          router.push('/');
        }
      }
    },
  ],
})

export default router
