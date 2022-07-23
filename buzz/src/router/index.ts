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

// The route should be a game ID, not a room code.
// The room should be capable of swapping to a new room, just in case.
// Uniqueness how tho. Uniqueness to the browser? Guess that works.
// Yeah that works.

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/host/:gameId",
      name: "host",
      component: () => import("../views/HostView.vue"),
      beforeEnter: authorizeHost,
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
