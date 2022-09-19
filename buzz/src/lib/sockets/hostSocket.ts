import { io, Socket } from "socket.io-client";
import type { Router } from "vue-router";
import { getUserId } from "@/lib/browserStorage";
import type GameState from "@/lib/GameState";
import type { Message } from "@/types";
import config from "@/config";

const attachHostEvents = (
  socket: Socket,
  gameState: GameState,
  router: Router
) => {
  socket.on("msg", (message: Message) => {
    gameState.messages.push(message);
  });

  socket.on("state.host", (payload) => {
    gameState.members = payload.members;
  });

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
};

const initializeHostSocket = (router: Router, gameState: GameState) => {
  const socket = io(config.backendUri, {
    query: {
      userId: getUserId(),
      roomCode: gameState.roomCode,
    },
  });

  attachHostEvents(socket, gameState, router);

  return { socket };
};

export default initializeHostSocket;
