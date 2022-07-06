import config from "@/config";
import { io, Socket } from "socket.io-client";
import { reactive } from "vue";
import type { Router } from "vue-router";
import type { PlayerState } from "@/types";
import { getUserId, getUserName, getRoomCode } from "@/lib/browserStorage";

const attachPlayerEvents = (
  socket: Socket,
  state: PlayerState,
  router: Router
) => {
  socket.on("disconnect", (reason: string) => {
    const reconnectReasons = [
      "ping timeout",
      "transport close",
      "transport error",
    ];
    if (reconnectReasons.includes(reason)) return;
    router.push("/");
  });

  socket.on("error", (payload: { message: string }) => {
    alert(payload.message);
  });

  socket.on("self", (payload) => {
    state.theme = payload.theme;
    state.ui = payload.ui;
  });
};

const initializePlayerSocket = (router: Router, defaultState: PlayerState) => {
  const socket = io(config.backendUri, {
    query: {
      userId: getUserId(),
      userName: getUserName(),
      roomCode: getRoomCode(),
    },
  });

  const state = reactive(defaultState);

  attachPlayerEvents(socket, state, router);

  return { socket, state };
};

export default initializePlayerSocket;
