import { io, Socket } from "socket.io-client";
import { reactive } from "vue";
import type { Router } from "vue-router";
import { getUserId } from "@/lib/browserStorage";
import type { HostState } from "@/types";
import config from "@/config";

const attachHostEvents = (socket: Socket, state: HostState, router: Router) => {
  socket.on("msg", (payload) => {
    state.messages.push(payload);
  });

  socket.on("players", (payload) => {
    state.players = payload.players;
  });

  socket.on("disconnect", (reason: string) => {
    const reconnectReasons = ['ping timeout', 'transport close', 'transport error'];
    if (reconnectReasons.includes(reason)) return;
    router.push('/')
  });

  socket.on("error", (payload: { message: string }) => {
    alert(payload.message);
  })
}

const initializeHostSocket = (router: Router) => {
  const socket = io(config.backendUri, {
    query: {
      userId: getUserId(),
      roomCode: router.currentRoute.value.params.roomCode,
    }
  });

  const state: HostState = reactive({
    players: {},
    messages: [],
  });

  attachHostEvents(socket, state, router);

  return { socket, state };
};

export default initializeHostSocket;