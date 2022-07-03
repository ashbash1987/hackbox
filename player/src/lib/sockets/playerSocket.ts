import config from "@/config";
import { io, Socket } from "socket.io-client";
import type { Router } from "vue-router";
import type { PlayerState } from "@/types";
import { getUserId, getUserName, getRoomCode } from "@/lib/browserStorage";

const attachPlayerEvents = (socket: Socket, state: PlayerState, router: Router) => {
  socket.on("disconnect", (reason: string) => {
    const reconnectReasons = ['ping timeout', 'transport close', 'transport error'];
    if (reconnectReasons.includes(reason)) return;
    router.push('/')
  });

  socket.on("error", (payload: { message: string }) => {
    alert(payload.message);
  })

  socket.on('theme', (payload) => {
    state.theme = { ...state.theme, ...payload.theme };
  });

  socket.on('display', (payload) => {
    state.display = { ...state.display, ...payload.display };
  });
}

const initializePlayerSocket = (router: Router, state: PlayerState) => {
  const socket = io(config.backendUri, {
    query: {
      userType: 'player',
      userId: getUserId(),
      userName: getUserName(),
      roomCode: getRoomCode(),
    }
  });

  attachPlayerEvents(socket, state, router);

  return socket;
};

export default initializePlayerSocket;
