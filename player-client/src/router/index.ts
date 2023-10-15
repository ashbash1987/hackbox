import { createRouter, createWebHistory } from "vue-router";
import { getRoomCode, setTwitchAccessToken } from "@/lib/browserStorage";
import roomExists from "@/lib/getRoom";

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
    {
      path: "/twitch-auth-callback",
      name: "twitch-auth-callback",
      component: () => {},
      beforeEnter: async (to) => {
        const hash = new URLSearchParams(to.hash.substring(1));
        const accessToken = hash.get("access_token");

        if (accessToken) {
          setTwitchAccessToken(accessToken);
        }

        router.push("/");
      },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
