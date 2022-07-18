import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
} from "vue-router";
import { authorizedToHost } from "@/lib/rooms";
import { getUserId } from "@/lib/browserStorage";

const authorizeHost = async (to: RouteLocationNormalized) => {
  const userId = getUserId();
  const roomCode = to.params.roomCode as string;
  if (!(await authorizedToHost(userId, roomCode))) {
    alert("You are not the host of this room.");
    router.push("/");
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "lobby",
      component: () => import("../views/LobbyView.vue"),
    },
    {
      path: "/test/:roomCode",
      name: "test",
      component: () => import("../views/TestView.vue"),
      beforeEnter: authorizeHost,
    },
    {
      path: "/host/:roomCode",
      name: "host",
      component: () => import("../views/HostView.vue"),
      beforeEnter: authorizeHost,
    },
    {
      path: "/watch/:roomCode",
      name: "watch",
      component: () => import("../views/WatchView.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
