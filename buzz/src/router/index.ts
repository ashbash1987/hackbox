import { createRouter, createWebHistory } from "vue-router";

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
      path: "/:gameId",
      name: "host",
      component: () => import("../views/HostView.vue"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
