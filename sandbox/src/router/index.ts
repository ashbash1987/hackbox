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
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/:roomCode",
      name: "sandbox",
      component: () => import("../views/SandboxView.vue"),
      beforeEnter: authorizeHost,
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
