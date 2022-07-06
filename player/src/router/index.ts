import { createRouter, createWebHistory } from "vue-router";
import { getRoomCode } from "@/lib/browserStorage";
import roomExists from "@/lib/roomExists";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "lobby",
      component: () => import("../views/LobbyView.vue"),
    },
    {
      path: "/play",
      name: "play",
      component: () => import("../views/PlayerView.vue"),
      beforeEnter: async (to) => {
        const roomCode = getRoomCode() || "no-room-specified";
        if (!(await roomExists(roomCode))) {
          alert("That room does not exist.");
          router.push("/");
        }
      },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
